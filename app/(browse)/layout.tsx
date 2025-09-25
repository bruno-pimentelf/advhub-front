'use client'
import { Sidebar } from '@/components/shared/sidebar'
import { Header } from '@/components/shared/header'
import { useState } from 'react'

export default function BrowseLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className="min-h-screen">
            <Sidebar onCollapseChange={setSidebarCollapsed} />
            
            {/* Main Content */}
            <div className={`
                flex flex-col min-h-screen transition-all duration-300
                ml-0 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
            `}>
                <Header sidebarCollapsed={sidebarCollapsed} />
                <main className="flex-1 overflow-auto bg-background mx-4 mb-4 mt-2">
                    {children}
                </main>
            </div>
        </div>
    )
}