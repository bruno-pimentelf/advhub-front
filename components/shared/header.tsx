'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, Search, Settings, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export function Header({ sidebarCollapsed = false }: HeaderProps) {
  return (
    <header 
      className={cn(
        "px-6 transition-all duration-300 h-[73px] flex items-center",
        sidebarCollapsed && "ml-[-1px]" // Ajusta para alinhar com a borda da sidebar
      )}
      style={{
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)'
      }}
    >

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-auto">
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

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-10 w-10 rounded-full"
              style={{
                color: 'var(--foreground)'
              }}
            >
              <Avatar>
                <AvatarImage src="/avatar.jpg" alt="User" />
                <AvatarFallback 
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)'
                  }}
                >
                  M
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Miguel</p>
                <p className="text-xs leading-none text-muted-foreground">
                  miguel@ailum.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              style={{
                color: 'var(--destructive)'
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
