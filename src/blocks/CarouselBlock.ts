import type { Block } from 'payload'

export const CarouselBlock: Block = {
  slug: 'carousel',
  labels: {
    singular: 'Image Carousel',
    plural: 'Image Carousels'
  },
  fields: [
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: {
        description: 'Minimum 3 images (unlimited)'
      },
      validate: (value) => {
        const arr = Array.isArray(value) ? value : value ? [value] : []
        if (arr.length < 3) return 'Minimum 3 images'
        return true
      }
    }
  ]
}
