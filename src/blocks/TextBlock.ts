import type { Block } from 'payload'

export const TextBlock: Block = {
  slug: 'text',
  labels: {
    singular: 'Text',
    plural: 'Text Blocks'
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Line breaks (Enter) are preserved when rendered'
      }
    }
  ]
}
