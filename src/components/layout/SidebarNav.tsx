
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sidebar, 
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger 
} from '@/components/ui/sidebar';
import SidebarNavItems from './SidebarNavItems';
import JoinProjectDialog from '@/components/projects/JoinProjectDialog';

const SidebarNav: React.FC = () => {
  return (
    <Sidebar 
      collapsible="icon" 
      className="z-10 bg-white"
      variant="sidebar"
    >
      <SidebarHeader className="flex items-center justify-end p-3 border-b h-14">
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarNavItems />
        
        <div className="px-3 py-2">
          <JoinProjectDialog />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarNav;
