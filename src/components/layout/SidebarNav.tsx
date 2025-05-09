
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
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarNav;
