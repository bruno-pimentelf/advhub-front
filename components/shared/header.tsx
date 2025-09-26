'use client'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'

interface HeaderProps {
  sidebarCollapsed?: boolean
  actions?: ReactNode
}

export function Header({ sidebarCollapsed = false, actions }: HeaderProps) {
  const pathname = usePathname()

  // Check if we're on the landing page
  const isLandingPage = pathname === '/' && !pathname.startsWith('/funnels') && !pathname.startsWith('/contacts') && !pathname.startsWith('/messages') && !pathname.startsWith('/chats') && !pathname.startsWith('/calendar') && !pathname.startsWith('/settings')

  // Get page title based on current route
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
      case '/dashboard':
      case '/funnels':
        return 'Funil de Vendas'
      case '/contacts':
        return 'Contatos'
      case '/messages':
        return 'Mensagens'
      case '/chats':
        return 'Chats'
      case '/settings':
        return 'Configurações'
      case '/calendar':
        return 'Calendário'
      default:
        return 'Dashboard'
    }
  }

  return (
    <header 
      className={cn(
        "mx-4 mt-4 px-6 transition-all duration-300 h-16 flex items-center justify-between bg-background/95 backdrop-blur-md border border-primary/30 rounded-2xl"
      )}
    >
      {/* Page Title */}
      <h1 className="text-xl font-semibold">
        {getPageTitle()}
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Custom Actions */}
        {actions && (
          <div className="flex gap-3">
            {actions}
          </div>
        )}
        
        {/* Theme Toggle - only show on browse pages */}
        {!isLandingPage && <ThemeToggle />}
        
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative"
          style={{
            color: 'var(--foreground)'
          }}
        >
          <Bell size={20} />
          <span 
            className="absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center"
            style={{
              backgroundColor: 'var(--destructive)',
              color: 'white'
            }}
          >
            3
          </span>
        </Button>
      </div>
    </header>
  )
}
