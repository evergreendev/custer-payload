'use server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function createEvent(  prevState: {
                               message: string;
                             },
                             formData: FormData,) {
  console.log(formData);

/*  const payload = await getPayload({ config: configPromise })

  const post = await payload.create({
    collection: 'events', // required
    data: {
      // required
      title: 'sure',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: ' ',
                  version: 0,
                },
              ],
              version: 0,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 0,
        },
      },
    },
    fallbackLocale: false,
    overrideAccess: true,
    showHiddenFields: false,
  })*/

  return {
    message: "Thank you for your submission. After being reviewed it will be published."
  }
}
