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
        <div className="flex h-screen">
            <Sidebar onCollapseChange={setSidebarCollapsed} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header sidebarCollapsed={sidebarCollapsed} />
                <main className="flex-1 overflow-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    )
}