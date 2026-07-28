export type PlausibleEvent =
  | 'hero_dwell_time'
  | 'cta_click'
  | 'notebook_hover'
  | 'notebook_click'
  | 'glossary_open'
  | 'pdf_download'
  | 'form_submit'
  | 'form_error'
  | 'video_play'
  | 'video_complete'
  | 'three_mode'
  | 'scroll_depth';

interface PlausibleWindow extends Window {
  plausible?: (event: PlausibleEvent, options?: { props?: Record<string, string | number> }) => void;
}

export function trackEvent(name: PlausibleEvent, props?: Record<string, string | number>): void {
  if (typeof window === 'undefined') return;
  const w = window as PlausibleWindow;
  if (typeof w.plausible === 'function') {
    w.plausible(name, props ? { props } : undefined);
  }
}

// Self-hosted Plausible domain
export const PLAUSIBLE_DOMAIN = 'energyflow.lab';
export const PLAUSIBLE_SCRIPT_URL = 'https://plausible.energyflow.lab/js/script.js';
