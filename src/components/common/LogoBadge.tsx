
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LogoBadgeProps {
  className?: string;
}

const LogoBadge: React.FC<LogoBadgeProps> = ({ className }) => {
  return (
    <div className={`mb-8 text-center ${className || ''}`}>
      <div className="flex items-center justify-center mb-2">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/b15e12a3-21d5-4c4a-b216-7b5f6b43112e.png" 
            alt="Logo" 
            className="h-7 w-7 mr-2"
          />
        </div>
        <div className="ml-2">
          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs px-2 py-1 rounded-md font-medium flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            ALPHA made with AI
          </Badge>
        </div>
      </div>
      <p className="text-muted-foreground">10X your prompt—ductivity</p>
    </div>
  );
};

export default LogoBadge;
