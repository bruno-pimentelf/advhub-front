"use client"

import React, { useRef } from 'react'
import { useInView } from 'motion/react'
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { motion } from 'motion/react'
import { Highlighter } from '@/components/ui/highlighter'
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  Target,
  Zap
} from 'lucide-react'

const transitionVariants = {
  container: {
    visible: {
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.2,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 30,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 2,
      },
    },
  },
}

const benefits = [
  {
    name: "Parar de perder pacientes",
    description: "Diga adeus ao caos no WhatsApp e à desorganização! Nunca mais perca um paciente por falta de follow-up. Organize contatos, sugira mensagens personalizadas e faça follow-ups inteligentes para aumentar conversões.",
    icon: Users,
    metric: "95%",
    metricLabel: "Redução de perda de pacientes",
    stats: "Antes: 30% de perda | Depois: 2% de perda",
    className: "col-span-3 md:col-span-2",
    isMain: true
  },
  {
    name: "Reduzir investimentos",
    description: "Reduza os investimentos em treinamentos de atendimento e vendas. Nossa IA será especializada em converter leads em pacientes.",
    icon: TrendingUp,
    metric: "70%",
    metricLabel: "Economia em treinamentos",
    stats: "R$ 15.000/ano economizados em treinamentos",
    className: "col-span-3 md:col-span-1",
    isMain: false
  },
  {
    name: "Automatizar atendimento",
    description: "Trabalhe menos e tenha mais resultados! Automatize o atendimento e a gestão de leads no WhatsApp.",
    icon: MessageSquare,
    metric: "3x",
    metricLabel: "Mais pacientes atendidos",
    stats: "De 50 para 150 pacientes/dia",
    className: "col-span-3 md:col-span-1",
    isMain: false
  },
  {
    name: "Identificar oportunidades",
    description: "Reduza tarefas repetitivas, evite perda de pacientes e impulsione o faturamento identificando oportunidades no momento certo.",
    icon: Zap,
    metric: "60%",
    metricLabel: "Menos tempo em tarefas manuais",
    stats: "8h/dia economizadas em atendimento",
    className: "col-span-3 md:col-span-1",
    isMain: false
  }
]

export default function BenefitsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-16 sm:py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div variants={transitionVariants.item}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-6 sm:mb-8 leading-tight">
              Com o <Highlighter color="#04CDD4" action="highlight">Ailum</Highlighter>, você vai:
            </h2>
          </motion.div>
        </motion.div>

        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Card principal em destaque */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.filter(benefit => benefit.isMain).map((benefit) => (
                <motion.div key={benefit.name} variants={transitionVariants.item} className="md:col-span-2">
                  <Card className="bg-white/80 backdrop-blur-sm border-[#04CDD4]/20 hover:bg-white/90 transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-[#04CDD4] to-[#03a8a8] text-white group-hover:scale-110 transition-transform duration-300">
                          <benefit.icon className="w-8 h-8" />
                        </div>
                        <Badge variant="secondary" className="bg-[#04CDD4] text-white font-semibold border-[#04CDD4] text-lg px-4 py-2">
                          {benefit.metric}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-semibold text-foreground">
                        {benefit.name}
                      </CardTitle>
                      <CardDescription className="text-base text-muted-foreground">
                        {benefit.metricLabel}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-base text-bold text-muted-foreground mb-4 leading-relaxed">
                        {benefit.description}
                      </p>
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-[#04CDD4] bg-[#04CDD4]/5 px-4 py-3 rounded-lg">
                          {benefit.stats}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Cards secundários */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.filter(benefit => !benefit.isMain).map((benefit) => (
                <motion.div key={benefit.name} variants={transitionVariants.item}>
                  <Card className="bg-white/80 backdrop-blur-sm border-[#04CDD4]/20 hover:bg-white/90 transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-[#04CDD4] to-[#03a8a8] text-white group-hover:scale-110 transition-transform duration-300">
                          <benefit.icon className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-[#04CDD4] text-white font-semibold border-[#04CDD4]">
                          {benefit.metric}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {benefit.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {benefit.metricLabel}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {benefit.description}
                      </p>
                      <div className="space-y-3">
                        <div className="text-xs font-medium text-[#04CDD4] bg-[#04CDD4]/5 px-3 py-2 rounded-lg">
                          {benefit.stats}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <motion.div variants={transitionVariants.item}>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              O Ailum é o único <Highlighter color="#04CDD4" action="underline">CRM Powered by AI</Highlighter> do mercado que organiza o relacionamento com seus pacientes e impulsiona suas vendas com mensagens personalizadas e estratégias testadas — tudo com o poder da Inteligência Artificial!
            </p>
          </motion.div>
          
          <motion.div variants={transitionVariants.item}>
            <h3 className="text-3xl font-semibold text-foreground mb-4">
              Trabalhe menos e tenha mais resultados!
            </h3>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Nosso CRM Powered by AI automatiza o atendimento e a gestão de leads no WhatsApp, organizando contatos, sugerindo mensagens personalizadas e fazendo follow-ups inteligentes para aumentar conversões e retenção sem esforço da sua secretária. Ele reduz tarefas repetitivas, evita perda de pacientes por falta de contato e impulsiona o faturamento ao identificar oportunidades de venda no momento certo. Com ele, sua clínica trabalha menos, agenda mais consultas e fatura mais – tudo de forma automática e eficiente.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
