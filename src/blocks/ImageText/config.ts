import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { linkGroup } from '@/fields/linkGroup'

export const ImageText: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'oneImage',
      label: 'Type',
      options: [
        {
          label: 'Two Image',
          value: 'twoImage',
        },
        {
          label: 'One Image',
          value: 'oneImage',
        },
        {
          label: 'Overlap',
          value: 'overlap',
        },
      ],
      required: true,
    },
    {
      name: 'image',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        linkGroup({
          appearances: ['default', 'highlight', 'outline'],
          overrides: { maxRows: 1 },
        }),
      ],
      admin: {
        condition: (data, siblingData) => {

          return siblingData.type === 'oneImage' || siblingData.type === 'overlap'
        },
      },
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        condition: (data, siblingData) => {
          return siblingData.type === 'twoImage'
        },
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        linkGroup({
          appearances: ['default'],
          overrides: { maxRows: 1 },
        }),
      ],
      maxRows: 2,
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
      name: 'cta',
      label: 'Call to Action',
      type: 'group',
      admin: {
        condition: (data, siblingData) => {
          return siblingData.type === 'overlap'
        },
      },
      fields: [
        {
          name: 'text',
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
          })
        },
        linkGroup({
          appearances: ['default'],
          overrides: { maxRows: 1 },
        }),
      ],
    },
    {
      name: 'background',
      type: 'select',
      options: ['white','red','blue','image']
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      admin: {
        condition: (data, siblingData) => {
          return siblingData.background === 'image'
        },
      },
      relationTo: 'media',
    },
    {
      name: 'reverseColumns',
      type: 'checkbox'
    }
  ],
  labels: {
    plural: 'Image and Text Block',
    singular: 'Image and Text Blocks',
  },
}
