import Script from 'next/script'

interface StructuredDataProps {
  type?: 'organization' | 'software' | 'product' | 'service'
}

export function StructuredData({ type = 'organization' }: StructuredDataProps) {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ailum CRM",
    "description": "CRM completo para clínicas médicas com IA. Gerencie pacientes, agendamentos, funis de vendas e marketing digital.",
    "url": "https://ailumcrm.com.br",
    "logo": "https://ailumcrm.com.br/ailum-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-99999-9999",
      "contactType": "customer service",
      "email": "contato@ailumcrm.com.br"
    },
    "sameAs": [
      "https://www.linkedin.com/company/ailum-crm",
      "https://www.instagram.com/ailumcrm",
      "https://www.facebook.com/ailumcrm"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressLocality": "São Paulo",
      "addressRegion": "SP"
    }
  }

  const softwareData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ailum CRM",
    "description": "Sistema de gestão completo para clínicas médicas com inteligência artificial",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL",
      "description": "Plano gratuito disponível"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "Ailum CRM"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ailum CRM"
    }
  }

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "CRM para Clínicas Médicas",
    "description": "Sistema completo de gestão para clínicas médicas com IA",
    "provider": {
      "@type": "Organization",
      "name": "Ailum CRM"
    },
    "serviceType": "Software as a Service",
    "areaServed": {
      "@type": "Country",
      "name": "Brazil"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Planos Ailum CRM",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Plano Básico",
            "description": "Gestão básica de pacientes e agendamentos"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Plano Premium",
            "description": "CRM completo com IA e marketing digital"
          }
        }
      ]
    }
  }

  const getData = () => {
    switch (type) {
      case 'software':
        return softwareData
      case 'service':
        return serviceData
      default:
        return organizationData
    }
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getData())
      }}
    />
  )
}

export function FAQStructuredData() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O que é o Ailum CRM?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Ailum CRM é um sistema completo de gestão para clínicas médicas que combina tecnologia de ponta com inteligência artificial para otimizar o atendimento ao paciente e aumentar a receita da clínica."
        }
      },
      {
        "@type": "Question",
        "name": "Como o Ailum CRM pode ajudar minha clínica?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Ailum CRM ajuda sua clínica a gerenciar pacientes, agendamentos, funis de vendas, marketing digital e muito mais. Com IA integrada, você pode automatizar processos e melhorar a experiência do paciente."
        }
      },
      {
        "@type": "Question",
        "name": "O sistema é fácil de usar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! O Ailum CRM foi desenvolvido pensando na simplicidade. Nossa interface intuitiva permite que qualquer membro da equipe use o sistema sem dificuldades, mantendo a essência do atendimento humano."
        }
      },
      {
        "@type": "Question",
        "name": "Há suporte técnico disponível?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, oferecemos suporte técnico completo para todos os nossos clientes. Nossa equipe está sempre disponível para ajudar com qualquer dúvida ou problema."
        }
      }
    ]
  }

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData)
      }}
    />
  )
}
