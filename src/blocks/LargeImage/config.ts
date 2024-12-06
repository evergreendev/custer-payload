import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { linkGroup } from '@/fields/linkGroup'

export const LargeImage: Block = {
  slug: 'largeImage',
  interfaceName: 'largeImageBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'default',
      label: 'Type',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Boxed Text',
          value: "boxedText"
        }
      ],
      required: true,
    },
    {
      name: 'content',
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
      label: 'Content',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true
    },
    linkGroup({
      appearances: ['default', 'highlight', 'outline'],
      overrides: { maxRows: 1 },
    }),
  ],
  labels: {
    plural: 'Large Image Blocks',
    singular: 'Large Image Block',
  },
}
