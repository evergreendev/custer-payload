'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import type { Header, Media } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  header: Header,
  logo: Media,
  lightLogo?: Media,
  centerNav: boolean
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header, logo, lightLogo, centerNav }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme } = useHeaderTheme()

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className={`${centerNav ? "" : "bg-brand-blue text-white border-b border-blue-950"}`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container relative z-20 py-2 flex justify-between text-3xl ">
        <Link href="/" className={`w-32 ${centerNav ? 'hidden' : ''}`}>
          <Logo logo={logo} lightLogo={lightLogo} theme={headerTheme} />
        </Link>
        <HeaderNav header={header} centerNav={centerNav} />
      </div>
    </header>
  )
}
