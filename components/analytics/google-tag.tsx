'use client'

import Script from 'next/script'
import { ANALYTICS_CONFIG } from '@/lib/analytics-config'

interface GoogleTagProps {
  gtagId?: string
}

export function GoogleTag({ gtagId }: GoogleTagProps) {
  const finalGtagId = gtagId || ANALYTICS_CONFIG.GOOGLE_ADS_ID
  
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${finalGtagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${finalGtagId}');
        `}
      </Script>
    </>
  )
}

// Hook para tracking de conversões
export function useGoogleAdsConversion() {
  const trackConversion = (conversionId: string, transactionId?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': conversionId,
        'transaction_id': transactionId || ''
      })
    }
  }

  return { trackConversion }
}

// Declaração global para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
