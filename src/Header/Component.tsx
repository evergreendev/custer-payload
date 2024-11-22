import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, Media, SiteOption } from '@/payload-types'

export async function Header({centerNav}:{centerNav:boolean}) {
  const header: Header = await getCachedGlobal('header', 1)();
  //@ts-expect-error
  const siteOptions: SiteOption = await getCachedGlobal('siteOptions', 1)();

  return <HeaderClient
    header={header}
    centerNav={centerNav}
    logo={siteOptions.siteLogo as Media}
    lightLogo={siteOptions.siteLogoLight as Media}
  />
}
