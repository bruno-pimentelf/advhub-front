'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isHidden: boolean;
  hideSidebar: () => void;
  showSidebar: () => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isHidden, setIsHidden] = useState(false);

  const hideSidebar = () => setIsHidden(true);
  const showSidebar = () => setIsHidden(false);
  const toggleSidebar = () => setIsHidden(prev => !prev);

  return (
    <SidebarContext.Provider value={{
      isHidden,
      hideSidebar,
      showSidebar,
      toggleSidebar,
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
