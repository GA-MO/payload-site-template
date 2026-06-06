import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "System",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: {
    // GIF is already covered by image/*. Sharp-based resize/format only run on
    // image MIME types; video uploads are stored as-is.
    mimeTypes: ["image/*", "video/*"],
    // Cap the stored original so backups/disk stay lean — a phone/camera export
    // never lands at 6000px / multi-MB. Only shrinks (withoutEnlargement).
    resizeOptions: { width: 1920, height: 1920, fit: "inside", withoutEnlargement: true },
    // Store the original (and every derivative) as WebP — the single biggest
    // storage win. Safe here: no animated GIFs in use, video is left untouched.
    formatOptions: { format: "webp", options: { quality: 75 } },
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre", formatOptions: { format: "webp", options: { quality: 75 } } },
      { name: "card", width: 1024, height: undefined, position: "centre", formatOptions: { format: "webp", options: { quality: 75 } } },
      { name: "feature", width: 1920, height: undefined, position: "centre", formatOptions: { format: "webp", options: { quality: 75 } } },
    ],
    adminThumbnail: "thumbnail",
  },
}
