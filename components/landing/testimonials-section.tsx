"use client"

import React from 'react'
import { Marquee } from '@/components/ui/marquee'
import { BlurFade } from '@/components/ui/blur-fade'
import { Highlighter } from '@/components/ui/highlighter'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const reviews = [
  {
    name: "Dr. Carlos Silva",
    username: "Cardiologia",
    body: "Aumentamos 40% nas vendas e nunca mais perdemos um paciente por falta de follow-up.",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Dra. Ana Costa",
    username: "Odontologia",
    body: "A IA sugere as melhores mensagens e nossa secretária atende 3x mais pacientes.",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Dr. Roberto Santos",
    username: "Estética",
    body: "O Ailum identifica oportunidades de venda que eu nem sabia que existiam!",
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Dra. Maria Oliveira",
    username: "Dermatologia",
    body: "Organiza tudo e me ajuda a fidelizar pacientes sem esforço.",
    img: "https://images.unsplash.com/photo-1594824374106-c6b765a2a8d1?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Dr. João Pereira",
    username: "Clínica Geral",
    body: "Reduzimos 60% do tempo gasto com atendimentos manuais.",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Dra. Fernanda Lima",
    username: "Nutrição",
    body: "Nossos pacientes nunca mais esquecem das consultas e nossa taxa de no-show caiu drasticamente.",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Dr. Pedro Almeida",
    username: "Ortopedia",
    body: "A automação do WhatsApp economiza 8 horas por dia da nossa equipe.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Dra. Juliana Rocha",
    username: "Ginecologia",
    body: "Conseguimos agendar 50% mais consultas com a mesma equipe.",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Dr. Marcelo Souza",
    username: "Psiquiatria",
    body: "O sistema de lembretes reduziu cancelamentos em 70%.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Dra. Camila Ferreira",
    username: "Pediatria",
    body: "A organização dos contatos é perfeita. Nunca mais perdemos um lead.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Dr. Rafael Mendes",
    username: "Urologia",
    body: "As mensagens personalizadas aumentaram nossa taxa de conversão em 35%.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Dra. Larissa Santos",
    username: "Endocrinologia",
    body: "O follow-up automático mantém nossos pacientes engajados.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-[#04CDD4]/20 bg-white/80 backdrop-blur-sm hover:bg-white/90",
        // dark styles
        "dark:border-[#04CDD4]/20 dark:bg-white/10 dark:hover:bg-white/15"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <BlurFade direction="up" delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-8">
              Junte-se a clínicas que confiaram no nosso trabalho e <Highlighter color="#04CDD4" action="highlight">cresceram</Highlighter>:
            </h2>
          </BlurFade>
          
          <BlurFade direction="up" delay={0.4}>
            <div className="flex justify-center items-center gap-8 mb-12">
              <div className="text-2xl font-bold text-muted-foreground">Clínicas parceiras em todo o Brasil</div>
            </div>
          </BlurFade>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
        </div>

        <div className="text-center mt-16">
          <BlurFade direction="up" delay={0.6}>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              O que nossos clientes dizem:
            </h3>
          </BlurFade>

          <BlurFade direction="up" delay={0.8}>
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold dark:bg-primary-600 dark:hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <a href="#application-form">
                Eu quero!
              </a>
            </Button>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
