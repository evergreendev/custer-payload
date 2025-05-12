"use server"
import { FormBlock } from '@/blocks/Form/Component'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: {
    [k: string]: unknown
  }[]
}


const FormWrapper = async (props: FormBlockType) => {
  const categories = await getCategories();


  return <FormBlock {...props} categories={categories}/>
}

const getCategories = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    limit: 1000,
    where: {
      and: [
        {
          hideInCategoryList: {
            not_equals: true
          }
        },
        {
          hideInCategorySelect: {
            not_equals: true
          }
        }
      ]
    },
  })

  return result.docs.map(category => ({
    id: category.id,
    title: category.title
  })).sort((a, b) => a.title.localeCompare(b.title))
})

export default FormWrapper;
