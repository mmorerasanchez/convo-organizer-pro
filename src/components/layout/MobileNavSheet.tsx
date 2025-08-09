
import React from 'react';
import { SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

import SidebarNavItems from './SidebarNavItems';

interface MobileNavSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isActivePath: (path: string) => boolean;
}

const MobileNavSheet: React.FC<MobileNavSheetProps> = ({ 
  isOpen, 
  onOpenChange, 
  isActivePath 
}) => {
  return (
    <SheetContent side="left" className="w-60 sm:max-w-xs pr-0 bg-white">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs px-2 py-0.5 rounded-md font-mono flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            ALPHA made with AI
          </Badge>
        </div>
        <nav className="flex flex-col gap-4">
          <SidebarNavItems onNavItemClick={() => onOpenChange(false)} />
        </nav>
      </div>
    </SheetContent>
  );
};

export default MobileNavSheet;
