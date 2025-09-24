"use client"

import { cn } from "@/lib/utils"
import { AnimatedList } from "@/components/ui/animated-list"

interface Item {
  name: string
  description: string
  icon: string
  color: string
  time: string
}

let notifications = [
  {
    name: "Nova consulta agendada",
    description: "Dr. Carlos - Cardiologia - 15/01 às 14h",
    time: "2m atrás",
    icon: "📅",
    color: "#04CDD4",
  },
  {
    name: "Paciente confirmou",
    description: "Maria Silva confirmou consulta de amanhã",
    time: "5m atrás",
    icon: "✅",
    color: "#04CDD4",
  },
  {
    name: "Lembrete enviado",
    description: "Follow-up automático para João Santos",
    time: "8m atrás",
    icon: "💬",
    color: "#04CDD4",
  },
  {
    name: "Lead qualificado",
    description: "Ana Costa demonstrou interesse em procedimento",
    time: "12m atrás",
    icon: "🎯",
    color: "#04CDD4",
  },
  {
    name: "Consulta cancelada",
    description: "Pedro Lima cancelou - reagendamento sugerido",
    time: "15m atrás",
    icon: "❌",
    color: "#04CDD4",
  },
  {
    name: "Nova mensagem",
    description: "Paciente perguntou sobre disponibilidade",
    time: "18m atrás",
    icon: "💬",
    color: "#04CDD4",
  },
  {
    name: "Follow-up automático",
    description: "Lembrete de consulta enviado para 3 pacientes",
    time: "22m atrás",
    icon: "🔄",
    color: "#04CDD4",
  },
  {
    name: "Lead convertido",
    description: "Roberto Silva agendou primeira consulta",
    time: "25m atrás",
    icon: "🎉",
    color: "#04CDD4",
  },
]

notifications = Array.from({ length: 5 }, () => notifications).flat()

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  )
}

export function MessagesDemo({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
    </div>
  )
}
