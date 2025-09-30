'use client'

import { useCallback } from 'react'
import { ANALYTICS_CONFIG, generateTransactionId, isGtagAvailable } from '@/lib/analytics-config'

export function useConversionTracking() {
  const trackConversion = useCallback((transactionId?: string) => {
    if (isGtagAvailable()) {
      // Gerar transaction_id único se não fornecido
      const finalTransactionId = transactionId || generateTransactionId()
      
      window.gtag('event', 'conversion', {
        'send_to': ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID,
        'transaction_id': finalTransactionId
      })

      console.log('🎯 Google Ads Conversion tracked:', {
        conversionId: ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID,
        transactionId: finalTransactionId
      })

      return finalTransactionId
    } else {
      console.warn('Google Ads gtag não está disponível')
      return null
    }
  }, [])

  const trackLeadGeneration = useCallback((leadData: {
    email?: string
    phone?: string
    name?: string
    clinicName?: string
  }) => {
    if (isGtagAvailable()) {
      // Track conversion
      const transactionId = trackConversion()
      
      // Track custom event for lead generation
      window.gtag('event', ANALYTICS_CONFIG.CONVERSION_EVENTS.LEAD_GENERATION, {
        'currency': 'BRL',
        'value': ANALYTICS_CONFIG.CONVERSION_VALUES.LEAD_GENERATION,
        'transaction_id': transactionId,
        'custom_parameters': {
          'lead_email': leadData.email || '',
          'lead_phone': leadData.phone || '',
          'lead_name': leadData.name || '',
          'clinic_name': leadData.clinicName || ''
        }
      })

      console.log('📊 Lead Generation tracked:', leadData)
      return transactionId
    }
    return null
  }, [trackConversion])

  return {
    trackConversion,
    trackLeadGeneration
  }
}

// Declaração global para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
