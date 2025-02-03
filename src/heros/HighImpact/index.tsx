'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page, SiteOption } from '@/payload-types'

import { Media } from '@/components/Media'
import { Logo } from '@/components/Logo/Logo'

export const HighImpactHero: React.FC<
  Page['hero'] & {
    fallbackTitle: string
    siteOptions: SiteOption
    centerNav?: boolean
  }
> = ({ media, headline, subheading, showLogo, fallbackTitle, siteOptions, centerNav }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className={`relative ${centerNav ? '-mt-[10.4rem] min-h-[800px]' : ''} flex items-end text-white`}
      data-theme="dark"
    >
      <div className="container mb-8 z-10 absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex flex-col">
        {showLogo && (
          <div className="max-w-xs mx-auto mb-24 mt-[10vh]">
            <Logo
              logo={typeof siteOptions.siteLogo !== 'number' ? siteOptions.siteLogo : undefined}
              lightLogo={
                typeof siteOptions.siteLogoLight !== 'number'
                  ? siteOptions.siteLogoLight
                  : undefined
              }
              theme="dark"
            />
          </div>
        )}
        {showLogo ? (
          <div className="mt-[1vh]">
            <h1 className="font-display text-4xl sm:text-8xl font-bold text-center mb-4">
              {headline || fallbackTitle}
            </h1>
            {subheading && <h2 className="text-center text-5xl">{subheading}</h2>}
          </div>
        ) : (
          <div className="h-full relative flex items-end overflow-hidden">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{headline || fallbackTitle}</h1>
          </div>
        )}
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <React.Fragment>
            <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
            <div
              className={
                showLogo
                  ? 'absolute pointer-events-none left-0 bottom-0 w-full h-full bg-gradient-to-b from-neutral-950 opacity-70 to-transparent'
                  : 'absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent'
              }
            />
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
