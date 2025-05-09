
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

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
        </Sheet>
        <Link to="/" className="flex items-center gap-1 font-mono text-lg font-bold tracking-tighter">
          <span>promptito</span>
          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs px-1.5 py-0.5 rounded-md font-mono flex items-center">
            <Sparkles className="h-2.5 w-2.5 mr-0.5" />
            BETA
          </Badge>
        </Link>
      </div>
    </div>
  );
};

export default MobileHeader;
