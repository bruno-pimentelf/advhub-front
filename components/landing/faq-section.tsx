"use client"

import React, { useState, useRef } from 'react'
import { useInView } from 'motion/react'
import { motion } from 'motion/react'
import { Highlighter } from '@/components/ui/highlighter'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const faqs = [
  {
    question: "Como o CRM ajuda minha clínica a aumentar as vendas?",
    answer: "Nosso CRM utiliza Inteligência Artificial para analisar conversas no WhatsApp e sugerir mensagens estratégicas e personalizadas para conversão de leads, fidelização de pacientes e aumento de vendas, sem esforço manual da equipe."
  },
  {
    question: "Minha clínica não usa CRM atualmente. É difícil implantar o sistema?",
    answer: "Não! Criamos uma plataforma simples e intuitiva, que qualquer equipe consegue usar sem treinamentos complexos. Em poucos cliques, você terá tudo organizado e automatizado."
  },
  {
    question: "O CRM substitui minha secretária ou equipe de atendimento?",
    answer: "Não! Ele potencializa o trabalho da sua equipe, eliminando tarefas repetitivas e ajudando no atendimento, tornando tudo mais rápido e eficiente. Sua secretária ou recepcionista terá mais tempo para focar no que realmente importa."
  },
  {
    question: "O CRM pode ser usado por qualquer tipo de clínica ou consultório?",
    answer: "Sim! O sistema é 100% focado em clínicas e funciona para clínicas médicas, odontológicas, estéticas e consultórios individuais que querem mais organização, produtividade e faturamento."
  },
  {
    question: "Como funciona a integração com WhatsApp?",
    answer: "O Ailum se conecta diretamente com seu WhatsApp Business, analisando todas as conversas e sugerindo respostas inteligentes. Você mantém o controle total, mas com o poder da IA para otimizar cada interação."
  },
  {
    question: "Meus dados ficam seguros no Ailum?",
    answer: "Sim! Utilizamos criptografia de ponta a ponta e seguimos todas as normas de proteção de dados (LGPD). Seus dados de pacientes e conversas ficam completamente seguros e privados."
  },
  {
    question: "Quanto tempo leva para ver resultados?",
    answer: "A maioria dos nossos clientes vê melhorias já na primeira semana: menos pacientes perdidos, mais agendamentos e atendimento mais organizado. Em 30 dias, você já terá dados concretos de aumento no faturamento."
  },
  {
    question: "Preciso de treinamento para usar o Ailum?",
    answer: "Não! Nossa interface foi desenvolvida para ser intuitiva. Oferecemos suporte completo e documentação detalhada, mas a maioria dos usuários consegue usar todas as funcionalidades sem treinamento prévio."
  },
  {
    question: "O Ailum funciona em clínicas com múltiplos profissionais?",
    answer: "Perfeitamente! O sistema permite gerenciar múltiplos médicos, especialidades e agendas. Cada profissional pode ter seu próprio perfil e a IA se adapta ao estilo de atendimento de cada um."
  },
  {
    question: "Como faço para começar a usar o Ailum na minha clínica?",
    answer: "Simples! Basta clicar no botão abaixo e agendar uma demonstração personalizada. Nossa equipe vai mostrar exatamente como o Ailum pode transformar sua clínica em apenas 30 minutos."
  }
]

const FAQItem = ({ faq, index }: { faq: typeof faqs[0], index: number }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      variants={transitionVariants.item}
      className="relative"
    >
      <div className="bg-white/80 backdrop-blur-sm border border-[#04CDD4]/20 rounded-xl p-6 hover:bg-white/90 transition-all duration-300">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left flex items-center justify-between gap-4 group"
        >
          <h3 className="text-lg font-semibold text-foreground pr-4 group-hover:text-[#04CDD4] transition-colors duration-300">
            {faq.question}
          </h3>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-[#04CDD4] flex-shrink-0 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#04CDD4] flex-shrink-0 transition-transform duration-300" />
          )}
        </button>
        
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          )}
        >
          <p className="text-muted-foreground leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function FAQSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={transitionVariants.item}>
            <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-8">
              <Highlighter color="#04CDD4" action="highlight">FAQ</Highlighter>
            </h2>
          </motion.div>
        </motion.div>

        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-6"
        >
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </motion.div>

        <motion.div
          variants={transitionVariants.container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <motion.div variants={transitionVariants.item}>
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold dark:bg-primary-600 dark:hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <a href="#application-form">
                EU QUERO
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}