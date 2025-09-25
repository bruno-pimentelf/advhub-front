"use client"

import React, { useRef } from 'react'
import { useInView, motion } from 'motion/react'
import { Highlighter } from '@/components/ui/highlighter'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { 
  Building2, 
  User, 
  Users, 
  TrendingUp,
  CheckCircle
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

const audiences = [
  {
    icon: Building2,
    title: "Clínicas médicas de todos os portes",
    description: "Que querem organizar seus pacientes, automatizar atendimentos e aumentar conversões.",
    color: "from-gray-500 to-gray-600"
  },
  {
    icon: User,
    title: "Consultórios individuais",
    description: "Para médicos que atendem sozinhos e precisam otimizar o tempo, fidelizar pacientes e vender mais sem depender de secretárias.",
    color: "from-gray-500 to-gray-600"
  },
  {
    icon: Users,
    title: "Secretárias e recepcionistas sobrecarregadas",
    description: "Que querem ter um sistema organizado para responder aos pacientes de forma rápida e eficiente.",
    color: "from-gray-500 to-gray-600"
  },
  {
    icon: TrendingUp,
    title: "Médicos e gestores que querem aumentar o faturamento",
    description: "Utilizando a IA para identificar oportunidades de venda e fazer follow-ups estratégicos no momento certo.",
    color: "from-gray-500 to-gray-600"
  }
]

export default function TargetAudience() {
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
              <Highlighter color="#04CDD4" action="highlight">Para quem é?</Highlighter>
            </h2>
          </motion.div>
        </motion.div>

        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {audiences.map((audience, index) => (
              <motion.div key={index} variants={transitionVariants.item}>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#04CDD4]/20 hover:bg-white/90 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#04CDD4] to-[#03a8a8] text-white">
                      <audience.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {audience.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {audience.description}
                      </p>
                    </div>
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
            <div className="bg-gradient-to-r from-[#04CDD4]/5 to-[#03a8a8]/5 rounded-2xl p-8 border border-[#04CDD4]/20 mb-8">
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Se sua clínica quer mais pacientes, mais organização e mais faturamento com menos esforço, o <Highlighter color="#04CDD4" action="highlight">Ailum - CRM Powered by AI</Highlighter> é para você!
              </p>
            </div>
          </motion.div>

          <motion.div variants={transitionVariants.item}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-lg font-medium text-foreground">Garantia de 30 dias</span>
            </div>
          </motion.div>

          <motion.div variants={transitionVariants.item}>
            <RainbowButton size="lg" className="text-lg px-8 py-4">
              É para mim
            </RainbowButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
