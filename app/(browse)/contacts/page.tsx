import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { TypographyH1 } from '@/components/Typography/h1'

export default function ContactsPage() {
  return (
    <div>
        <div className="p-6">
            <TypographyH1>Contatos</TypographyH1>
        </div>
    </div>
  )
}