import Script from 'next/script'

interface StructuredDataProps {
  type?: 'organization' | 'software' | 'product' | 'service'
}

export function StructuredData({ type = 'organization' }: StructuredDataProps) {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Advhub",
    "description": "Plataforma completa para advogados com IA. Automatize atendimento, gestão de contratos, relacionamento com clientes e funis de vendas.",
    "url": "https://advhub.com.br",
    "logo": "https://advhub.com.br/advhub-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-99999-9999",
      "contactType": "customer service",
      "email": "contato@advhub.com.br"
    },
    "sameAs": [
      "https://www.linkedin.com/company/advhub",
      "https://www.instagram.com/advhub",
      "https://www.facebook.com/advhub"
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
    "name": "Advhub",
    "description": "Plataforma de gestão completa para escritórios de advocacia com inteligência artificial",
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
      "name": "Advhub"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Advhub"
    }
  }

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Plataforma para Escritórios de Advocacia",
    "description": "Sistema completo de gestão para escritórios de advocacia com IA",
    "provider": {
      "@type": "Organization",
      "name": "Advhub"
    },
    "serviceType": "Software as a Service",
    "areaServed": {
      "@type": "Country",
      "name": "Brazil"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Planos Advhub",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Plano Básico",
            "description": "Gestão básica de clientes e contratos"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Plano Premium",
            "description": "Plataforma completa com IA e automação jurídica"
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
        "name": "O que é o Advhub?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Advhub é uma plataforma completa de gestão para escritórios de advocacia que combina tecnologia de ponta com inteligência artificial para automatizar atendimento, gestão de contratos e relacionamento com clientes."
        }
      },
      {
        "@type": "Question",
        "name": "Como o Advhub pode ajudar meu escritório?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Advhub ajuda seu escritório a gerenciar clientes, contratos, funis de vendas e automação de atendimento. Com IA integrada, você pode automatizar processos e melhorar a experiência dos seus clientes."
        }
      },
      {
        "@type": "Question",
        "name": "O sistema é fácil de usar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! O Advhub foi desenvolvido pensando na simplicidade. Nossa interface intuitiva permite que qualquer membro da equipe use o sistema sem dificuldades, mantendo o foco no atendimento de qualidade."
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
