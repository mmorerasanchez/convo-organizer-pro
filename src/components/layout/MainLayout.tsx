
import React, { useState } from 'react';
import { Sheet } from '@/components/ui/sheet';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarNav from './SidebarNav';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';
import MobileNavSheet from './MobileNavSheet';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Sheet open={open} onOpenChange={setOpen}>
          <MobileNavSheet 
            isOpen={open}
            onOpenChange={setOpen}
            isActivePath={isActive}
          />
        </Sheet>
        
        <div className="flex flex-1">
          <SidebarNav />
          
          <div className="flex flex-col flex-1">
            {/* Mobile header */}
            <MobileHeader />

            {/* Desktop header */}
            <DesktopHeader />
            
            <main className="flex-1 px-4 py-6 sm:px-6">
              <div className="mx-auto max-w-5xl">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
