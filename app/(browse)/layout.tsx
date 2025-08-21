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
            {/* Sidebar with Teal Glow */}
            <div className="relative">
                {/* Teal Glow for Sidebar */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: "#ffffff",
                        backgroundImage: `
                            radial-gradient(
                                circle at top center,
                                rgba(4, 205, 212, 0.2),
                                transparent 50%
                            ),
                            radial-gradient(
                                circle at top,
                                rgba(4, 205, 212, 0.15),
                                transparent 50%
                            )
                        `,
                        filter: "blur(80px)",
                        backgroundRepeat: "no-repeat",
                    }}
                />
                <div className="relative z-10">
                    <Sidebar onCollapseChange={setSidebarCollapsed} />
                </div>
            </div>
            
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