'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { submitHelpWanted } from '@/utilities/submitHelpWanted'

export async function createHelpWanted(
  _prevState: { message: string; error: string },
  formData: FormData,
) {
  return submitHelpWanted(formData, () => getPayload({ config: configPromise }))
}
