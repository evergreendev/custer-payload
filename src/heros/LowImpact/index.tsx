import React from 'react'

import type { Page } from '@/payload-types'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children }) => {
  return (
    <div className="container">
      <div className="max-w-[48rem]">
        {children}
      </div>
    </div>
  )
}
