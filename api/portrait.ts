import {
  ACTIVE_STYLE_REFERENCES,
  PORTRAIT_ASPECT_RATIO,
  TRUE_LEGACY_LEADER_PORTRAIT_PROMPT,
} from '../src/config/portraitStandard.js'

export const config = { runtime: 'edge' }

const SUPABASE_URL = 'https://mzadjxuylfphlpytmwfs.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ls2RRkWYCU5RVdbGRg-c1A_koMxCwA1'

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'Authentication required' }, 401)

  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { authorization, apikey: SUPABASE_PUBLISHABLE_KEY },
  })
  if (!userResponse.ok) return json({ error: 'Invalid or expired session' }, 401)

  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) return json({ error: 'Portrait provider is not configured' }, 503)

  const incoming = await request.formData()
  const source = incoming.get('source')
  if (!(source instanceof File) || !source.type.startsWith('image/')) {
    return json({ error: 'A valid source image is required' }, 400)
  }
  if (source.size > 10 * 1024 * 1024) return json({ error: 'Source image exceeds 10 MB' }, 413)

  const form = new FormData()
  form.append('model', 'gpt-image-1')
  const sourceExtension = source.type === 'image/jpeg' ? 'jpg' : source.type === 'image/webp' ? 'webp' : 'png'
  form.append('image[]', source, `portrait-source.${sourceExtension}`)

  const origin = new URL(request.url).origin
  for (const reference of ACTIVE_STYLE_REFERENCES.slice(0, 3)) {
    const response = await fetch(new URL(reference.url, origin))
    if (!response.ok) continue
    const blob = await response.blob()
    form.append('image[]', new File([blob], `${reference.id}.png`, { type: blob.type || 'image/png' }))
  }

  form.append('prompt', TRUE_LEGACY_LEADER_PORTRAIT_PROMPT)
  form.append('n', '1')
  form.append('size', PORTRAIT_ASPECT_RATIO)
  form.append('quality', 'high')
  form.append('input_fidelity', 'high')

  const openaiResponse = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { authorization: `Bearer ${openaiKey}` },
    body: form,
  })

  const body = await openaiResponse.text()
  if (!openaiResponse.ok) {
    let errorCode = 'unknown_error'
    let errorMessage = body.slice(0, 500)
    try {
      const parsed = JSON.parse(body) as { error?: { code?: string; message?: string } }
      errorCode = parsed.error?.code || errorCode
      errorMessage = parsed.error?.message || errorMessage
    } catch {
      // Keep the bounded response text for diagnostics.
    }
    console.error('OpenAI portrait edit rejected', {
      status: openaiResponse.status,
      code: errorCode,
      message: errorMessage,
      sourceType: source.type,
      sourceSize: source.size,
    })
  }
  return new Response(body, {
    status: openaiResponse.status,
    headers: {
      'content-type': openaiResponse.headers.get('content-type') || 'application/json',
      'cache-control': 'no-store',
    },
  })
}
