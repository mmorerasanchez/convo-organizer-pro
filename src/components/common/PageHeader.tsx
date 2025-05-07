
import React, { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  tabs?: {
    value: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  children?: ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  children,
  showSearch,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-medium tracking-tight mb-1">{title}</h1>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {tabs && tabs.length > 0 && (
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full max-w-[600px]">
            <TabsList className="h-9 p-1 bg-muted/50">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="h-7 px-3 text-sm flex items-center gap-1.5 font-mono"
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {showSearch && (
          <div className="relative w-full sm:w-auto sm:min-w-[260px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9 h-9 text-sm w-full font-mono"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        )}
      </div>
      
      {children}
    </div>
  );
};

export default PageHeader;
