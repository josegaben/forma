/**
 * Shared SSRF & Input Sanitization Guard for forma Public Cloud Endpoints
 * Blocks non-HTTP(S) schemes (e.g. file://, data:, javascript:) and private/loopback/metadata hosts.
 */

const PRIVATE_OR_METADATA_HOST_RE =
  /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.0\.0\.0|\[?::1\]?|\[?fc00:|\[?fd[0-9a-f]{2}:|\[?fe80:|metadata\.google\.internal)/i;

const INTERNAL_TLD_RE = /\.(local|internal|localhost|lan|home\.arpa)$/i;

export function validatePublicHttpUrl(
  rawUrl: string
): { ok: true; url: URL } | { ok: false; error: string } {
  const cleaned = rawUrl.trim();
  if (!cleaned) {
    return { ok: false, error: "Provide a valid public `url`." };
  }

  // Reject explicit non-http schemes such as file://, javascript:, data:, ftp://
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(cleaned) && !/^https?:\/\//i.test(cleaned)) {
    return { ok: false, error: "Only `http://` and `https://` public URLs are allowed." };
  }

  let parsed: URL;
  try {
    parsed = new URL(/^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`);
  } catch {
    return { ok: false, error: "Invalid URL format." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only `http://` and `https://` public URLs are allowed." };
  }

  const host = parsed.hostname.toLowerCase();
  if (
    !host ||
    !host.includes(".") ||
    PRIVATE_OR_METADATA_HOST_RE.test(host) ||
    INTERNAL_TLD_RE.test(host)
  ) {
    return {
      ok: false,
      error: "Private, loopback, link-local, and metadata addresses are blocked.",
    };
  }

  return { ok: true, url: parsed };
}

export function escapeXml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
