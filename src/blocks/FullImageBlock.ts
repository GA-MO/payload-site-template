import type { Block } from "payload";

export const FullImageBlock: Block = {
  slug: "full-image",
  labels: {
    singular: "Full Image",
    plural: "Full Images",
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
  ],
};
