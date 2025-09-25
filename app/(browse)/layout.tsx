'use client'
import { Sidebar } from '@/components/shared/sidebar'
import { Header } from '@/components/shared/header'
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

export default function BrowseLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [headerActions, setHeaderActions] = useState<ReactNode>(null)

    return (
        <HeaderContext.Provider value={{ setHeaderActions }}>
            <div className="min-h-screen">
                <Sidebar onCollapseChange={setSidebarCollapsed} />
                
                {/* Main Content */}
                <div className={`
                    flex flex-col min-h-screen transition-all duration-300
                    ml-0 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
                `}>
                    <Header 
                      sidebarCollapsed={sidebarCollapsed} 
                      actions={headerActions}
                    />
                    <main className="flex-1 overflow-auto bg-background">
                        {children}
                    </main>
                </div>
            </div>
        </HeaderContext.Provider>
    )
}