"use client"

import { useState } from "react"
import { addDays, setHours, setMinutes, subDays } from "date-fns"

import {
  EventCalendar,
  type CalendarEvent,
} from "@/components/event-calendar"

// Sample events data with hardcoded times
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Planejamento Anual",
    description: "Planejamento estratégico para o próximo ano",
    start: subDays(new Date(), 24), // 24 days before today
    end: subDays(new Date(), 23), // 23 days before today
    allDay: true,
    color: "sky",
    location: "Auditório Principal",
  },
  {
    id: "2",
    title: "Prazo do Projeto",
    description: "Entregar entregáveis finais",
    start: setMinutes(setHours(subDays(new Date(), 9), 13), 0), // 1:00 PM, 9 days before
    end: setMinutes(setHours(subDays(new Date(), 9), 15), 30), // 3:30 PM, 9 days before
    color: "amber",
    location: "Escritório",
  },
  {
    id: "3",
    title: "Revisão Trimestral do Orçamento",
    description: "Revisão do orçamento do trimestre",
    start: subDays(new Date(), 13), // 13 days before today
    end: subDays(new Date(), 13), // 13 days before today
    allDay: true,
    color: "orange",
    location: "Auditório Principal",
  },
  {
    id: "4",
    title: "Reunião da Equipe",
    description: "Sincronização semanal da equipe",
    start: setMinutes(setHours(new Date(), 10), 0), // 10:00 AM today
    end: setMinutes(setHours(new Date(), 11), 0), // 11:00 AM today
    color: "sky",
    location: "Sala de Conferência A",
  },
  {
    id: "5",
    title: "Almoço com Cliente",
    description: "Discutir novos requisitos do projeto",
    start: setMinutes(setHours(addDays(new Date(), 1), 12), 0), // 12:00 PM, 1 day from now
    end: setMinutes(setHours(addDays(new Date(), 1), 13), 15), // 1:15 PM, 1 day from now
    color: "emerald",
    location: "Café do Centro",
  },
  {
    id: "6",
    title: "Lançamento do Produto",
    description: "Lançamento do novo produto",
    start: addDays(new Date(), 3), // 3 days from now
    end: addDays(new Date(), 6), // 6 days from now
    allDay: true,
    color: "violet",
  },
  {
    id: "7",
    title: "Conferência de Vendas",
    description: "Discutir sobre novos clientes",
    start: setMinutes(setHours(addDays(new Date(), 4), 14), 30), // 2:30 PM, 4 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 14), 45), // 2:45 PM, 5 days from now
    color: "rose",
    location: "Café do Centro",
  },
  {
    id: "8",
    title: "Reunião da Equipe",
    description: "Sincronização semanal da equipe",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 0), // 9:00 AM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 10), 30), // 10:30 AM, 5 days from now
    color: "orange",
    location: "Sala de Conferência A",
  },
  {
    id: "9",
    title: "Revisar contratos",
    description: "Revisão semanal de contratos",
    start: setMinutes(setHours(addDays(new Date(), 5), 14), 0), // 2:00 PM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 15), 30), // 3:30 PM, 5 days from now
    color: "sky",
    location: "Sala de Conferência A",
  },
  {
    id: "10",
    title: "Reunião da Equipe",
    description: "Sincronização semanal da equipe",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 45), // 9:45 AM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 11), 0), // 11:00 AM, 5 days from now
    color: "amber",
    location: "Sala de Conferência A",
  },
  {
    id: "11",
    title: "Sessão de Estratégia de Marketing",
    description: "Planejamento trimestral de marketing",
    start: setMinutes(setHours(addDays(new Date(), 9), 10), 0), // 10:00 AM, 9 days from now
    end: setMinutes(setHours(addDays(new Date(), 9), 15), 30), // 3:30 PM, 9 days from now
    color: "emerald",
    location: "Departamento de Marketing",
  },
  {
    id: "12",
    title: "Reunião Anual de Acionistas",
    description: "Apresentação dos resultados anuais",
    start: addDays(new Date(), 17), // 17 days from now
    end: addDays(new Date(), 17), // 17 days from now
    allDay: true,
    color: "sky",
    location: "Centro de Conferências",
  },
  {
    id: "13",
    title: "Workshop de Desenvolvimento de Produto",
    description: "Brainstorming para novas funcionalidades",
    start: setMinutes(setHours(addDays(new Date(), 26), 9), 0), // 9:00 AM, 26 days from now
    end: setMinutes(setHours(addDays(new Date(), 27), 17), 0), // 5:00 PM, 27 days from now
    color: "rose",
    location: "Laboratório de Inovação",
  },
]

export function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents)

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event])
  }

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    )
  }

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
  }

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  )
}
