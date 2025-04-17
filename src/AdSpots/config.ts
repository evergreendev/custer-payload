import type { GlobalConfig } from 'payload'

import { revalidateAdSpots } from './hooks/revalidateAdSpots'

export const AdSpots: GlobalConfig = {
  slug: 'adSpots',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "relationship",
      name: "homePageAdSpot",
      admin: {
        description: "Below Home Page Banner. Image size should be 970x250"
      },
      relationTo: ["ads"],
    },
    {
      type: "relationship",
      name: "eventsPageAdSpot",
      relationTo: ["ads"],
    },
    {
      type: "array",
      name: "CategoryAdSpots",
      fields: [
        {
          type: "relationship",
          name: "adSpotCategory",
          relationTo: ["categories"],
        },
        {
          type: "relationship",
          name: "ad",
          relationTo: ["ads"]
        }
      ]
    }
  ],
  hooks: {
    afterChange: [revalidateAdSpots],
  },
}
