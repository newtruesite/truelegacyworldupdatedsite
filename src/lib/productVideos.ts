export const PRODUCT_VIDEOS = {
  emguardeGo: {
    en: 'https://youtu.be/5wuY1dKjHds?si=vcnbY2g3ABd3G8Lh',
    es: 'https://youtu.be/BS4QEM-zXf0?si=DkYsXEEcPzZbuCYN',
  },
  kangenWater: {
    en: 'https://youtu.be/1nkOCId-SfQ?si=VrljKk4NTXcxj49g',
    es: 'https://youtu.be/6A_UpRmoWWc?si=wQbjPjpgnKiElghe',
  },
} as const

export function localizedProductVideo(product: keyof typeof PRODUCT_VIDEOS, locale: string) {
  return PRODUCT_VIDEOS[product][locale === 'es' ? 'es' : 'en']
}
