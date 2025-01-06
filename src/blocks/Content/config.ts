import type { Block, Field } from 'payload'

import {
  AlignFeature,
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature, HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor, OrderedListFeature, ParagraphFeature, UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { FormBlock } from '@/blocks/Form/config'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          AlignFeature(),
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          BlocksFeature({ blocks: [Banner, Code, MediaBlock, FormBlock] }),
          OrderedListFeature(),
          UnorderedListFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
          AlignFeature()
        ]
      },
    }),
    label: false,
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
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
    },
  ],
}
