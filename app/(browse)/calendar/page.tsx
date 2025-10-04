'use client'

import { Calendar } from '@/components/calendar/Calendar'
import React, { useState, useEffect } from 'react'

const page = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-muted-foreground">Carregando calendário...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <div className="h-full w-full bg-background/95 backdrop-blur-md overflow-hidden">
        <Calendar />
      </div>
    </div>
  )
}

export default page