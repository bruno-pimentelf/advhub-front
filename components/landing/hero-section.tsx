import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
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

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div className="min-h-[85vh] w-full relative bg-white">
                    {/* Blue Glow Top */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            background: "#ffffff",
                            backgroundImage: `
                                radial-gradient(
                                    circle at top center,
                                    rgba(30, 58, 138, 0.3),
                                    transparent 30%
                                )
                            `,
                            filter: "blur(100px)",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                    {/* Your Content/Components */}
                    <section>
                        <div className="relative pt-16 md:pt-24 pb-16 md:pb-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <div className="flex flex-col items-center justify-center">
                                {/* Text Content */}
                                <div className="w-full max-w-4xl text-center">
                                    <AnimatedGroup variants={transitionVariants}>
                                        <div className="hover:bg-background dark:hover:border-t-border bg-muted group inline-flex items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                            <span className="text-foreground text-sm">Gestão jurídica inteligente com IA</span>
                                            <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                            <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                                <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                    <span className="flex size-6">
                                                        <ArrowRight className="m-auto size-3" />
                                                    </span>
                                                    <span className="flex size-6">
                                                        <ArrowRight className="m-auto size-3" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </AnimatedGroup>

                                    <TextEffect
                                        preset="fade-in-blur"
                                        speedSegment={0.3}
                                        as="h1"
                                        className="mt-8 text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                                        Transforme seu escritório com tecnologia jurídica de ponta
                                    </TextEffect>
                                    <TextEffect
                                        per="line"
                                        preset="fade-in-blur"
                                        speedSegment={0.3}
                                        delay={0.5}
                                        as="p"
                                        className="mt-8 mx-auto max-w-3xl text-balance text-xl text-muted-foreground">
                                        Plataforma completa para advogados que automatiza atendimento, gestão de contratos e relacionamento com clientes, usando IA para otimizar seu tempo e aumentar conversões.
                                    </TextEffect>

                                    <AnimatedGroup
                                        variants={{
                                            container: {
                                                visible: {
                                                    transition: {
                                                        staggerChildren: 0.05,
                                                        delayChildren: 0.75,
                                                    },
                                                },
                                            },
                                            ...transitionVariants,
                                        }}
                                        className="mt-12 flex flex-col items-center gap-4 md:flex-row md:justify-center">
                                        <div
                                            key={1}
                                            className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                            <Button
                                                size="lg"
                                                asChild
                                                className="rounded-xl px-5 text-base">
                                                <Link href="/login">
                                                    <span className="text-nowrap">Começar agora</span>
                                                </Link>
                                            </Button>
                                        </div>
                                    </AnimatedGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                </div>
            </main>
        </>
    )
}
