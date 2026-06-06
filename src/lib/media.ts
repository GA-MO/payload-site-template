import type { Media } from "@/payload-types";

export type ImageSize = "thumbnail" | "card" | "feature";

// Payload prefixes uploads with serverURL, so media URLs are absolute. next/image
// serves same-origin paths directly but blocks fetching absolute URLs that resolve
// to a loopback/private IP (SSRF guard) — reduce them to a relative path.
export function toMediaPath(url: string): string {
  if (url.startsWith("/")) return url;
  const { pathname, search } = new URL(url);
  return pathname + search;
}

export function mediaUrl(
  media: number | Media | null | undefined,
  size: ImageSize = "feature",
): string | null {
  if (typeof media !== "object" || media === null) return null;
  const url = media.sizes?.[size]?.url ?? media.url;
  return url ? toMediaPath(url) : null;
}

export function mediaAlt(
  media: number | Media | null | undefined,
  fallback = "",
): string {
  if (typeof media !== "object" || media === null) return fallback;
  return media.alt ?? fallback;
}

export type MediaImage = { url: string; width: number; height: number; alt: string };

// next/image needs intrinsic width/height. Use the requested size's dimensions
// when that rendition exists, else fall back to the original upload's.
export function mediaImage(
  media: number | Media | null | undefined,
  size: ImageSize = "feature",
): MediaImage | null {
  if (typeof media !== "object" || media === null) return null;
  const sized = media.sizes?.[size];
  const url = sized?.url ?? media.url;
  const width = sized?.width ?? media.width;
  const height = sized?.height ?? media.height;
  if (!url || !width || !height) return null;
  return { url: toMediaPath(url), width, height, alt: media.alt ?? "" };
}
