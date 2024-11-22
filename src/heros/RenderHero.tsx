import React from 'react'

import type { Page, SiteOption } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

export const RenderHero: React.FC<Page['hero'] & {fallbackTitle:string, siteOptions:SiteOption}> = (props) => {
  const { type,fallbackTitle,siteOptions } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null


  return <HeroToRender {...props} fallbackTitle={fallbackTitle} siteOptions={siteOptions} />
}
