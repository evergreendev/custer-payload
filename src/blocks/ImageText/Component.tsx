import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import Image from 'next/image'

type Props = Extract<Page['layout'][0], { blockType: 'imageText' }>

const LeftCol: React.FC<
  Props & {
    id?: string
  }
> = ({ content, type, images, cta }) => {
  return (
    <div className={`${type === 'overlap' ? 'bg-white bg-opacity-70 text-[#253f8e] py-10' : ''}`}>
      {type === 'twoImage' && images?.[0]?.image && typeof images?.[0].image !== 'number' && (
        <div className="mb-5">
          <Image
            alt={images?.[0].image.alt || ''}
            src={images?.[0].image.url || ''}
            width={images?.[0].image.width || 0}
            height={images?.[0].image.height || 0}
          />
          {images[0]?.links?.[0] && (
            <CMSLink {...images[0]?.links?.[0].link} size="clear" appearance="full" />
          )}
        </div>
      )}
      {content && (
        <RichText
          className="mb-4 max-w-prose px-14 text-inherit prose-xl prose-h2:text-6xl prose-h3:mb-0 prose-h2:mb-0 prose-h2:font-display prose-h2:font-bold"
          content={content}
          enableGutter={false}
        />
      )}
      {cta && type === 'overlap' && (
        <div>
          {cta.text && (
            <RichText
              className="mb-4 max-w-prose px-14 text-[#253f8e] prose-headings:text-[#253f8e] prose-xl prose-h2:text-5xl prose-h3:mb-0 prose-h2:mb-0 prose-h2:font-bold"
              content={cta.text}
              enableGutter={false}
            />
          )}
          {cta.links && cta.links?.length > 0
            && (<div className="flex flex-col px-14 items-center mt-14">{cta.links.map((link) => <CMSLink className="grow" {...link.link} key={link.id} size="full" appearance="outline"/>)}</div>)}
        </div>
      )}
    </div>
  )
}

const RightCol: React.FC<
  Props & {
    id?: string
  }
> = ({ image, images, type }) => {
  const currImgGroup = type === 'twoImage' ? images?.[1] : image
  return (
    <div className={`${type === 'overlap' ? 'w-96 mx-auto -translate-y-12' : ''} `}>
      {currImgGroup?.image && typeof currImgGroup?.image !== 'number' && (
        <Image
          alt={currImgGroup?.image.alt || ''}
          src={currImgGroup?.image.url || ''}
          width={currImgGroup?.image.width || 0}
          height={currImgGroup?.image.height || 0}
        />
      )}
      {currImgGroup?.links?.[0] && (
        <CMSLink
          {...currImgGroup?.links?.[0].link}
          size="clear"
          appearance={type === 'overlap' ? 'fullOrange' : 'full'}
        />
      )}
    </div>
  )
}

export const ImageText: React.FC<
  Props & {
    id?: string
  }
> = (props) => {
  const { reverseColumns, backgroundImage, background } = props
  const backgroundClasses = {
    white: 'bg-yellow-50 text-gray-800',
    red: 'bg-brand-red text-white border-t-[16px] border-t-brand-redPale',
    blue: 'bg-brand-blue text-white',
  }

  return (
    <div
      className={`${background && background !== 'image' ? backgroundClasses[background] + ' pt-40' : ''}

      flex relative flex-wrap gap-8 md:flex-row md:justify-between md:items-center  pb-20`}
    >
      {background === 'image' && backgroundImage ? (
        <>
          <Media fill imgClassName="-z-10 object-cover object-center" resource={backgroundImage} />
          <div className="bg-white absolute inset-0 opacity-30 z-0" />
        </>
      ) : (
        ''
      )}
      <div
        className={`flex flex-wrap md:flex-nowrap w-full gap-5 max-w-screen-2xl mx-auto ${props.type !== 'twoImage' ? 'items-center' : ''}`}
      >
        <div className="flex flex-col items-start w-full md:w-6/12 relative z-10">
          {!reverseColumns ? <LeftCol {...props} /> : <RightCol {...props} />}
        </div>
        <div className="flex flex-col items-end w-full md:w-6/12 relative z-10">
          {!reverseColumns ? <RightCol {...props} /> : <LeftCol {...props} />}
        </div>
      </div>
    </div>
  )
}
