/** Adapted from signalworks-modules/attribution */

export type AttributionTouch = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  landingPage: string | null;
  referrer: string | null;
  capturedAt: string;
};

function clean(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().slice(0, 500);
  return trimmed.length > 0 ? trimmed : null;
}

export function parseAttributionFromSearchParams(
  searchParams: URLSearchParams,
  landingPage: string,
  referrer: string | null,
  capturedAt = new Date().toISOString(),
): AttributionTouch {
  return {
    utmSource: clean(searchParams.get("utm_source")),
    utmMedium: clean(searchParams.get("utm_medium")),
    utmCampaign: clean(searchParams.get("utm_campaign")),
    utmTerm: clean(searchParams.get("utm_term")),
    utmContent: clean(searchParams.get("utm_content")),
    landingPage: clean(landingPage),
    referrer: clean(referrer),
    capturedAt,
  };
}
