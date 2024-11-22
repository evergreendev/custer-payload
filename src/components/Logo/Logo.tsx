import React from 'react'
import { Media } from '@/payload-types'
import Image from 'next/image'
import { Theme } from '@/providers/Theme/ThemeSelector/types'

interface LogoProps {
  logo?: Media | null
  lightLogo?: Media | null
  theme?: Theme | null | undefined
}

export const Logo = ({ logo, lightLogo, theme }: LogoProps) => {
  const currLogo = theme === "light" ? logo : lightLogo||logo;

  if (!currLogo) return null

  return (
    <Image
      className="w-full"
      src={currLogo.url || ''}
      alt={currLogo.alt || ''}
      height={currLogo.height || 0}
      width={currLogo.width || 0}
    />
  )
}
