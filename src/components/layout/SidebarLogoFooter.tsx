
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SidebarLogoFooter: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5">
      <Link to="/" className="flex items-center">
        <img 
          src="/lovable-uploads/b15e12a3-21d5-4c4a-b216-7b5f6b43112e.png" 
          alt="Promptito" 
          className="h-5 w-5 mr-1"
        />
      </Link>
      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs px-1.5 py-0.5 rounded-md font-mono flex items-center">
        <Sparkles className="h-2.5 w-2.5 mr-0.5" />
        ALPHA
      </Badge>
    </div>
  );
};

export default SidebarLogoFooter;
