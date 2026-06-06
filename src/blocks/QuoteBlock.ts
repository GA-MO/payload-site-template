import type { Block } from 'payload'

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: {
    singular: 'Quote',
    plural: 'Quotes'
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true
    },
    {
      name: 'by',
      label: 'By',
      type: 'text',
      required: true,
      admin: {
        description: 'Who said it (e.g. Jane Doe, Creative Director)'
      }
    }
  ]
}
