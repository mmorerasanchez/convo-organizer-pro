
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
import SidebarLogoFooter from './SidebarLogoFooter';

const SidebarNav: React.FC = () => {
  return (
    <Sidebar 
      collapsible="icon" 
      className="z-10 bg-white"
      variant="sidebar"
    >
      <SidebarHeader className="flex items-center justify-between p-3 border-b h-14">
        <div className={cn(
          "flex items-center transition-opacity duration-200",
          "group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
        )}>
          <Link to="/" className={cn(
            "font-mono font-bold tracking-tighter flex items-center gap-1",
            "group-data-[collapsible=icon]:justify-center"
          )}>
            <span className="text-lg md:text-xl">p</span>
            <span className={cn(
              "transition-opacity duration-200",
              "group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden"
            )}>
              romptito
            </span>
          </Link>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarNavItems />
      </SidebarContent>
      
      <SidebarFooter className="mt-auto border-t p-3 flex justify-center items-center">
        <SidebarLogoFooter />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
