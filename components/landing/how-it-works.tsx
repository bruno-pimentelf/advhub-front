"use client"

import React, { useRef } from 'react'
import { AnimatedList, AnimatedListItem } from '@/components/ui/animated-list'
import { motion, useInView } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BlurFade } from '@/components/ui/blur-fade'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Highlighter } from '@/components/ui/highlighter'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { 
  Brain, 
  Users, 
  MessageCircle, 
  TrendingUp,
  ArrowRight
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

const features = [
  {
    icon: Brain,
    title: "IA que aprende com suas conversas",
    description: "Acompanhe todas as interações no WhatsApp e deixe a IA sugerir os melhores scripts para engajar e converter seus pacientes.",
    step: "01",
    benefits: ["Scripts personalizados", "Análise de sentimento", "Sugestões em tempo real"],
    color: "from-gray-500 to-gray-600"
  },
  {
    icon: Users,
    title: "Organização Total da Clínica",
    description: "Classifique leads e pacientes, garantindo um atendimento mais eficiente e sem perder oportunidades.",
    step: "02",
    benefits: ["Segmentação automática", "Histórico completo", "Pipeline visual"],
    color: "from-gray-500 to-gray-600"
  },
  {
    icon: MessageCircle,
    title: "Inteligência Follow-Up",
    description: "Reengaje pacientes inativos, envie lembretes e melhore a retenção sem depender exclusivamente da sua secretária.",
    step: "03",
    benefits: ["Lembretes automáticos", "Reengajamento inteligente", "Redução de no-show"],
    color: "from-gray-500 to-gray-600"
  },
  {
    icon: TrendingUp,
    title: "Vendas e Conversões no Automático",
    description: "Nossa IA age como um consultor de vendas, identificando o melhor momento para fechar consultas e garantindo que nenhum lead seja desperdiçado.",
    step: "04",
    benefits: ["Oportunidades identificadas", "Timing perfeito", "Conversão otimizada"],
    color: "from-gray-500 to-gray-600"
  }
]

const AnimatedBadge = ({ children, delay }: { children: React.ReactNode, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ 
      duration: 0.3, 
      delay: delay,
      type: "spring",
      stiffness: 200,
      damping: 20
    }}
    whileHover={{ scale: 1.05 }}
    className="inline-block"
  >
    {children}
  </motion.div>
)

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-[#04CDD4]/20 hover:bg-white/90 transition-all duration-500 group hover:scale-[1.02] hover:shadow-lg hover:shadow-[#04CDD4]/10">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <motion.div 
            className="p-3 rounded-xl bg-gradient-to-r from-[#04CDD4] to-[#03a8a8] text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-[#04CDD4]/30"
            whileHover={{ 
              scale: 1.1,
              rotate: 3,
              boxShadow: "0 10px 25px rgba(4, 205, 212, 0.3)"
            }}
            animate={{ 
              boxShadow: [
                "0 4px 15px rgba(4, 205, 212, 0.2)",
                "0 8px 25px rgba(4, 205, 212, 0.3)",
                "0 4px 15px rgba(4, 205, 212, 0.2)"
              ]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <feature.icon className="w-6 h-6" />
          </motion.div>
          <Badge variant="outline" className="bg-[#04CDD4]/10 text-[#04CDD4] border-[#04CDD4]/20 group-hover:bg-[#04CDD4]/20 transition-colors duration-300">
            {feature.step}
          </Badge>
        </div>
      </div>
      <CardTitle className="text-xl font-semibold text-foreground group-hover:text-[#04CDD4] transition-colors duration-300">
        {feature.title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <CardDescription className="text-muted-foreground leading-relaxed mb-4 group-hover:text-foreground/80 transition-colors duration-300">
        {feature.description}
      </CardDescription>
      <Separator className="my-4 group-hover:bg-[#04CDD4]/20 transition-colors duration-300" />
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground group-hover:text-[#04CDD4] transition-colors duration-300">Benefícios:</h4>
        <div className="flex flex-wrap gap-2">
          {feature.benefits.map((benefit, idx) => (
            <AnimatedBadge key={idx} delay={0.5 + (index * 0.1) + (idx * 0.1)}>
              <Badge 
                variant="secondary" 
                className="text-xs bg-[#04CDD4]/5 text-[#04CDD4] border-[#04CDD4]/10 hover:bg-[#04CDD4]/10 transition-all duration-300 cursor-default"
              >
                {benefit}
              </Badge>
            </AnimatedBadge>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function HowItWorks() {
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
              <Highlighter color="#04CDD4" action="highlight">Como Funciona?</Highlighter>
            </h2>
          </motion.div>
        </motion.div>

        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div key={index} variants={transitionVariants.item}>
                  <FeatureCard feature={feature} index={index} />
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
            <div className="bg-gradient-to-r from-[#04CDD4]/5 to-[#03a8a8]/5 rounded-2xl p-8 border border-[#04CDD4]/20 mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                O que sua clínica ganha com isso?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-[#04CDD4] flex-shrink-0" />
                  <span className="text-muted-foreground">Aumento nas vendas de consultas e procedimentos</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-[#04CDD4] flex-shrink-0" />
                  <span className="text-muted-foreground">Maior fidelização e retorno de pacientes</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-[#04CDD4] flex-shrink-0" />
                  <span className="text-muted-foreground">Redução de no-show e cancelamentos</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-[#04CDD4] flex-shrink-0" />
                  <span className="text-muted-foreground">Menos tempo perdido com atendimentos manuais</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-[#04CDD4] flex-shrink-0" />
                  <span className="text-muted-foreground">Equipe mais produtiva e clínica mais lucrativa</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={transitionVariants.item}>
            <p className="text-xl text-muted-foreground mb-8">
              Seus concorrentes ainda fazem tudo manualmente. <Highlighter color="#04CDD4" action="highlight">Você vai ficar para trás?</Highlighter>
            </p>
          </motion.div>

          <motion.div variants={transitionVariants.item}>
            <RainbowButton size="lg" className="text-lg px-8 py-4" asChild>
              <a href="#application-form">
                QUERO SABER MAIS
              </a>
            </RainbowButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
