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
import React from 'react'
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
        "flex flex-col h-screen transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
      style={{
        backgroundColor: 'var(--sidebar)',
        borderRight: '1px solid var(--sidebar-border)'
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 h-[73px]"
      >
        {!isCollapsed && (
          <div className="flex items-center">
            <Logo />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCollapseToggle}
          className={cn(
            "ml-auto cursor-pointer",
            isCollapsed && "mx-auto"
          )}
          style={{
            color: 'var(--sidebar-foreground)'
          }}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
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
                            "w-full gap-3 cursor-pointer",
                            isCollapsed 
                              ? "justify-center px-2" 
                              : "justify-start"
                          )}
                          style={isActive ? {
                            backgroundColor: 'var(--sidebar-primary)',
                            color: 'var(--sidebar-primary-foreground)'
                          } : {
                            color: 'var(--sidebar-foreground)'
                          }}
                        >
                          <Icon size={20} />
                          {!isCollapsed && <span>{item.name}</span>}
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
  )
}
