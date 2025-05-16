import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Wrench, 
  Lightbulb, 
  MessageSquare,
  BarChart,
  LineChart,
  FileCode,
  UsersRound
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';

export const activeModules = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Lightbulb, label: 'Prompting', path: '/prompting' },
  { icon: Wrench, label: 'Tools', path: '/tools' },
  { icon: BookOpen, label: 'Projects', path: '/projects' },
];

export const comingSoonModules = [
  { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
  { icon: BarChart, label: 'Metrics', path: '/metrics' },
  { icon: LineChart, label: 'Roadmap', path: '/roadmap' },
  { icon: FileCode, label: 'Templates', path: '/templates' },
  { icon: UsersRound, label: 'Agents', path: '/agents' },
];

interface SidebarNavItemsProps {
  onNavItemClick?: () => void;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ onNavItemClick }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const renderSidebarLinks = (items: typeof activeModules, disabled = false) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton 
            asChild 
            isActive={isActive(item.path)}
            tooltip={item.label}
            className={cn(disabled && "opacity-50 pointer-events-none")}
            aria-disabled={disabled}
          >
            <Link to={disabled ? "#" : item.path} onClick={onNavItemClick}>
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Active modules</SidebarGroupLabel>
        <SidebarGroupContent>
          {renderSidebarLinks(activeModules)}
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel>Coming soon</SidebarGroupLabel>
        <SidebarGroupContent>
          {renderSidebarLinks(comingSoonModules, true)}
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default SidebarNavItems;
