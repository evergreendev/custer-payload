'use client'
import React from 'react'
import { Ad } from '@/payload-types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type AdProps = {
  ad: Ad
}

const AdComponent: React.FC<AdProps> = ({ ad }) => {
  const router = useRouter()

  async function onIncrementViewCount(ad: Ad) {
    if (!ad.impressions && ad.impressions !== 0) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ads/${ad.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          impressions: ad.impressions + 1,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to increment impression count.')
      }
    } catch (error) {
      console.error('Error incrementing impression count:', error)
    }
  }

  const handleView = async () => {
    await onIncrementViewCount(ad)
  }

  async function onIncrementClickCount(ad: Ad) {
    if (!ad.clicks && ad.clicks !== 0) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ads/${ad.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          clicks: ad.clicks + 1,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to increment click count.')
      }
    } catch (error) {
      console.error('Error incrementing click count:', error)
    }
  }

  const handleClick = async () => {
    await onIncrementClickCount(ad)
    router.push(ad.link);
  }

  React.useEffect(() => {
    handleView()
  }, [])

  if (!ad.image || typeof ad.image === 'number') return <></>

  return (
    <button onClick={handleClick}>
      <Image
        src={ad.image.url || ''}
        alt={ad.image.alt || ''}
        width={ad.image.width || 0}
        height={ad.image.height || 0}
      />
    </button>
  )
}

export default AdComponent
