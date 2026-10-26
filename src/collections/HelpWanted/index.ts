import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { validateHelpWantedLink } from '@/utilities/helpWantedValidation'

export const HelpWanted: CollectionConfig = {
  slug: 'help-wanted',
  labels: { singular: 'Help Wanted Listing', plural: 'Help Wanted' },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'updatedAt'],
    description: 'Review public submissions, then publish approved help wanted listings.',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image/' } },
    },
    { name: 'description', type: 'textarea', required: true },
    { name: 'link', type: 'text', required: true, validate: validateHelpWantedLink },
    { name: 'linkLabel', type: 'text', required: true },
  ],
  versions: { drafts: true, maxPerDoc: 50 },
}
