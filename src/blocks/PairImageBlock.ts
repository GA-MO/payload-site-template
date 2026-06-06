import type { Block } from "payload";

export const PairImageBlock: Block = {
  slug: "pair-image",
  labels: {
    singular: "Image Pair (1:1)",
    plural: "Image Pairs",
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "imageA",
          label: "Image A",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: { width: "50%" },
        },
        {
          name: "imageB",
          label: "Image B",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: { width: "50%" },
        },
      ],
    },
  ],
};
