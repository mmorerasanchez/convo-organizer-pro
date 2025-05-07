
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">{title}</h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      
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
        </Tabs>
      )}
    </div>
  );
};

export default PageHeader;
