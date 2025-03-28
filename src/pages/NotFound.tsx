
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen grid-pattern flex flex-col items-center justify-center p-4">
      <MessageCircle className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <Link to="/">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFound;
