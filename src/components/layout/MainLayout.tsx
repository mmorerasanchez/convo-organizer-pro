
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarNav from './SidebarNav';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';
import SidebarLogoFooter from './SidebarLogoFooter';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <div className="flex flex-1">
          <SidebarNav />
          
          <div className="flex flex-col flex-1 min-w-0">
            {/* Mobile header */}
            <MobileHeader />

            {/* Desktop header - now sticky */}
            <DesktopHeader />
            
            {/* Main content with adjusted padding for fixed header */}
            <main className="flex-1 px-container py-section sm:px-section">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
            
            {/* Centered footer with logo */}
            <footer className="border-t p-4 text-center">
              <SidebarLogoFooter />
            </footer>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
