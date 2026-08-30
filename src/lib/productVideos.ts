export const PRODUCT_VIDEOS = {
  emguardeGo: {
    en: 'https://youtu.be/5wuY1dKjHds?si=vcnbY2g3ABd3G8Lh',
    es: 'https://youtu.be/BS4QEM-zXf0?si=DkYsXEEcPzZbuCYN',
    fr: 'https://youtu.be/5wuY1dKjHds?si=vcnbY2g3ABd3G8Lh',
    pt: 'https://youtu.be/BS4QEM-zXf0?si=DkYsXEEcPzZbuCYN',
  },
  kangenWater: {
    en: 'https://youtu.be/1nkOCId-SfQ?si=VrljKk4NTXcxj49g',
    es: 'https://youtu.be/6A_UpRmoWWc?si=wQbjPjpgnKiElghe',
    fr: 'https://youtu.be/1nkOCId-SfQ?si=VrljKk4NTXcxj49g',
    pt: 'https://youtu.be/6A_UpRmoWWc?si=wQbjPjpgnKiElghe',
  },
} as const

export function localizedProductVideo(product: keyof typeof PRODUCT_VIDEOS, locale: string) {
  const map = PRODUCT_VIDEOS[product] as Record<string, string>
  return map[locale] || (locale === 'es' || locale === 'pt' ? map.es : map.en)
}

