
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import MobileNavSheet from './MobileNavSheet';

const MobileHeader: React.FC = () => {
  return (
    <div className="md:hidden border-b bg-white">
      <div className="flex h-14 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle mobile navigation</span>
            </Button>
          </SheetTrigger>
          <MobileNavSheet />
        </Sheet>
      </div>
    </div>
  );
};

export default MobileHeader;
