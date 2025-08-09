
import React from 'react';
import { 
  Sidebar, 
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar';
import SidebarNavItems from './SidebarNavItems';

const SidebarNav: React.FC = () => {
  return (
    <Sidebar 
      collapsible="icon" 
      className="z-10 bg-white"
      variant="sidebar"
    >
      <SidebarHeader className="flex items-center p-3 border-b h-14" />
      <SidebarRail />
      <SidebarContent>
        <SidebarNavItems />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex w-full items-center justify-end p-2">
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
