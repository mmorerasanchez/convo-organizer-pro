
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, Grid, MessageCircle, Plus, Search, Settings, Type, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NewProjectDialog from '@/components/projects/NewProjectDialog';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: <Grid size={20} />, text: 'Dashboard', href: '/' },
    { icon: <BookOpen size={20} />, text: 'Projects', href: '/projects' },
    { icon: <MessageCircle size={20} />, text: 'Conversations', href: '/conversations' },
    { icon: <Type size={20} />, text: 'Prompting', href: '/prompting' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h1 className="font-bold text-lg">Convo Organizer</h1>
          </Link>
        </div>
        
        <div className="p-4">
          <NewProjectDialog 
            variant="outline" 
            trigger={
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus size={16} />
                New Project
              </Button>
            }
          />
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                location.pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t mt-auto">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4 bg-card">
          <div className="md:hidden flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h1 className="font-bold">Convo Organizer</h1>
          </div>
          
          <div className="hidden md:flex max-w-md w-full relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations, projects..." 
              className="pl-8"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search />
            </Button>
            <Button variant="ghost" size="icon">
              <User />
            </Button>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
