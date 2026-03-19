const JOTFORM_EN = "https://form.jotform.com/260232994952060";
const JOTFORM_ES = "https://form.jotform.com/260246489849069";

/** Slug to ISO 3166-1 alpha-2 for flag images (flagcdn.com, etc.) */
export const SLUG_TO_ISO2: Record<string, string> = {
  usa: "us",
  canada: "ca",
  morocco: "ma",
  nigeria: "ng",
  colombia: "co",
  paraguay: "py",
  mexico: "mx",
  brazil: "br",
  uae: "ae",
  india: "in",
  malaysia: "my",
  turkey: "tr",
  spain: "es",
  eu: "eu",
};

/** flagcdn.com: w80 default, w160 for retina. Use getFlagImageUrl(slug, 80) and (slug, 160) for srcset. */
const FLAGCDN_WIDTHS = [20, 40, 80, 160] as const;

export function getFlagImageUrl(
  slug: string,
  width: 20 | 40 | 80 | 160 = 80,
): string {
  const iso2 = SLUG_TO_ISO2[slug] ?? slug.slice(0, 2);
  const w = FLAGCDN_WIDTHS.reduce((prev, curr) =>
    Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev,
  ) as 20 | 40 | 80 | 160;
  return `https://flagcdn.com/w${w}/${iso2}.png`;
}

/** Asia slugs that use local high-res flag assets under /assets/flags/asia/ */
const ASIA_FLAG_SLUGS = ["india", "malaysia"] as const;

/** Returns { src, srcSet } — local high-res for Asia (UAE, India, Malaysia), else flagcdn.com */
export function getFlagSrcSet(slug: string): { src: string; srcSet: string } {
  if (ASIA_FLAG_SLUGS.includes(slug as (typeof ASIA_FLAG_SLUGS)[number])) {
    const base = `/assets/flags/asia/${slug}`;
    return {
      src: `${base}.png`,
      srcSet: `${base}.png 1x, ${base}@2x.png 2x`,
    };
  }
  const iso2 = SLUG_TO_ISO2[slug] ?? slug.slice(0, 2);
  return {
    src: `https://flagcdn.com/w80/${iso2}.png`,
    srcSet: `https://flagcdn.com/w80/${iso2}.png 1x, https://flagcdn.com/w160/${iso2}.png 2x`,
  };
}

/** True Legacy LATAM Instagram — used for South American / Spanish country pages */
export const INSTAGRAM_LATAM = "https://instagram.com/truelegacylatam";

export interface Country {
  slug: string;
  name: string;
  nativeName: string;
  flag: string;
  flagEmoji: string;
  youtubeUrl: string;
  youtubeId: string;
  locale: "en" | "es" | "fr" | "pt";
  jotformUrl: string;
  youtube: string;
  instagram: string;
  region: string;
  mapX: number;
  mapY: number;
}

