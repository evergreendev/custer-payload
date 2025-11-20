import type { CollectionConfig } from 'payload'

export const Bricks: CollectionConfig = {
  slug: 'bricks',
  labels: {
    singular: 'Brick',
    plural: 'Bricks',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'panel', 'row', 'column', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'panel',
      type: 'select',
      required: true,
      options: [
        { label: 'Panel 1 E', value: 'panel-1-e' },
        { label: 'Panel 2 E', value: 'panel-2-e' },
        { label: 'Panel 3 E', value: 'panel-3-e' },
        { label: 'Panel 4 E', value: 'panel-4-e' },
        { label: 'Panel 5 E', value: 'panel-5-e' },
        { label: 'Panel 1 W', value: 'panel-1-w' },
        { label: 'Panel 2 W', value: 'panel-2-w' },
        { label: 'Panel 3 W', value: 'panel-3-w' },
        { label: 'Panel 4 W', value: 'panel-4-w' },
        { label: 'Panel 5 W', value: 'panel-5-w' },
      ],
      admin: {
        description: 'Select the panel where the brick is located.',
      },
    },
    {
      name: 'row',
      type: 'select',
      required: true,
      options: Array.from({ length: 13 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i)).map(
        (letter) => ({ label: letter, value: letter }),
      ),
      admin: {
        description: 'Row (A–M)',
      },
    },
    {
      name: 'column',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      admin: {
        description: 'Column (1–10)',
      },
      validate: (val) => {
        if (typeof val !== 'number') return 'Column must be a number'
        if (val < 1 || val > 10) return 'Column must be between 1 and 10'
        if (!Number.isInteger(val)) return 'Column must be an integer'
        return true
      },
    },
  ],
  timestamps: true,
}

export default Bricks
