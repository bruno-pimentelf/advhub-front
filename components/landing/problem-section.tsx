"use client"

import React, { useRef } from 'react'
import { useInView } from 'motion/react'
import { BlurFade } from '@/components/ui/blur-fade'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { motion } from 'motion/react'
import { Highlighter } from '@/components/ui/highlighter'
import { Button } from '@/components/ui/button'
import { ShineBorder } from '@/components/ui/shine-border'
import Image from 'next/image'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'

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
  const { scrollToElement } = useSmoothScroll()

  return (
    <section ref={ref} className="pt-20 md:pt-28 pb-24 md:pb-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.div variants={transitionVariants.item}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6 sm:mb-8 leading-tight">
              Cansado de{' '}
              <Highlighter color="#04CDD4" action="highlight">
                perder vendas
              </Highlighter>{' '}
              na sua clínica por falta de organização e estratégia?
            </h2>
          </motion.div>

          <motion.div variants={transitionVariants.item}>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed">
              Nosso <Highlighter color="#04CDD4" action="underline">CRM Powered by AI</Highlighter> vai te ajudar a aumentar as vendas, fidelizar seus pacientes e organizar a rotina da sua secretária!
            </p>
          </motion.div>

          <motion.div variants={transitionVariants.item}>
            <div className="relative mb-12">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto px-4 sm:px-0">
                <div className="relative bg-background rounded-2xl p-2">
                  <Image
                    src="/funis.png"
                    alt="Interface de Funis de Vendas do Ailum CRM"
                    width={1200}
                    height={800}
                    className="rounded-xl w-full h-auto"
                    priority
                  />
                  <ShineBorder
                    borderWidth={2}
                    duration={8}
                    shineColor={["#04CDD4", "#00B4B8", "#04CDD4"]}
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={transitionVariants.item}>
            <Button 
              size="lg" 
              onClick={() => scrollToElement('#application-form')}
              className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold dark:bg-primary-600 dark:hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              QUERO SABER MAIS
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
