"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar,
  LogOut,
  ArrowLeft,
  Menu,
  User,
  ChevronDown,
  MessageCircle,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth as useAuthHook } from "@/hooks/use-auth";
import { useAuth as useAuthContext } from "@/contexts/auth-context";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

const navigationItems = [
  {
    title: "Funis",
    href: "/funnels",
    icon: TrendingUp,
  },
  {
    title: "Contatos",
    href: "/contacts",
    icon: Users,
  },
  {
    title: "Mensagens",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Chats",
    href: "/chats",
    icon: MessageCircle,
  },
  {
    title: "Calendário",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Explorador",
    href: "/funnel-explorer",
    icon: Compass,
  },
];

// Componente do tooltip do usuário (para sidebar retraída)
const UserTooltip = () => {
  const { authUser } = useAuthHook();
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-20 transition-all duration-200 bg-primary-100 dark:bg-primary-900/30">
          <User className="w-4 h-4 text-foreground" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <div>
          <p className="font-medium">{authUser?.displayName || authUser?.email?.split('@')[0] || 'Usuário'}</p>
          <p className="text-xs opacity-80">{authUser?.email || 'email@exemplo.com'}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

// Componente do dropdown do usuário
const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { authUser } = useAuthHook();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout");
    }
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-100 dark:bg-primary-900/30">
            <User className="w-4 h-4 text-foreground" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">
              {authUser?.displayName || authUser?.email?.split('@')[0] || 'Usuário'}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {authUser?.email || 'email@exemplo.com'}
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
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
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
  const [isCollapsed, setIsCollapsed] = useState(true); // Padrão colapsada
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300"
          onClick={handleCloseMobile}
        />
      )}
      
              <div 
                data-sidebar
                className={cn(
                  "fixed inset-y-0 left-0 z-50 bg-background border-r border-border transition-all duration-300 ease-in-out",
                  isCollapsed ? "w-16" : "w-56",
                  isMobileOpen ? 'block' : 'lg:block hidden'
                )}
              >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center transition-all duration-300 ease-in-out">
            <Link href="/" className={cn(
              "flex items-center transition-all duration-300 ease-in-out",
              isCollapsed ? "justify-center w-full" : "px-6"
            )}>
              <span className={cn(
                "font-bold text-xl whitespace-nowrap transition-all duration-200 ease-in-out text-[#1e3a8a]",
                isCollapsed ? "text-lg" : "text-2xl"
              )}>
                Advhub
              </span>
            </Link>
            
            {!isCollapsed && (
              <div className="ml-auto flex items-center gap-2 pr-2 transition-all duration-300 ease-in-out">
                {/* Botão contrair sidebar */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleSidebar}
                  className="hidden lg:flex hover:bg-accent transition-colors duration-200"
                  title="Contrair sidebar"
                >
                  <Menu className="w-4 h-4" />
                </Button>
                
                {/* Botão fechar para mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseMobile}
                  className="lg:hidden hover:bg-accent transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Botão para expandir sidebar (quando colapsada) */}
          {isCollapsed && (
            <div className="px-2 py-2 transition-all duration-300 ease-in-out">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleSidebar}
                    className="w-full h-10 p-0 hover:bg-accent transition-colors duration-200"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expandir</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Navigation */}
          <nav className={cn(
            "flex-1 py-4 space-y-1.5 transition-all duration-300 ease-in-out",
            isCollapsed ? "px-2" : "px-4"
          )}>
            {navigationItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              
              if (isCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex items-center justify-center p-2.5 rounded-lg transition-all duration-200",
                          "hover:bg-accent hover:scale-105 transform",
                          isActive
                            ? "bg-accent text-accent-foreground scale-105"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary transition-all duration-200" />
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium">{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleCloseMobile}
                  className={cn(
                    "group relative flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] transform",
                    isActive
                      ? "bg-accent text-accent-foreground scale-[1.02]"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm font-medium transition-all duration-300 ease-in-out">{item.title}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary transition-all duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer com dropdown do usuário e theme toggle */}
          <div className={cn(
            "border-t border-border transition-all duration-300 ease-in-out",
            isCollapsed ? "p-2" : "p-3"
          )}>
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-2">
                <UserTooltip />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center">
                      <ThemeToggle />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Alternar tema</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full min-w-0">
                <div className="flex-1 min-w-0">
                  <UserDropdown />
                </div>
                <div className="flex-shrink-0 ml-2">
                  <ThemeToggle />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
