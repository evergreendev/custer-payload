import type { Block } from 'payload'

export const BrickFinderBlock: Block = {
  slug: 'brickFinder',
  interfaceName: 'BrickFinder',
  labels: {
    singular: 'Brick Finder',
    plural: 'Brick Finders',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: false,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
    },
  ],
}

export default BrickFinderBlock
