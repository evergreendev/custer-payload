import type { GlobalConfig } from 'payload'

import { revalidateSiteOptions } from './hooks/revalidateSiteOptions'

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
    }
  ],
  hooks: {
    afterChange: [revalidateSiteOptions],
  },
}
