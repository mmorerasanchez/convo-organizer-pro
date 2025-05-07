
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
        <h1 className="text-2xl font-semibold tracking-tight mb-2">{title}</h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9 w-full md:max-w-md"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      )}
      
      {tabs && tabs.length > 0 && (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="border-b mb-6">
            <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-3 h-auto text-base flex items-center gap-2"
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {children}
        </Tabs>
      )}
    </div>
  );
};

export default PageHeader;
