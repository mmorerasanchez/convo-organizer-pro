
import React from 'react';
import { Link } from 'react-router-dom';
import { PanelLeftClose } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar, 
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import SidebarNavItems from './SidebarNavItems';
import JoinProjectDialog from '@/components/projects/JoinProjectDialog';
import { Button } from '@/components/ui/button';

const SidebarNav: React.FC = () => {
  const { state, toggleSidebar } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Sidebar 
      collapsible="icon" 
      className="z-10 bg-white"
      variant="sidebar"
    >
      <SidebarHeader className="flex items-center p-3 border-b h-14">
        <SidebarTrigger className="ml-0" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarNavItems />
        
        <div className="px-3 py-2">
          <JoinProjectDialog />
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2" 
          onClick={toggleSidebar}
        >
          <PanelLeftClose size={18} />
          {isExpanded && <span>Collapse</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
