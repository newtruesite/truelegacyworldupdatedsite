// @ts-ignore
import type * as Ort from 'onnxruntime-web'

const MODEL_URL = '/models/modnet-photographic-portrait-matting.onnx'
const REFERENCE_SIZE = 512
const ALPHA_THRESHOLD = 10

type OrtModule = any

let ortPromise: Promise<OrtModule> | null = null
let sessionPromise: Promise<any> | null = null

function getOrt(): Promise<OrtModule> {
  // @ts-ignore
  ortPromise ??= import('onnxruntime-web')
  return ortPromise
}

function getSession(): Promise<Ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = getOrt().then((ort) => {
      ort.env.wasm.numThreads = 1
      return ort.InferenceSession.create(MODEL_URL, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      })
    })
  }
  return sessionPromise
}

function loadImage(source: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(source)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read the uploaded image.'))
    }
    image.src = url
  })
}

function modelDimensions(width: number, height: number) {
  let outputWidth: number
  let outputHeight: number
  if (width >= height) {
    outputHeight = REFERENCE_SIZE
    outputWidth = Math.round((width / height) * REFERENCE_SIZE)
  } else {
    outputWidth = REFERENCE_SIZE
    outputHeight = Math.round((height / width) * REFERENCE_SIZE)
  }
  return {
    width: Math.max(32, outputWidth - (outputWidth % 32)),
    height: Math.max(32, outputHeight - (outputHeight % 32)),
  }
}

function canvasToTensor(canvas: HTMLCanvasElement, ort: OrtModule): Ort.Tensor {
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Canvas processing is unavailable.')
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
  const planeSize = canvas.width * canvas.height
  const data = new Float32Array(planeSize * 3)
  for (let index = 0; index < planeSize; index++) {
    const pixel = index * 4
    data[index] = (pixels[pixel] - 127.5) / 127.5
    data[planeSize + index] = (pixels[pixel + 1] - 127.5) / 127.5
    data[planeSize * 2 + index] = (pixels[pixel + 2] - 127.5) / 127.5
  }
  return new ort.Tensor('float32', data, [1, 3, canvas.height, canvas.width])
}

function toPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Could not encode portrait cutout.')),
      'image/png',
    )
  })
}

export async function removePortraitBackground(source: Blob): Promise<Blob> {
  const image = await loadImage(source)
  const dimensions = modelDimensions(image.naturalWidth, image.naturalHeight)

  const inputCanvas = document.createElement('canvas')
  inputCanvas.width = dimensions.width
  inputCanvas.height = dimensions.height
  const inputContext = inputCanvas.getContext('2d', { willReadFrequently: true })
  if (!inputContext) throw new Error('Canvas processing is unavailable.')
  inputContext.drawImage(image, 0, 0, dimensions.width, dimensions.height)

  const [ort, session] = await Promise.all([getOrt(), getSession()])
  const inputName = session.inputNames[0]
  const outputName = session.outputNames[0]
  const output = await session.run({ [inputName]: canvasToTensor(inputCanvas, ort) })
  const matte = output[outputName]
  if (!matte) throw new Error('The portrait model returned no subject mask.')

  const maskCanvas = document.createElement('canvas')
  maskCanvas.width = dimensions.width
  maskCanvas.height = dimensions.height
  const maskContext = maskCanvas.getContext('2d')
  if (!maskContext) throw new Error('Canvas processing is unavailable.')
  const maskImage = maskContext.createImageData(dimensions.width, dimensions.height)
  const matteValues = matte.data as Float32Array
  for (let index = 0; index < matteValues.length; index++) {
    const alpha = Math.max(0, Math.min(255, Math.round(matteValues[index] * 255)))
    const pixel = index * 4
    maskImage.data[pixel] = 255
    maskImage.data[pixel + 1] = 255
    maskImage.data[pixel + 2] = 255
    maskImage.data[pixel + 3] = alpha
  }
  maskContext.putImageData(maskImage, 0, 0)

  const outputCanvas = document.createElement('canvas')
  outputCanvas.width = image.naturalWidth
  outputCanvas.height = image.naturalHeight
  const outputContext = outputCanvas.getContext('2d', { willReadFrequently: true })
  if (!outputContext) throw new Error('Canvas processing is unavailable.')
  outputContext.drawImage(image, 0, 0)
  outputContext.globalCompositeOperation = 'destination-in'
  outputContext.imageSmoothingEnabled = true
  outputContext.imageSmoothingQuality = 'high'
  outputContext.drawImage(maskCanvas, 0, 0, outputCanvas.width, outputCanvas.height)
  outputContext.globalCompositeOperation = 'source-over'

  const pixels = outputContext.getImageData(0, 0, outputCanvas.width, outputCanvas.height).data
  let left = outputCanvas.width
  let top = outputCanvas.height
  let right = -1
  let bottom = -1
  for (let y = 0; y < outputCanvas.height; y++) {
    for (let x = 0; x < outputCanvas.width; x++) {
      if (pixels[(y * outputCanvas.width + x) * 4 + 3] <= ALPHA_THRESHOLD) continue
      left = Math.min(left, x)
      top = Math.min(top, y)
      right = Math.max(right, x)
      bottom = Math.max(bottom, y)
    }
  }
  if (right < left || bottom < top) throw new Error('No person was detected in this photo.')

  const subjectWidth = right - left + 1
  const subjectHeight = bottom - top + 1
  const paddingX = Math.round(subjectWidth * 0.04)
  const paddingTop = Math.round(subjectHeight * 0.035)
  const cropX = Math.max(0, left - paddingX)
  const cropY = Math.max(0, top - paddingTop)
  const cropRight = Math.min(outputCanvas.width, right + paddingX + 1)
  const cropBottom = Math.min(outputCanvas.height, bottom + Math.round(subjectHeight * 0.015) + 1)

  const cropped = document.createElement('canvas')
  cropped.width = cropRight - cropX
  cropped.height = cropBottom - cropY
  const croppedContext = cropped.getContext('2d')
  if (!croppedContext) throw new Error('Canvas processing is unavailable.')
  croppedContext.drawImage(
    outputCanvas,
    cropX,
    cropY,
    cropped.width,
    cropped.height,
    0,
    0,
    cropped.width,
    cropped.height,
  )
  return toPng(cropped)
}
