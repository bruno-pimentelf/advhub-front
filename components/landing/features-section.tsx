"use client"

import React, { useRef } from 'react'
import { useInView, motion } from 'motion/react'
import { Highlighter } from '@/components/ui/highlighter'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { 
  Users, 
  Target, 
  Heart, 
  BarChart3,
  Eye
} from 'lucide-react'

const transitionVariants = {
  container: {
    visible: {
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 20,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

const pillars = [
  {
    icon: Users,
    title: "Fluxo de Leads",
    description: "Organização e segmentação automática de contatos, garantindo que nenhum lead seja perdido.",
    colors: {
      firstColor: "#04CDD4",
      secondColor: "#03a8a8"
    }
  },
  {
    icon: Target,
    title: "Conversão e Vendas",
    description: "Inteligência Artificial que sugere mensagens estratégicas no WhatsApp para aumentar agendamentos e fechar mais procedimentos.",
    colors: {
      firstColor: "#04CDD4",
      secondColor: "#03a8a8"
    }
  },
  {
    icon: Heart,
    title: "Relacionamento e Fidelização",
    description: "Follow-ups personalizados para engajar pacientes e reduzir faltas e cancelamentos.",
    colors: {
      firstColor: "#04CDD4",
      secondColor: "#03a8a8"
    }
  },
  {
    icon: BarChart3,
    title: "Organização e Produtividade",
    description: "Centralização dos atendimentos e automação de processos para que sua equipe trabalhe menos e renda mais.",
    colors: {
      firstColor: "#04CDD4",
      secondColor: "#03a8a8"
    }
  },
  {
    icon: Eye,
    title: "Acompanhamento Estratégico",
    description: "Insights inteligentes que mostram onde estão as oportunidades de crescimento da clínica.",
    colors: {
      firstColor: "#04CDD4",
      secondColor: "#03a8a8"
    }
  }
]

export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={transitionVariants.item}>
            <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-8">
              No <Highlighter color="#04CDD4" action="highlight">Ailum</Highlighter>, pensamos em todos os pilares para que sua clínica cresça:
            </h2>
          </motion.div>
        </motion.div>

        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pillars.map((pillar, index) => (
              <motion.div key={index} variants={transitionVariants.item}>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#04CDD4]/20 hover:bg-white/90 transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#04CDD4] to-[#03a8a8] mb-6">
                      <pillar.icon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {pillar.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <motion.div variants={transitionVariants.item}>
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Com esses pilares, sua clínica cresce de forma <Highlighter color="#04CDD4" action="highlight">estruturada, previsível e lucrativa!</Highlighter>
            </p>
          </motion.div>

          <motion.div variants={transitionVariants.item}>
            <RainbowButton size="lg" className="text-lg px-8 py-4" asChild>
              <a href="#application-form">
                Quero saber mais!
              </a>
            </RainbowButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
