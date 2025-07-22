
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

            {/* Desktop header - sticky */}
            <DesktopHeader />
            
            {/* Main content with adjusted padding for sticky header and footer */}
            <main className="flex-1 px-container py-section sm:px-section pb-20">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>

            {/* Footer - now sticky and inside content column for natural alignment */}
            <footer className="sticky bottom-0 right-0 z-20 border-t bg-white">
              <div className="flex h-16 items-center justify-center px-4">
                <SidebarLogoFooter />
              </div>
            </footer>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
