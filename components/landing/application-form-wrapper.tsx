"use client"

import React, { useState } from 'react'
import { BlurFade } from '@/components/ui/blur-fade'
import { Highlighter } from '@/components/ui/highlighter'
import MultiStepApplicationForm from './multi-step-application-form'

export default function ApplicationFormWrapper() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const openForm = () => setIsFormOpen(true)
  const closeForm = () => setIsFormOpen(false)

  return (
    <>
      <section id="application-form" className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-16">
            <BlurFade direction="up" delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-8">
                <Highlighter color="#04CDD4" action="highlight">Aplique-se</Highlighter> para ter acesso ao Ailum
              </h2>
            </BlurFade>
            
            <BlurFade direction="up" delay={0.4}>
              <div className="bg-gradient-to-r from-[#04CDD4]/5 to-[#03a8a8]/5 rounded-2xl p-8 border border-[#04CDD4]/20 mb-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  O <strong>AILUM</strong> foi criado para clínicas que desejam elevar seus resultados e oferecer uma experiência de excelência aos pacientes.
                </p>
                <br />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Por isso, antes de qualquer apresentação, avaliamos cuidadosamente cada aplicação: queremos garantir que a sua clínica tenha o perfil ideal para aproveitar todo o potencial da nossa solução.
                </p>
                <br />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ao preencher este formulário, você dá o primeiro passo para se aplicar e descobrir se sua clínica está pronta para fazer parte do grupo premium que terá acesso ao AILUM.
                </p>
              </div>
            </BlurFade>

            <BlurFade direction="up" delay={0.6}>
              <button
                onClick={openForm}
                className="bg-gradient-to-r from-[#04CDD4] to-[#03a8a8] hover:from-[#03a8a8] hover:to-[#04CDD4] text-white font-semibold py-6 px-12 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                INICIAR APLICAÇÃO
              </button>
            </BlurFade>
          </div>
        </div>
      </section>

      <MultiStepApplicationForm isOpen={isFormOpen} onClose={closeForm} />
    </>
  )
}
