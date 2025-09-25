'use client'

import { TypographyH1 } from '@/components/Typography/h1'
import { Calendar } from '@/components/calendar/Calendar'
import React from 'react'

const page = () => {
  return (
    <div>
        <div className="p-6">
            <Calendar />
        </div>
    </div>
  )
}

export default page