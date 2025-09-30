// Configurações do Google Ads e Analytics
export const ANALYTICS_CONFIG = {
  // Google Ads
  GOOGLE_ADS_ID: 'AW-17611568524',
  GOOGLE_ADS_CONVERSION_ID: 'AW-17611568524/mztSCLTalqQbEIzr7M1B',
  
  // Eventos de conversão
  CONVERSION_EVENTS: {
    LEAD_GENERATION: 'generate_lead',
    APPLICATION_SUBMIT: 'application_submit',
    CONTACT_FORM: 'contact_form_submit'
  },
  
  // Valores de conversão (em BRL)
  CONVERSION_VALUES: {
    LEAD_GENERATION: 1.0,
    APPLICATION_SUBMIT: 5.0,
    CONTACT_FORM: 2.0
  }
} as const

// Função para gerar transaction_id único
export function generateTransactionId(prefix: string = 'conv'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Função para validar se o gtag está disponível
export function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

// Declaração global para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