export const COUNTRIES: Country[] = [
  {
    slug: "usa",
    name: "United States",
    nativeName: "United States",
    flag: "🇺🇸",
    flagEmoji: "🇺🇸",
    youtubeUrl: "https://youtu.be/erTkubfkt9o",
    youtubeId: "erTkubfkt9o",
    locale: "en",
    jotformUrl: JOTFORM_EN,
    youtube: "https://youtube.com/@TrueLegacyWorld",
    instagram: "https://instagram.com/truelegacyworld",
    region: "North America",
    mapX: 18,
    mapY: 33,
  },
  {
    slug: "canada",
    name: "Canada",
    nativeName: "Canada",
    flag: "🇨🇦",
    flagEmoji: "🇨🇦",
    youtubeUrl: "https://youtu.be/IsfbMJ9QwAc",
    youtubeId: "IsfbMJ9QwAc",
    locale: "en",
    jotformUrl: JOTFORM_EN,
    youtube: "https://youtube.com/@TrueLegacyWorld",
    instagram: "https://instagram.com/truelegacyworld",
    region: "North America",
    mapX: 18,
    mapY: 22,
  },
  {
    slug: "morocco",
    name: "Morocco",
    nativeName: "Maroc",
    flag: "🇲🇦",
    flagEmoji: "🇲🇦",
    youtubeUrl: "https://youtu.be/HH8Yh2tLTKc",
    youtubeId: "HH8Yh2tLTKc",
    locale: "fr",
    jotformUrl: JOTFORM_EN,
    youtube: "https://youtube.com/@TrueLegacyWorld",
    instagram: "https://instagram.com/truelegacyworld",
    region: "Africa",
    mapX: 44,
    mapY: 37,
  },
  {
    slug: "nigeria",
    name: "Nigeria",
    nativeName: "Nigeria",
    flag: "🇳🇬",
    flagEmoji: "🇳🇬",
    youtubeUrl: "https://youtu.be/UjmZBpehCf8",
    youtubeId: "UjmZBpehCf8",
    locale: "en",
    jotformUrl: JOTFORM_EN,
    youtube: "https://youtube.com/@TrueLegacyWorld",
    instagram: "https://instagram.com/truelegacyworld",
    region: "Africa",
    mapX: 48,
    mapY: 47,
  },
  {
    slug: "colombia",
    name: "Colombia",
    nativeName: "Colombia",
    flag: "🇨🇴",
    flagEmoji: "🇨🇴",
    youtubeUrl: "https://www.youtube.com/watch?v=QxYHhQYQ8PY",
    youtubeId: "QxYHhQYQ8PY",
    locale: "es",
    jotformUrl: JOTFORM_ES,
    youtube: "https://youtube.com/@TrueLegacyLATAM",
    instagram: INSTAGRAM_LATAM,
    region: "Latin America",
    mapX: 26,
    mapY: 55,
  },
  {
    slug: "paraguay",
    name: "Paraguay",
    nativeName: "Paraguay",
    flag: "🇵🇾",
    flagEmoji: "🇵🇾",
    youtubeUrl: "https://www.youtube.com/watch?v=BkwOdIR_ZgU",
    youtubeId: "BkwOdIR_ZgU",
    locale: "es",
    jotformUrl: JOTFORM_ES,
    youtube: "https://youtube.com/@TrueLegacyLATAM",
    instagram: INSTAGRAM_LATAM,
    region: "Latin America",
    mapX: 29,
    mapY: 73,
  },
  {
    slug: "mexico",
    name: "Mexico",
    nativeName: "México",
    flag: "🇲🇽",
    flagEmoji: "🇲🇽",
    youtubeUrl: "https://www.youtube.com/watch?v=79WSQDzIzU4",
    youtubeId: "79WSQDzIzU4",
    locale: "es",
    jotformUrl: JOTFORM_ES,
    youtube: "https://youtube.com/@TrueLegacyLATAM",
    instagram: INSTAGRAM_LATAM,
    region: "Latin America",
    mapX: 16,
    mapY: 42,
  },
  {
    slug: "brazil",
    name: "Brazil",
    nativeName: "Brasil",
    flag: "🇧🇷",
    flagEmoji: "🇧🇷",
    youtubeUrl: "https://www.youtube.com/watch?v=xxvXOluPOrY",
    youtubeId: "xxvXOluPOrY",
    locale: "es",
    jotformUrl: JOTFORM_ES,
    youtube: "https://youtube.com/@TrueLegacyLATAM",
    instagram: INSTAGRAM_LATAM,
    region: "Latin America",
    mapX: 30,
    mapY: 64,
  },
  {
    slug: "uae",
    name: "United Arab Emirates",
    nativeName: "الإمارات العربية المتحدة",
    flag: "🇦🇪",
    flagEmoji: "🇦🇪",
    youtubeUrl: "https://youtu.be/z2SDWaSQ6mk",
    youtubeId: "z2SDWaSQ6mk",
    locale: "en",
    jotformUrl: JOTFORM_EN,
    youtube: "https://youtube.com/@TrueLegacyWorld",
    instagram: "https://instagram.com/truelegacyworld",
    region: "Middle East",
    mapX: 58,
    mapY: 42,
  },
  {
    slug: "india",
    name: "India",
    nativeName: "भारत",
    flag: "🇮🇳",
    flagEmoji: "🇮🇳",
    youtubeUrl: "https://youtu.be/O4uCeHhB8Us?si=ev8QSM59HASWSMdN",
    youtubeId: "O4uCeHhB8Us",
    locale: "en",
    jotformUrl: JOTFORM_EN,
    youtube: "https://youtube.com/@TrueLegacyWorld",
    instagram: "https://instagram.com/truelegacyworld",
    region: "Asia",
    mapX: 68,
    mapY: 45,
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    nativeName: "Malaysia",
    flag: "🇲🇾",
    flagEmoji: "🇲🇾",
    youtubeUrl: "https://youtu.be/I3Bk2L5nKW8",
    youtubeId: "I3Bk2L5nKW8",
    locale: "en",
    jotformUrl: JOTFORM_EN,
    youtube: "https://youtube.com/@TrueLegacyWorld",
    instagram: "https://instagram.com/truelegacyworld",
    region: "Asia",
    mapX: 76,
    mapY: 52,
  },
  {
    slug: "turkey",
    name: "Turkey",
    nativeName: "Türkiye",
    flag: "🇹🇷",
    flagEmoji: "🇹🇷",
    youtubeUrl: "https://youtu.be/k38vdhY-oM0",
    youtubeId: "k38vdhY-oM0",
    locale: "en",
    jotformUrl: JOTFORM_EN,
    youtube: "https://youtube.com/@TrueLegacyWorld",
    instagram: "https://instagram.com/truelegacyworld",
    region: "Europe",
    mapX: 54,
    mapY: 36,
  },
  {
    slug: "spain",
    name: "Spain",
    nativeName: "España",
    flag: "🇪🇸",
    flagEmoji: "🇪🇸",
    youtubeUrl: "https://youtube.com/@TrueLegacyWorld",
    youtubeId: "",
    locale: "es",
    jotformUrl: JOTFORM_ES,
    youtube: "https://youtube.com/@TrueLegacyWorld",
    instagram: "https://instagram.com/truelegacyworld",
    region: "Europe",
    mapX: 44,
    mapY: 27,
  },
  {
    slug: "eu",
    name: "European Union",
    nativeName: "European Union",
    flag: "🇪🇺",
    flagEmoji: "🇪🇺",
    youtubeUrl: "https://youtu.be/e-qng7hTmM0",
    youtubeId: "e-qng7hTmM0",
    locale: "en",
    jotformUrl: JOTFORM_EN,
    youtube: "https://youtube.com/@TrueLegacyWorld",
    instagram: "https://instagram.com/truelegacyworld",
    region: "Europe",
    mapX: 50,
    mapY: 28,
  },
];

export const COUNTRY_CONNECTIONS = [
  { from: "usa", to: "canada" },
  { from: "usa", to: "morocco" },
  { from: "usa", to: "colombia" },
  { from: "usa", to: "mexico" },
  { from: "morocco", to: "nigeria" },
  { from: "colombia", to: "brazil" },
  { from: "brazil", to: "paraguay" },
  { from: "mexico", to: "colombia" },
];

export function getCountryBySlug(slug: string): Country | undefined {
  return COUNTRIES.find((c) => c.slug === slug);
}
