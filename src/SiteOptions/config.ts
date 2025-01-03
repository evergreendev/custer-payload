import type { GlobalConfig } from 'payload'

import { revalidateSiteOptions } from './hooks/revalidateSiteOptions'
import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const SiteOptions: GlobalConfig = {
  slug: 'siteOptions',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "text",
      required: true,
      name: "siteTitle"
    },
    {
      type: "upload",
      relationTo: "media",
      name: "siteLogo",
      required: true,
    },
    {
      type: "upload",
      relationTo: "media",
      name: "siteLogoLight",
    },
    {
      type: "richText",
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
      name: "contactInfo",
    }
  ],
  hooks: {
    afterChange: [revalidateSiteOptions],
  },
}
