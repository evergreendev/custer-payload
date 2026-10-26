import type { Block } from 'payload'

export const HelpWantedBlock: Block = {
  slug: 'helpWanted',
  interfaceName: 'HelpWantedBlock',
  labels: {
    singular: 'Help Wanted',
    plural: 'Help Wanted Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Help Wanted',
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
