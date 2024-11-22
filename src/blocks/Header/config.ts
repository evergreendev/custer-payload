import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { linkGroup } from '@/fields/linkGroup'

export const Header: Block = {
  slug: 'header',
  interfaceName: 'HeaderBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'tall',
      label: 'Type',
      options: [
        {
          label: 'Regular',
          value: 'regular',
        },
        {
          label: 'Tall',
          value: 'tall',
        },
      ],
      required: true,
    },
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
    linkGroup({
      appearances: ['default', 'highlight','outline'],
    }),
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media'
    }
  ],
  labels: {
    plural: 'Header Block',
    singular: 'Header Blocks',
  },
}
