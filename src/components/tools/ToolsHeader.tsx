
import React from 'react';
import { Search, CodeSquare } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

interface ToolsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ToolsHeader: React.FC<ToolsHeaderProps> = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm
}) => {
  // Define a custom tab renderer for the disabled tool finder tab
  const toolFinderTab = {
    value: 'tool-finder',
    label: 'Tool Finder',
    icon: <Search className="h-4 w-4" />,
    disabled: true,
    custom: (
      <div className="h-7 px-3 text-sm flex items-center gap-1.5 font-mono opacity-60 cursor-not-allowed filter blur-[0.3px]">
        <Search className="h-4 w-4" />
        Tool Finder
      </div>
    )
  };

  const tabs = [
    {
      value: 'my-tools',
      label: 'My Tools',
      icon: <CodeSquare className="h-4 w-4" />
    },
    toolFinderTab
  ];

  return (
    <PageHeader 
      title="AI Tools"
      description="Discover and use AI-powered tools and language models to enhance your workflow"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showSearch={true}
      searchPlaceholder="Search tools by name, description or model..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    />
  );
};

export default ToolsHeader;
