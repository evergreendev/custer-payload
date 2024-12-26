import PopUpClient from '@/collections/PopUps/component/client.index'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'

const PopUp = async () => {
  const cookieStore = await cookies()
  const hidePopup = cookieStore.get('hide-popups')
  const dateObj = new Date()

  const payload = await getPayload({ config: configPromise })
  const fetchPopUps = unstable_cache(
    async () => {
      return await payload.find({
        pagination: false,
        where: hidePopup
          ? {
              and: [
                {
                  id: {
                    not_in: hidePopup.value.split('|'),
                  },
                },
                {
                  or: [
                    {
                      startShowing: { less_than_equal: dateObj },
                    },
                    {
                      or: [
                        {
                          startShowing: {
                            exists: false
                          }
                        },
                        {
                          startShowing: { equals: null },
                        },
                      ],
                    },
                  ],
                },
                {
                  or: [
                    {
                      stopShowing: { greater_than_equal: dateObj },
                    },
                    {
                      or: [
                        {
                          stopShowing: {
                            exists: false
                          }
                        },
                        {
                          stopShowing: { equals: null },
                        },
                      ],
                    },
                  ],
                },
              ],
            }
          : {
              and: [
                {
                  or: [
                    {
                      startShowing: { less_than_equal: dateObj },
                    },
                    {
                      or: [
                        {
                          startShowing: {
                            exists: false
                          }
                        },
                        {
                          startShowing: { equals: null },
                        },
                      ],
                    },
                  ],
                },
                {
                  or: [
                    {
                      stopShowing: { greater_than_equal: dateObj },
                    },
                    {
                      or: [
                        {
                          stopShowing: {
                            exists: false
                          }
                        },
                        {
                          stopShowing: { equals: null },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
        collection: 'popUp',
        sort: 'priority',
        depth: 2,
        limit: 1000,
      })
    },
    [],
    {
      tags: ['popups'],
    },
  )
  const data = await fetchPopUps()

  return <PopUpClient popUps={data.docs} />
}

export default PopUp
