
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  CommandSquare, 
  Bot, 
  MessageSquare,
  BarChart,
  LineChart,
  FileCode,
  UsersRound,
  ArrowUpRight
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
  { icon: BookOpen, label: 'Projects', path: '/projects' },
  { icon: Bot, label: 'Prompting', path: '/prompting' },
  { icon: CommandSquare, label: 'Tools', path: '/tools' },
  { 
    icon: MessageSquare, 
    label: 'Feedback', 
    path: 'https://ruby-lake-4b9.notion.site/1f51e6060c368025b845c6dc2f75c1c2?pvs=105',
    external: true
  },
  {
    icon: LineChart,
    label: 'Roadmap',
    path: 'https://promptito.super.site/product-roadmap',
    external: true
  }
];

export const comingSoonModules = [
  { icon: BarChart, label: 'Metrics', path: '/metrics' },
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
            isActive={!item.external && isActive(item.path)}
            tooltip={item.label}
            className={cn(disabled && "opacity-50 pointer-events-none")}
            aria-disabled={disabled}
          >
            {item.external ? (
              <a 
                href={item.path} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
                onClick={onNavItemClick}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </a>
            ) : (
              <Link to={disabled ? "#" : item.path} onClick={onNavItemClick}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )}
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
