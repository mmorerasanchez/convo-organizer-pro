
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, MessageCircle, Lightbulb, Menu, UserCircle, LogOut, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Projects', path: '/projects' },
    { icon: MessageCircle, label: 'Conversations', path: '/conversations' },
    { icon: Wrench, label: 'Tools', path: '/tools' },
    { icon: Lightbulb, label: 'Prompting', path: '/prompting' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const renderNavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
            isActive(item.path)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          onClick={() => setOpen(false)}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-4 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle mobile navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 sm:max-w-xs pr-0">
              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="text-xl font-bold tracking-tight"
                  onClick={() => setOpen(false)}
                >
                  Prompt Copilot
                </Link>
                <nav className="flex flex-col gap-1">
                  {renderNavLinks()}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-xl"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden md:inline-block">Prompt Copilot</span>
          </Link>
          <div className="ml-auto flex gap-2 items-center">
            {user ? (
              <>
                <div className="hidden md:block text-sm mr-2">
                  {user.email}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSignOut}
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserCircle className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <aside className="hidden w-60 flex-col border-r px-4 pt-8 md:flex">
          <nav className="flex flex-col gap-1">{renderNavLinks()}</nav>
        </aside>
        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
