import type { CollectionConfig } from 'payload'
import { BRICK_PANELS, BRICK_ROWS, BRICK_COLUMN_COUNT } from '@/utilities/bricks'
import { authenticated } from '@/access/authenticated'
import { importBricks } from '@/endpoints/importBricks'

export const Bricks: CollectionConfig = {
  slug: 'bricks',
  labels: {
    singular: 'Brick',
    plural: 'Bricks',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'panel', 'row', 'column', 'updatedAt'],
    components: {
      beforeListTable: ['@/components/Bricks/ImportBricks'],
    },
  },
  endpoints: [importBricks],
  indexes: [{ fields: ['panel', 'row', 'column'], unique: true }],
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Name or inscription as written on the brick. Duplicate titles are allowed.',
      },
    },
    {
      name: 'panel',
      type: 'select',
      required: true,
      options: BRICK_PANELS,
      admin: {
        description: 'Select the panel where the brick is located.',
      },
    },
    {
      name: 'row',
      type: 'select',
      required: true,
      options: BRICK_ROWS.map((letter) => ({ label: letter, value: letter })),
      admin: {
        description: 'Row (A-N)',
      },
    },
    {
      name: 'column',
      type: 'number',
      required: true,
      min: 1,
      max: BRICK_COLUMN_COUNT,
      admin: {
        description: 'Column (1-50)',
      },
      validate: (val) => {
        if (typeof val !== 'number') return 'Column must be a number'
        if (val < 1 || val > BRICK_COLUMN_COUNT) return 'Column must be between 1 and 50'
        if (!Number.isInteger(val)) return 'Column must be an integer'
        return true
      },
    },
  ],
  timestamps: true,
}

export default Bricks
