import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

import { revalidatePopUp } from '@/collections/PopUps/hooks/revalidatePopUp'
import { linkGroup } from '@/fields/linkGroup'

export const PopUps: CollectionConfig = {
  slug: "popUp",
  admin: {
    useAsTitle: "headerText",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  fields: [
    {
      name: "headerImage",
      type: "upload",
      relationTo: "media"
    },
    {
      name: "headerText",
      type: "text",
    },
    {
      name: "bodyText",
      type: "richText"
    },
    linkGroup({
      appearances: ['default', 'highlight'],
    }),
    {
      name: "priority",
      type: "number",
      min: 0,
      defaultValue: 10,
      admin:{
        description: "When multiple popups are active the one with the lowest priority is shown."
      }
    },
    {
      name: "startShowing",
      type: "date",
      admin: {
        position: "sidebar"
      },
    },
    {
      name: "stopShowing",
      type: "date",
      admin: {
        position: "sidebar"
      },
    },
    {
      name: "showOnAllPages",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar"
      }
    },
    {
      name: "pages",
      type: "relationship",
      relationTo: ["pages","categories","events","members"],
      hasMany: true,
      admin: {
        condition: (data, siblingData, { user }) => {
          return !siblingData.showOnAllPages
        },
        position: "sidebar"
      },
    }
  ],
  hooks: {
    afterChange: [revalidatePopUp],
  },
}
