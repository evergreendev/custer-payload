import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

import type { Ad } from '../../../payload-types'

export const revalidateAd: CollectionAfterChangeHook<Ad> = ({
  doc,
  req: { payload },
}) => {
  if (doc._status === 'published'){
    payload.logger.info(`Revalidating ad spots`)

    revalidateTag('global_adSpots')
  }

  return doc
}
