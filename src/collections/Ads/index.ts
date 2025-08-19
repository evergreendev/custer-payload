import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { revalidateAd } from './hooks/revalidateAd'

export const Ads: CollectionConfig = {
  slug: 'ads',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'publishedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media'
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media'
    },
    {
      name: 'impressions',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true, // Makes the field read-only in the admin panel
        position: 'sidebar'
      },
      hooks: {
        beforeChange: [
          ({ req }) => {
            if (!req.payloadAPI) {
              throw new Error('This field can only be updated via the Payload API.')
            }
          },
        ],
      },
    },
    {
      name: 'clicks',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true, // Makes the field read-only in the admin panel
        position: 'sidebar'
      },
      hooks: {
        beforeChange: [
          ({ req }) => {
            if (!req.payloadAPI) {
              throw new Error('This field can only be updated via the Payload API.')
            }
          },
        ],
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateAd],
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
