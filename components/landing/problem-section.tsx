"use client"

import React, { useRef } from 'react'
import { useInView } from 'motion/react'
import { BlurFade } from '@/components/ui/blur-fade'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { motion } from 'motion/react'
import { Highlighter } from '@/components/ui/highlighter'
import { RainbowButton } from '@/components/ui/rainbow-button'

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

export default function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="pt-12 md:pt-16 pb-24 md:pb-32 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.div variants={transitionVariants.item}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-8">
              Cansado de{' '}
              <Highlighter color="#04CDD4" action="highlight">
                perder vendas
              </Highlighter>{' '}
              na sua clínica por falta de organização e estratégia?
            </h2>
          </motion.div>

          <motion.div variants={transitionVariants.item}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto">
              Nosso <Highlighter color="#04CDD4" action="underline">CRM Powered by AI</Highlighter> vai te ajudar a aumentar as vendas, fidelizar seus pacientes e organizar a rotina da sua secretária!
            </p>
          </motion.div>

          <motion.div variants={transitionVariants.item}>
            <div className="relative mb-12">
              <div className="bg-gradient-to-r from-[#04CDD4]/10 to-[#03a8a8]/10 rounded-2xl p-8 border border-[#04CDD4]/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#04CDD4] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    [VÍDEO DEMONSTRATIVO OU PRINTS]
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Assista a um breve vídeo ou veja prints de como o Ailum pode transformar sua clínica.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={transitionVariants.item}>
            <RainbowButton size="lg" className="text-lg px-8 py-4">
              QUERO SABER MAIS
            </RainbowButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
