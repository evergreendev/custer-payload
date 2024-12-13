import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Events: Block = {
  slug: 'events',
  interfaceName: 'Events',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        'horizontal',
        'vertical',
      ]
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
      name: 'limitEventsShown',
      type: 'checkbox'
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      admin: {
        condition: (data, siblingData, { user }) => {
          return siblingData.limitEventsShown
        }
      }
    }
  ],
  labels: {
    plural: 'Events Block',
    singular: 'Events Blocks',
  },
}
