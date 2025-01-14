import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

import type { Footer, SiteOption } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const siteOptions: SiteOption = (await getCachedGlobal('siteOptions', 1)()) as SiteOption
  const siteLogo = siteOptions.siteLogoLight ? siteOptions.siteLogoLight : siteOptions.siteLogo

  const navItems = footer?.navItems || []

  return (
    <footer className="border-t border-border bg-brand-red text-white">
      <div className="container prose-a:text-white py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        {typeof siteLogo !== 'number' && (
          <Link className="flex items-center" href="/">
            <Image src={siteLogo?.url || ''} alt="Description" width={200} height={200} />
          </Link>
        )}
        {siteOptions.contactInfo && <RichText enableGutter={false} className="prose ml-2" content={siteOptions.contactInfo} />}

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
