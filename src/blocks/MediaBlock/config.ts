import type { Block } from 'payload'
import { link } from '@/fields/link'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'position',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Fullscreen',
          value: 'fullscreen',
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'enableLink',
      type: 'checkbox',
    },
    link({
      overrides: {
        admin: {
          condition: (_, { enableLink }) => Boolean(enableLink),
        },
      },
    }),
  ],
}
