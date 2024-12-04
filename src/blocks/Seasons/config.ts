import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Seasons: Block = {
  slug: 'seasons',
  interfaceName: 'Seasons',
  fields: [
    {
      name: 'springImage',
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: 'summerImage',
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: 'autumnImage',
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: 'winterImage',
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: 'yearRoundImage',
      type: "upload",
      relationTo: "media",
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
      name: "springItems",
      type: "relationship",
      relationTo: ["members","pages"],
      hasMany: true,
      minRows: 3
    },
    {
      name: "summerItems",
      type: "relationship",
      relationTo: ["members","pages"],
      hasMany: true,
      minRows: 3
    },
    {
      name: "autumnItems",
      type: "relationship",
      relationTo: ["members","pages"],
      hasMany: true,
      minRows: 3
    },
    {
      name: "winterItems",
      type: "relationship",
      relationTo: ["members","pages"],
      hasMany: true,
      minRows: 3
    },
    {
      name: "yearRoundItems",
      type: "relationship",
      relationTo: ["members","pages"],
      hasMany: true,
      minRows: 3
    },
  ],
  labels: {
    plural: 'Seasons Block',
    singular: 'Seasons Blocks',
  },
}
