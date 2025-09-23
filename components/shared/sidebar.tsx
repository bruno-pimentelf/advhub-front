"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  MessageSquare, 
  Settings, 
  Calendar,
  ChevronRight,
  LogOut,
  ArrowLeft,
  Menu,
  User,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const navigationItems = [
  {
    title: "Funis",
    href: "/funnels",
    icon: Home,
    description: "Gerenciar funis",
  },
  {
    title: "Contatos",
    href: "/contacts",
    icon: Users,
    description: "Lista de contatos",
  },
  {
    title: "Mensagens",
    href: "/messages",
    icon: MessageSquare,
    description: "Central de mensagens",
  },
  {
    title: "Calendário",
    href: "/calendar",
    icon: Calendar,
    description: "Agenda e eventos",
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    description: "Configurações do sistema",
  },
];

// Componente do dropdown do usuário
const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout clicked");
    setIsOpen(false);
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between px-3 py-2 h-auto"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">
              Miguel
            </div>
            <div className="text-xs text-muted-foreground truncate">
              miguel@ailum.com
            </div>
          </div>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-2",
          isOpen && "rotate-180"
        )} />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  onCollapseChange?: (isCollapsed: boolean) => void
}

export function Sidebar({ onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const [isRetracted, setIsRetracted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    const newRetractedState = !isRetracted;
    setIsRetracted(newRetractedState);
    onCollapseChange?.(newRetractedState);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
  };

  // Se estiver retraída, mostrar apenas botão de voltar
  if (isRetracted) {
    return (
      <div className="fixed inset-y-0 left-0 z-50 w-16 bg-background/95 backdrop-blur-md border-r border-border/50 lg:block hidden">
        <div className="flex h-full flex-col">
          {/* Logo compacto */}
          <div className="flex h-16 items-center justify-center border-b border-border/50">
            <Link href="/" className="flex items-center justify-center">
              <Image 
                src="/ailum-logo.png" 
                alt="Ailum" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
            </Link>
          </div>

          {/* Botão para expandir sidebar - mais visível */}
          <div className="px-2 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleSidebar}
              className="w-full h-10 p-0"
              title="Expandir sidebar"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation compacta */}
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-center p-3 rounded-lg transition-all duration-200",
                    "hover:bg-secondary/50",
                    isActive
                      ? "bg-secondary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title={item.title}
                >
                  <Icon className="h-5 w-5" />
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer com dropdown do usuário compacto */}
          <div className="p-2 border-t border-border/50">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar expandida normal
  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={handleCloseMobile}
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-background/95 backdrop-blur-md border-r border-border/50
        ${isMobileOpen ? 'block' : 'lg:block hidden'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-border/50">
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/ailum-logo.png" 
                alt="Ailum" 
                width={40} 
                height={40}
                className="w-9 h-10"
              />
              <span className="text-xl font-semibold text-foreground">A I L U M</span>
            </Link>
            
            <div className="ml-auto flex items-center gap-2">
              {/* Botão contrair sidebar */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleSidebar}
                className="hidden lg:flex"
                title="Contrair sidebar"
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              {/* Botão fechar para mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseMobile}
                className="lg:hidden"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleCloseMobile}
                className={cn(
                  "group relative flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-secondary/50 hover:text-foreground",
                  isActive
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </div>
                </div>
                
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

          {/* Footer com dropdown do usuário */}
          <div className="p-4 border-t border-border/50">
            <UserDropdown />
          </div>
        </div>
      </div>
    </>
  );
}
