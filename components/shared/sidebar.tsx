'use client'
import { Logo } from '@/components/landing/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const menuItems = [
  { name: 'Funis', href: '/funnels', icon: Home },
  { name: 'Contatos', href: '/contacts', icon: Users },
  { name: 'Mensagens', href: '/messages', icon: MessageSquare },
  { name: 'Calendário', href: '/calendar', icon: Calendar },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

interface SidebarProps {
  onCollapseChange?: (isCollapsed: boolean) => void
}

export function Sidebar({ onCollapseChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const pathname = usePathname()

  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    onCollapseChange?.(newCollapsedState)
  }

  return (
    <div 
      className={cn(
        "relative flex flex-col h-screen transition-all duration-300 overflow-hidden",
        isCollapsed ? "w-16" : "w-64"
      )}
      style={{
        backgroundColor: 'var(--sidebar)',
        borderRight: '1px solid var(--sidebar-border)'
      }}
    >
      {/* Teal Glow Background - Inside the sidebar on the left */}
      <div
        className="absolute z-0"
        style={{
          left: '0',
          top: '0',
          width: '60px',
          height: '100%',
          background: "#ffffff",
          backgroundImage: `
            radial-gradient(
              circle at 30px center,
              rgba(4, 205, 212, 0.3),
              transparent 40%
            ),
            radial-gradient(
              circle at 20px top,
              rgba(4, 205, 212, 0.2),
              transparent 40%
            )
          `,
          filter: "blur(40px)",
          backgroundRepeat: "no-repeat",
        }}
      />
      
      {/* Sidebar Content */}
      <div className="relative z-10 flex flex-col h-screen">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 h-[73px]"
      >
        {!isCollapsed && (
          <div className="flex items-center transition-all duration-300 hover:scale-105">
            <Logo />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCollapseToggle}
          className={cn(
            "ml-auto cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 hover:rotate-12",
            isCollapsed && "mx-auto"
          )}
          style={{
            color: 'var(--sidebar-foreground)'
          }}
        >
          {isCollapsed ? (
            <Menu size={20} className="transition-all duration-300" />
          ) : (
            <X size={20} className="transition-all duration-300" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <TooltipProvider key={`tooltip-${item.href}-${isCollapsed}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={item.href}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full gap-3 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden",
                            isCollapsed 
                              ? "justify-center px-2" 
                              : "justify-start"
                          )}
                          style={isActive ? {
                            backgroundColor: 'var(--sidebar-primary)',
                            color: 'var(--sidebar-primary-foreground)',
                            transform: 'scale(1.02)',
                            boxShadow: '0 4px 12px rgba(4, 205, 212, 0.3)'
                          } : {
                            color: 'var(--sidebar-foreground)'
                          }}
                        >
                          {/* Hover effect background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                          <Icon 
                            size={20} 
                            className="transition-all duration-300 active:scale-110 active:rotate-12"
                          />
                          {!isCollapsed && (
                            <span className={cn(
                              "transition-all duration-300",
                              isActive && "font-semibold"
                            )}>
                              {item.name}
                            </span>
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </li>
            )
          })}
        </ul>
      </nav>
      </div>
    </div>
  )
}
