
import React from 'react';
import { 
  Sidebar, 
  SidebarHeader,
  SidebarContent
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
      
      <SidebarContent>
        <SidebarNavItems />
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarNav;
