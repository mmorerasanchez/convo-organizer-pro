
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import MobileNavSheet from './MobileNavSheet';
import { useLocation } from 'react-router-dom';

const MobileHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="md:hidden border-b bg-white">
      <div className="flex h-14 items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle mobile navigation</span>
            </Button>
          </SheetTrigger>
          <MobileNavSheet 
            isOpen={open}
            onOpenChange={setOpen}
            isActivePath={isActivePath}
          />
        </Sheet>
      </div>
    </div>
  );
};

export default MobileHeader;
