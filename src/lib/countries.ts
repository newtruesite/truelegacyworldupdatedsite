const JOTFORM_EN = 'https://form.jotform.com/260232994952060'
const JOTFORM_ES = 'https://form.jotform.com/260246489849069'

/** Slug to ISO 3166-1 alpha-2 for flag images (flagcdn.com, etc.) */
export const SLUG_TO_ISO2: Record<string, string> = {
    usa: 'us',
    canada: 'ca',
    morocco: 'ma',
    nigeria: 'ng',
    colombia: 'co',
    paraguay: 'py',
    mexico: 'mx',
    brazil: 'br',
}

/** flagcdn.com only supports w20, w40, w80, w160 (w96 etc. fail) — use 160 for HD */
const FLAGCDN_WIDTHS = [20, 40, 80, 160] as const

export function getFlagImageUrl(slug: string, width = 80): string {
    const iso2 = SLUG_TO_ISO2[slug] ?? slug.slice(0, 2)
    const w = FLAGCDN_WIDTHS.reduce((prev, curr) =>
        Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
    )
    return `https://flagcdn.com/w${w}/${iso2}.png`
}

export interface Country {
    slug: string
    name: string
    nativeName: string
    flag: string
    flagEmoji: string
    youtubeUrl: string
    youtubeId: string
    locale: 'en' | 'es'
    jotformUrl: string
    youtube: string
    instagram: string
    region: string
    mapX: number
    mapY: number
}

export const COUNTRIES: Country[] = [
    {
        slug: 'usa',
        name: 'United States',
        nativeName: 'United States',
        flag: '🇺🇸',
        flagEmoji: '🇺🇸',
        youtubeUrl: 'https://youtu.be/erTkubfkt9o',
        youtubeId: 'erTkubfkt9o',
        locale: 'en',
        jotformUrl: JOTFORM_EN,
        youtube: 'https://youtube.com/@TrueLegacyWorld',
        instagram: 'https://instagram.com/truelegacyworld',
        region: 'North America',
        mapX: 18,
        mapY: 33,
    },
    {
        slug: 'canada',
        name: 'Canada',
        nativeName: 'Canada',
        flag: '🇨🇦',
        flagEmoji: '🇨🇦',
        youtubeUrl: 'https://youtu.be/IsfbMJ9QwAc',
        youtubeId: 'IsfbMJ9QwAc',
        locale: 'en',
        jotformUrl: JOTFORM_EN,
        youtube: 'https://youtube.com/@TrueLegacyWorld',
        instagram: 'https://instagram.com/truelegacyworld',
        region: 'North America',
        mapX: 18,
        mapY: 22,
    },
    {
        slug: 'morocco',
        name: 'Morocco',
        nativeName: 'Morocco',
        flag: '🇲🇦',
        flagEmoji: '🇲🇦',
        youtubeUrl: 'https://youtu.be/HH8Yh2tLTKc',
        youtubeId: 'HH8Yh2tLTKc',
        locale: 'en',
        jotformUrl: JOTFORM_EN,
        youtube: 'https://youtube.com/@TrueLegacyWorld',
        instagram: 'https://instagram.com/truelegacyworld',
        region: 'Africa',
        mapX: 44,
        mapY: 37,
    },
    {
        slug: 'nigeria',
        name: 'Nigeria',
        nativeName: 'Nigeria',
        flag: '🇳🇬',
        flagEmoji: '🇳🇬',
        youtubeUrl: 'https://youtu.be/UjmZBpehCf8',
        youtubeId: 'UjmZBpehCf8',
        locale: 'en',
        jotformUrl: JOTFORM_EN,
        youtube: 'https://youtube.com/@TrueLegacyWorld',
        instagram: 'https://instagram.com/truelegacyworld',
        region: 'Africa',
        mapX: 48,
        mapY: 47,
    },
    {
        slug: 'colombia',
        name: 'Colombia',
        nativeName: 'Colombia',
        flag: '🇨🇴',
        flagEmoji: '🇨🇴',
        youtubeUrl: 'https://youtu.be/xpQ6KHcCfJs',
        youtubeId: 'xpQ6KHcCfJs',
        locale: 'es',
        jotformUrl: JOTFORM_ES,
        youtube: 'https://youtube.com/@TrueLegacyLATAM',
        instagram: 'https://instagram.com/truelegacyworld',
        region: 'Latin America',
        mapX: 26,
        mapY: 55,
    },
    {
        slug: 'paraguay',
        name: 'Paraguay',
        nativeName: 'Paraguay',
        flag: '🇵🇾',
        flagEmoji: '🇵🇾',
        youtubeUrl: 'https://youtu.be/EMvZOe6im-U',
        youtubeId: 'EMvZOe6im-U',
        locale: 'es',
        jotformUrl: JOTFORM_ES,
        youtube: 'https://youtube.com/@TrueLegacyLATAM',
        instagram: 'https://instagram.com/truelegacyworld',
        region: 'Latin America',
        mapX: 29,
        mapY: 73,
    },
    {
        slug: 'mexico',
        name: 'Mexico',
        nativeName: 'México',
        flag: '🇲🇽',
        flagEmoji: '🇲🇽',
        youtubeUrl: 'https://youtu.be/3dBfFcLL3jU',
        youtubeId: '3dBfFcLL3jU',
        locale: 'en',
        jotformUrl: JOTFORM_EN,
        youtube: 'https://youtube.com/@TrueLegacyLATAM',
        instagram: 'https://instagram.com/truelegacyworld',
        region: 'Latin America',
        mapX: 16,
        mapY: 42,
    },
    {
        slug: 'brazil',
        name: 'Brazil',
        nativeName: 'Brasil',
        flag: '🇧🇷',
        flagEmoji: '🇧🇷',
        youtubeUrl: 'https://youtu.be/tLHc0PaCdsE',
        youtubeId: 'tLHc0PaCdsE',
        locale: 'es',
        jotformUrl: JOTFORM_ES,
        youtube: 'https://youtube.com/@TrueLegacyLATAM',
        instagram: 'https://instagram.com/truelegacyworld',
        region: 'Latin America',
        mapX: 30,
        mapY: 64,
    },
]

export const COUNTRY_CONNECTIONS = [
    { from: 'usa', to: 'canada' },
    { from: 'usa', to: 'morocco' },
    { from: 'usa', to: 'colombia' },
    { from: 'usa', to: 'mexico' },
    { from: 'morocco', to: 'nigeria' },
    { from: 'colombia', to: 'brazil' },
    { from: 'brazil', to: 'paraguay' },
    { from: 'mexico', to: 'colombia' },
]

export function getCountryBySlug(slug: string): Country | undefined {
    return COUNTRIES.find((c) => c.slug === slug)
}
