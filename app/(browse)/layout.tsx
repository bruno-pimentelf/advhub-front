'use client'
import { Sidebar } from '@/components/shared/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context'
import { useState } from 'react'

function BrowseLayoutContent({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // Padrão colapsada
    const { isHidden } = useSidebar()

    return (
        <div className="min-h-screen flex">
            {!isHidden && <Sidebar onCollapseChange={setSidebarCollapsed} />}
            
            {/* Main Content */}
            <div className={`
                flex-1 transition-all duration-300 ease-in-out
                ${isHidden ? 'ml-0' : `${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}
            `}>
                <main className="min-h-screen bg-background">
                    {children}
                </main>
            </div>
        </div>
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