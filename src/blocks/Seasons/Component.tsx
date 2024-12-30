'use client'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import Image from 'next/image'

type Props = Extract<Page['layout'][0], { blockType: 'seasons' }>

function getCurrSeason() {
  const currDate = new Date()
  const currMonth = currDate.getMonth() + 1
  if (currMonth >= 12 || (currMonth >= 1 && currMonth <= 2)) {
    return 'winter'
  }
  if (currMonth > 2 && currMonth < 6) {
    return 'spring'
  }
  if (currMonth > 5 && currMonth < 9) {
    return 'summer'
  }

  return 'autumn'
}
function shuffleArray(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const Seasons: React.FC<
  Props & {
    id?: string
  }
> = (props) => {
  const [currentSeason, setCurrentSeason] = React.useState(getCurrSeason())
  const [itemsToDisplay, setItemsToDisplay] = React.useState<
    Props['springItems'] | null | undefined
  >(null)
  const { autumnItems, summerItems, yearRoundItems, springItems, winterItems } = props

  useEffect(() => {
    switch (currentSeason) {
      case 'winter':
        setItemsToDisplay(shuffleArray(winterItems))
        break
      case 'spring':
        setItemsToDisplay(shuffleArray(springItems))
        break
      case 'summer':
        setItemsToDisplay(shuffleArray(summerItems))
        break
      case 'autumn':
        setItemsToDisplay(shuffleArray(autumnItems))
        break
      default:
        setItemsToDisplay(shuffleArray(yearRoundItems))
        break
    }
  }, [autumnItems, currentSeason, springItems, summerItems, winterItems, yearRoundItems])

  return (
    <div className="w-full relative aspect-[16/7] sm:pt-0 flex flex-col items-center justify-center gap-8">
      <Media
        fill
        imgClassName={`duration-700 -z-20 object-cover object-center bg-white transition-all ${currentSeason === 'spring' ? 'opacity-1' : 'opacity-0'}`}
        resource={props.springImage}
      />
      <Media
        fill
        imgClassName={`duration-700 -z-20 object-cover object-center bg-white transition-all ${currentSeason === 'autumn' ? 'opacity-1' : 'opacity-0'}`}
        resource={props.autumnImage}
      />
      <Media
        fill
        imgClassName={`duration-700 -z-20 object-cover object-center bg-white transition-all ${currentSeason === 'summer' ? 'opacity-1' : 'opacity-0'}`}
        resource={props.summerImage}
      />
      <Media
        fill
        imgClassName={`duration-700 -z-20 object-cover object-center bg-white transition-all ${currentSeason === 'winter' ? 'opacity-1' : 'opacity-0'}`}
        resource={props.winterImage}
      />
      <Media
        fill
        imgClassName={`duration-700 -z-20 object-cover object-center bg-white transition-all ${currentSeason === 'year-round' ? 'opacity-1' : 'opacity-0'}`}
        resource={props.yearRoundImage}
      />

      <div className="absolute inset-0 bg-black/30 -z-10" />

      {props.content && (
        <RichText
          className="mb-4 max-w-prose px-14 text-center text-white prose-headings:text-white prose-h2:font-display prose-2xl prose-h2:text-7xl prose-h3:mb-0 prose-h2:mb-0 prose-h2:font-bold"
          content={props.content}
          enableGutter={false}
        />
      )}

      <div className="flex gap-8 w-full overflow-hidden justify-center">
        {itemsToDisplay?.map((item,index) => {
          if (index > 2) return null;
          if (typeof item.value === 'number') return null

          const itemTypeSlug = item.relationTo === 'pages' ? '' : item.relationTo + '/'

          return (
            <div className="w-full max-w-lg" key={item.value.id + item.value.title}>
              {item.value.meta?.image && typeof item.value.meta.image !== 'number' ? (
                <Image
                  src={item.value.meta.image.url || ''}
                  alt={item.value.title}
                  width={item.value.meta.image.width || 0}
                  height={item.value.meta.image.height || 0}
                  className="object-cover aspect-video w-full"
                />
              ) : (
                <div className="aspect-video w-full bg-brand-red/30" />
              )}
              <CMSLink url={itemTypeSlug + item.value.slug} appearance="fullOrange">
                {item.value.title}
              </CMSLink>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-8 w-full justify-center">
        {['winter', 'spring', 'summer', 'autumn', 'year-round'].map((season) => (
          <button
            className={`${currentSeason === season ? 'underline' : ''} font-bold text-white text-3xl`}
            key={season}
            onClick={() => setCurrentSeason(season)}
          >
            {season.charAt(0).toUpperCase() + season.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}
