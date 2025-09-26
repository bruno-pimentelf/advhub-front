"use client"

import React, { useRef } from 'react'
import { useInView, motion } from 'motion/react'
import { Highlighter } from '@/components/ui/highlighter'
import { Button } from '@/components/ui/button'
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid'
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
    description: "Organização e segmentação automática de contatos, garantindo que nenhum lead seja perdido. Centralização dos atendimentos e automação de processos para que sua equipe trabalhe menos e renda mais.",
    className: "col-span-3 md:col-span-2",
    header: "Gestão Inteligente"
  },
  {
    icon: Target,
    title: "Conversão e Vendas",
    description: "Inteligência Artificial que sugere mensagens estratégicas no WhatsApp para aumentar agendamentos e fechar mais procedimentos.",
    className: "col-span-3 md:col-span-1",
    header: "IA para Vendas"
  },
  {
    icon: Heart,
    title: "Relacionamento e Fidelização",
    description: "Follow-ups personalizados para engajar pacientes e reduzir faltas e cancelamentos.",
    className: "col-span-3 md:col-span-1",
    header: "Fidelização"
  },
  {
    icon: BarChart3,
    title: "Acompanhamento Estratégico",
    description: "Insights inteligentes que mostram onde estão as oportunidades de crescimento da clínica.",
    className: "col-span-3 md:col-span-2",
    header: "Analytics"
  }
]

export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" ref={ref} className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
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
          <BentoGrid className="max-w-6xl mx-auto">
            {pillars.map((pillar, index) => (
              <BentoCard
                key={index}
                name={pillar.title}
                className={pillar.className}
                Icon={pillar.icon}
                description={pillar.description}
                background={
                  <div className="absolute inset-0 bg-gradient-to-br from-[#04CDD4]/10 to-[#03a8a8]/10" />
                }
                href="#application-form"
                cta="Saiba mais"
              />
            ))}
          </BentoGrid>
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
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold dark:bg-primary-600 dark:hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <a href="#application-form">
                Quero saber mais!
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
