import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
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
                <div className="min-h-[70vh] w-full relative bg-white">
                    {/* Teal Glow Top */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            background: "#ffffff",
                            backgroundImage: `
                                radial-gradient(
                                    circle at top center,
                                    rgba(4, 205, 212, 0.5),
                                    transparent 30%
                                )
                            `,
                            filter: "blur(100px)",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                    {/* Your Content/Components */}
                    <section>
                        <div className="relative pt-8 md:pt-12 pb-8 md:pb-12">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20">
                            <Image
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                                width="3276"
                                height="4095"
                            />
                        </AnimatedGroup>
                        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                                {/* Left Column - Text Content */}
                                <div className="flex-1 lg:flex-[0.8] text-left">
                                    <AnimatedGroup variants={transitionVariants}>
                                        <Link
                                            href="#link"
                                            className="hover:bg-background dark:hover:border-t-border bg-muted group inline-flex items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                            <span className="text-foreground text-sm">O CRM que usa IA do jeito certo</span>
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
                                        </Link>
                                    </AnimatedGroup>

                                    <TextEffect
                                        preset="fade-in-blur"
                                        speedSegment={0.3}
                                        as="h1"
                                        className="mt-8 md:text-left text-center text-6xl font-medium md:text-5xl lg:mt-16 xl:text-[4.25rem]">
                                        Modernize sua clínica com o CRM do futuro
                                    </TextEffect>
                                    <TextEffect
                                        per="line"
                                        preset="fade-in-blur"
                                        speedSegment={0.3}
                                        delay={0.5}
                                        as="p"
                                        className="mt-8 max-w-2xl text-balance text-lg">
                                        Um CRM completo para clínicas que não perde a essência do atendimento humano, com IA para melhorar a experiência do paciente e otimizar o seu negócio.
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
                                        className="mt-12 flex flex-col items-start gap-2 md:flex-row">
                                        <div
                                            key={1}
                                            className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                            <Button
                                                asChild
                                                size="lg"
                                                className="rounded-xl px-5 text-base">
                                                <Link href="#link">
                                                    <span className="text-nowrap">Comece agora</span>
                                                </Link>
                                            </Button>
                                        </div>
                                        <Button
                                            key={2}
                                            asChild
                                            size="lg"
                                            variant="ghost"
                                            className="h-10.5 rounded-xl px-5">
                                            <Link href="#link">
                                                <span className="text-nowrap">Solicite uma demonstração</span>
                                            </Link>
                                        </Button>
                                    </AnimatedGroup>
                                </div>

                                {/* Right Column - Image */}
                                <div className="flex-1 lg:flex-[0.5]">
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
                                        }}>
                                        <div className="relative overflow-hidden">
                                            <div
                                                aria-hidden
                                                className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                            />
                                            <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                                <Image
                                                    className="bg-background aspect-[3/4] relative hidden rounded-2xl dark:block"
                                                    src="/Card.svg"
                                                    alt="app screen"
                                                    width="1000"
                                                    height="400"
                                                />
                                                <Image
                                                    className="z-2 border-border/25 aspect-[3/4] relative rounded-2xl border dark:hidden"
                                                    src="/Card.svg"
                                                    alt="app screen"
                                                    width="1000"
                                                    height="400"
                                                />
                                            </div>
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
