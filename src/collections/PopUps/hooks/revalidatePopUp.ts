import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import type { PopUp } from '@/payload-types'

export const revalidatePopUp: CollectionAfterChangeHook<PopUp> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (!doc.showOnAllPages)

  revalidateTag("popups")

  return doc
}
