'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import type { Header, Media } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { MobileNav } from '@/Header/Nav/MobileNav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@awesome.me/kit-45560c6e49/icons/classic/solid'
import { usePathname } from 'next/navigation'

interface HeaderClientProps {
  header: Header
  logo: Media
  lightLogo?: Media
  centerNav: boolean
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  header,
  logo,
  lightLogo,
  centerNav,
}) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false)
  const { headerTheme } = useHeaderTheme()
  const [hasScrolled, setHasScrolled] = useState(false)
  const handleScroll = () => {
    if (typeof window === 'undefined') return;
    if (window.scrollY > 0) {
      setHasScrolled(true)
    } else {
      setHasScrolled(false)
    }
  }
  const pathname = usePathname();

  useEffect(() => {
    setMobileNavIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`hidden md:block sticky transition-colors top-0 z-50 ${!centerNav || hasScrolled ? 'bg-brand-blue text-white border-b border-blue-950' : ''}`}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="container relative z-20 py-2 flex justify-between text-3xl ">
          <Link href="/" className={`w-24 ${centerNav ? 'hidden' : ''}`}>
            <Logo logo={logo} lightLogo={lightLogo} theme={headerTheme} />
          </Link>
          <HeaderNav header={header} centerNav={centerNav} />
        </div>
      </header>
      <header className={`md:hidden`}>
        <button
          onClick={() => setMobileNavIsOpen(!mobileNavIsOpen)}
          className="fixed z-50 top-4 right-4"
        >
          {mobileNavIsOpen ? (
            <FontAwesomeIcon className="text-white" size="2xl" icon={faXmark} />
          ) : (
            <FontAwesomeIcon className="text-brand-blueBright" size="2xl" icon={faBars} />
          )}
        </button>
        <div
          className={`fixed transition-transform inset-0 bg-brand-blue z-40 bg-opacity-95 ${mobileNavIsOpen ? '' : '-translate-x-full'}`}
        >
          <MobileNav header={header} logo={logo} lightLogo={lightLogo} headerTheme={headerTheme} />
        </div>
      </header>
    </>
  )
}
