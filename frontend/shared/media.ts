import { mediaManifest, type MediaManifestKey } from "@shared/generated/media-manifest";

export const RESPONSIVE_WIDTHS = [400, 800, 1200] as const;
export const HERO_IMAGE_SIZES = "100vw";
export const CARD_IMAGE_SIZES = "(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px";
export const THUMBNAIL_IMAGE_SIZES = "(max-width: 768px) 96px, 120px";

type ResponsiveWidth = (typeof RESPONSIVE_WIDTHS)[number];

function getClosestWidth(width: number): ResponsiveWidth {
  return RESPONSIVE_WIDTHS.reduce((closest, candidate) => {
    return Math.abs(candidate - width) < Math.abs(closest - width) ? candidate : closest;
  }, RESPONSIVE_WIDTHS[0]);
}

export function getLocalMediaSrc(
  key: MediaManifestKey,
  width: number,
  format: "avif" | "webp" = "avif",
) {
  const entry = mediaManifest[key];
  return entry?.[format]?.[getClosestWidth(width)];
}

export function getLocalBlurDataURL(key: MediaManifestKey) {
  return mediaManifest[key]?.blurDataURL ?? "";
}

export function normalizeRemoteImage(src: string, preferredWidth = 800, quality = 70) {
  if (!src) {
    return src;
  }

  try {
    const width = getClosestWidth(preferredWidth);
    const url = new URL(src);

    if (url.hostname === "images.unsplash.com") {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("q", String(quality));
      url.searchParams.set("w", String(width));
      return url.toString();
    }

    if (url.hostname === "res.cloudinary.com" && url.pathname.includes("/upload/")) {
      const [prefix, suffix] = url.pathname.split("/upload/");
      const transformation = `f_auto,q_auto:good,c_limit,w_${width}`;
      url.pathname = `${prefix}/upload/${transformation}/${suffix}`;
      return url.toString();
    }

    if (url.hostname === "ui-avatars.com") {
      url.searchParams.set("size", String(width));
      url.searchParams.set("format", "webp");
      return url.toString();
    }

    if (url.hostname === "api.qrserver.com") {
      url.searchParams.set("size", `${width}x${width}`);
      return url.toString();
    }

    return url.toString();
  } catch {
    return src;
  }
}
