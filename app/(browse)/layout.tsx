'use client'
import { Sidebar } from '@/components/shared/sidebar'
import { Header } from '@/components/shared/header'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context'
import { useState, createContext, useContext } from 'react'
import { ReactNode } from 'react'

interface HeaderContextType {
  setHeaderActions: (actions: ReactNode) => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export const useHeader = () => {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
}

function BrowseLayoutContent({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [headerActions, setHeaderActions] = useState<ReactNode>(null)
    const { isHidden } = useSidebar()

    return (
        <HeaderContext.Provider value={{ setHeaderActions }}>
            <div className="min-h-screen">
                {!isHidden && <Sidebar onCollapseChange={setSidebarCollapsed} />}
                
                {/* Main Content */}
                <div className={`
                    flex flex-col min-h-screen transition-all duration-300
                    ${isHidden ? 'ml-0' : `ml-0 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}
                `}>
                    {!isHidden && (
                        <Header 
                          sidebarCollapsed={sidebarCollapsed} 
                          actions={headerActions}
                        />
                    )}
                    <main className={`flex-1 overflow-auto bg-background ${isHidden ? 'min-h-screen' : ''}`}>
                        {children}
                    </main>
                </div>
            </div>
        </HeaderContext.Provider>
    )
}

export default function BrowseLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <BrowseLayoutContent>
                    {children}
                </BrowseLayoutContent>
            </SidebarProvider>
        </ThemeProvider>
    )
}