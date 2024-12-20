'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { Logo } from '@/components/Logo/Logo'

export const MobileNav: React.FC<{ header: HeaderType, logo: any, lightLogo:any, headerTheme:any }> = ({ header, logo, lightLogo, headerTheme }) => {
  const navItems = header?.navItems || []

  return (
    <nav className="flex flex-col gap-2 p-4">
      <Link href="/" className={`w-24`}>
        <Logo logo={logo} lightLogo={lightLogo} theme={headerTheme} />
      </Link>
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" className="text-2xl uppercase" />
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
