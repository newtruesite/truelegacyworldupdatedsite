/**
 * True Legacy Presentation Center Configuration & Data Architecture
 * Centralizes presentation URLs, version metadata, and presentation items.
 */

// Configurable URLs
export const TRUE_LEGACY_PRESENTATION_CANVA_URL = 'https://canva.link/cgnoo41cjkcbzgm';
export const TRUE_LEGACY_PRESENTATION_URL = 'https://canva.link/cgnoo41cjkcbzgm';
export const TRUE_LEGACY_PRESENTATION_PDF_URL = ''; // Leave empty if PDF is unconfigured; button will gracefully disable

export interface PresentationItem {
  id: string;
  title: string;
  description: string;
  category?: 'opportunity' | 'duo' | 'product' | 'k8' | 'emguarde' | 'general';
  language: 'en' | 'es' | 'fr' | 'pt' | string;
  audience?: string;
  thumbnail?: string;
  presentationUrl?: string;
  pdfUrl?: string;
  canvaUrl?: string;
  isOfficial: boolean;
  isCustomizable?: boolean;
  isFeatured?: boolean;
  version?: string;
  updatedAt?: string;
  isNew?: boolean;
}

export const OFFICIAL_PRESENTATIONS: PresentationItem[] = [
  {
    id: 'official-true-legacy-presentation',
    title: 'True Legacy Presentation',
    description:
      'The official presentation designed to help you walk prospects through the vision, products, business opportunity, and True Legacy system with a clear and consistent message.',
    category: 'opportunity',
    language: 'en',
    thumbnail: '/assets/business-opportunity-preview.jpg',
    presentationUrl: TRUE_LEGACY_PRESENTATION_URL,
    pdfUrl: TRUE_LEGACY_PRESENTATION_PDF_URL,
    canvaUrl: TRUE_LEGACY_PRESENTATION_CANVA_URL,
    isOfficial: true,
    isCustomizable: false,
    isFeatured: true,
    version: '1.0',
    updatedAt: 'September 2026',
    isNew: false,
  },
];
