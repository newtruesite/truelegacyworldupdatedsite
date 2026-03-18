/**
 * Smart distributor routing based on country
 * Supports LATAM-specific and global distributor pages
 */

const LATAM_COUNTRIES = ["brazil", "mexico", "colombia", "paraguay"];

/**
 * Get the correct distributor page link for a country
 * @param countrySlug - Country slug (e.g., 'usa', 'mexico')
 * @returns Distributor page path (e.g., '/distributors' or '/latam/distributors')
 */
export function getDistributorLink(countrySlug?: string): string {
  return isLatamCountry(countrySlug) ? "/latam/distributors" : "/distributors";
}

/**
 * Check if a country is in the LATAM region
 */
export function isLatamCountry(countrySlug?: string): boolean {
  return LATAM_COUNTRIES.includes(countrySlug ?? "");
}

/**
 * Get LATAM countries list
 */
export function getLatamCountries(): string[] {
  return [...LATAM_COUNTRIES];
}
