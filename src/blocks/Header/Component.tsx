import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

type Props = Extract<Page['layout'][0], { blockType: 'header' }>

export const Header: React.FC<
  Props & {
  id?: string
}
> = ({ links, introContent, backgroundImage, type}) => {
  return (
    <div className="flex relative flex-wrap gap-8 md:flex-row md:justify-between md:items-center pt-7 pb-20">
      {backgroundImage ? <Media fill imgClassName="-z-10 object-cover object-center" resource={backgroundImage} /> : ""}
      <div className="container flex flex-col items-center">
        <div className="max-w-[48rem] flex items-center">
          {introContent && (
            <RichText
              className="mb-4 text-center prose-xl prose-h2:font-normal"
              content={introContent}
              enableGutter={false}
            />
          )}
        </div>
        <div className="flex gap-8 w-full items-center justify-center">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </div>
    </div>
  )
}
