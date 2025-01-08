import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

type Props = Extract<Page['layout'][0], { blockType: 'buttonGroup' }>

export const ButtonGroup: React.FC<
  Props & {
  id?: string
}
> = ({ links, introContent}) => {
  return (
      <div className="bg-brand-blue border-b-[20px] border-brand-red p-4 flex flex-wrap gap-8 md:flex-row md:justify-between md:items-center pt-7 pb-20">
        <div className="container flex flex-col items-center">
          <div className="max-w-[48rem] flex items-center text-white">
            {introContent && <RichText className="mb-4 prose-xl prose-h2:font-normal" content={introContent} enableGutter={false} />}
          </div>
          <div className="flex flex-wrap gap-8 w-full items-center">
            {(links || []).map(({ link }, i) => {
              return <CMSLink className="grow w-full sm:w-auto" key={i} size="lg" {...link} />
            })}
          </div>
        </div>
      </div>
  )
}
