"use client"

import React from 'react'
import { BlurFade } from '@/components/ui/blur-fade'
import { Highlighter } from '@/components/ui/highlighter'
import { Button } from '@/components/ui/button'
import { ShinyButton } from '@/components/ui/shiny-button'
import { Pointer } from '@/components/ui/pointer'
import { 
  CheckCircle, 
  Star, 
  Zap,
  Users,
  TrendingUp,
  Clock
} from 'lucide-react'

const advantages = [
  {
    icon: Users,
    title: "CRM especializado para clínicas",
    description: "Desenvolvido com foco exclusivo no setor da saúde"
  },
  {
    icon: Zap,
    title: "Integração inteligente com WhatsApp",
    description: "IA analisa conversas e gera mensagens estratégicas"
  },
  {
    icon: TrendingUp,
    title: "Economia nos investimentos",
    description: "Substitui treinamentos caros com scripts inteligentes"
  },
  {
    icon: Clock,
    title: "Facilidade de uso",
    description: "Interface intuitiva sem burocracia ou treinamentos complexos"
  }
]

export default function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#04CDD4]/5 to-[#03a8a8]/5" />
      
      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="text-center mb-16">
          <BlurFade direction="up" delay={0.2}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-8">
              Somos a <Highlighter color="#04CDD4" action="highlight">melhor opção</Highlighter> para o seu CRM!
            </h2>
          </BlurFade>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {advantages.map((advantage, index) => (
            <BlurFade key={index} direction="up" delay={0.2 + index * 0.1}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#04CDD4]/20 hover:bg-white/90 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#04CDD4] to-[#03a8a8] text-white">
                    <advantage.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {advantage.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>

        <div className="text-center mb-16">
          <BlurFade direction="up" delay={0.6}>
              <div className="bg-gradient-to-r from-[#04CDD4]/10 to-[#03a8a8]/10 rounded-2xl p-8 border border-[#04CDD4]/20 mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Se sua clínica quer mais pacientes, mais organização e mais faturamento com menos esforço, o Ailum - CRM Powered by AI é para você!
              </h3>
            </div>
          </BlurFade>
        </div>

        <div className="text-center">
          <BlurFade direction="up" delay={0.8}>
            <div className="relative inline-block">
              <Pointer>
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
              </Pointer>
              <Button 
                size="lg" 
                className="text-xl px-12 py-6 bg-primary hover:bg-primary/90 text-white font-semibold dark:bg-primary-600 dark:hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a href="#application-form">
                  É para mim
                </a>
              </Button>
            </div>
          </BlurFade>
        </div>

        {/* Final CTA Section */}
        <div className="mt-24 text-center">
          <BlurFade direction="up" delay={1.0}>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#04CDD4]/20 to-[#03a8a8]/20" />
              <div className="relative z-10">
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Não perca a oportunidade de transformar sua clínica com a tecnologia mais avançada do mercado.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="#application-form">
                    <ShinyButton className="text-lg px-8 py-4 bg-white text-gray-900 hover:bg-gray-100">
                      APLIQUE-SE
                    </ShinyButton>
                  </a>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
