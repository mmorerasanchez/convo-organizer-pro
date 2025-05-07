
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Lightbulb, 
  Menu, 
  UserCircle, 
  LogOut, 
  Wrench, 
  Sparkles, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  BarChart,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from '@/components/ui/sidebar';

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

  const activeModules = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Projects', path: '/projects' },
    { icon: Wrench, label: 'Tools', path: '/tools' },
    { icon: Lightbulb, label: 'Prompting', path: '/prompting' },
  ];

  const comingSoonModules = [
    { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
    { icon: BarChart, label: 'Metrics', path: '/metrics' },
    { icon: LineChart, label: 'Roadmap', path: '/roadmap' },
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

  const renderSidebarLinks = (items: typeof activeModules, disabled = false) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton 
            asChild 
            isActive={isActive(item.path)}
            tooltip={item.label}
            className={cn(disabled && "opacity-50 pointer-events-none")}
            aria-disabled={disabled}
          >
            <Link to={disabled ? "#" : item.path}>
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col">
        <div className="border-b">
          <div className="flex h-14 items-center px-4 sm:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="mr-4 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle mobile navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 sm:max-w-xs pr-0">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to="/"
                      className="text-xl font-mono font-bold tracking-tight"
                      onClick={() => setOpen(false)}
                    >
                      promptito
                    </Link>
                    <div>
                      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs px-2 py-0.5 rounded-md font-mono flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        BETA made with AI
                      </Badge>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-4">
                    <div>
                      <h3 className="mb-1 px-2 text-sm font-medium">Active modules</h3>
                      <div className="flex flex-col gap-1">
                        {activeModules.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all font-mono',
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
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-1 px-2 text-sm font-medium text-muted-foreground">Coming soon</h3>
                      <div className="flex flex-col gap-1">
                        {comingSoonModules.map((item) => (
                          <div
                            key={item.path}
                            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all font-mono text-muted-foreground opacity-60 cursor-not-allowed"
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link
              to="/"
              className="flex items-center gap-2 font-mono text-lg font-bold md:text-xl tracking-tighter"
            >
              <span>promptito</span>
              <div>
                <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs px-1.5 py-0.5 rounded-md font-mono flex items-center">
                  <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                  BETA made with AI
                </Badge>
              </div>
            </Link>
            <div className="ml-auto flex gap-2 items-center">
              {user ? (
                <>
                  <div className="hidden md:block text-sm text-muted-foreground font-mono mr-2">
                    {user.email}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSignOut}
                    title="Sign out"
                    className="h-8 w-8"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-1.5 h-8 font-mono">
                    <UserCircle className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-1">
          <Sidebar collapsible="icon" className="z-10">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Active modules</SidebarGroupLabel>
                <SidebarGroupContent>
                  {renderSidebarLinks(activeModules)}
                </SidebarGroupContent>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Coming soon</SidebarGroupLabel>
                <SidebarGroupContent>
                  {renderSidebarLinks(comingSoonModules, true)}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="border-t py-4">
              <div className="flex items-center justify-center">
                <SidebarTrigger />
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <main className="flex-1 px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
