
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Briefcase, 
  Home, 
  Search, 
  Settings, 
  Upload
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link to={to}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        size="lg"
        className={`w-full justify-start text-base mb-1 ${
          isActive 
            ? "bg-primary/10 text-primary hover:bg-primary/15" 
            : "hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </Button>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-60 h-full flex flex-col border-r border-slate-200 dark:border-slate-800 py-6 px-3">
        <div className="px-3 mb-8">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
            <BarChart3 className="inline-block mr-2 text-primary" size={24} />
            <span>Scorecard Genius</span>
          </h1>
        </div>
        
        <div className="space-y-1">
          <SidebarLink 
            to="/" 
            icon={<Home size={20} />} 
            label="Dashboard" 
            isActive={location.pathname === '/'} 
          />
          <SidebarLink 
            to="/startups" 
            icon={<Briefcase size={20} />} 
            label="Startups" 
            isActive={location.pathname === '/startups'} 
          />
          <SidebarLink 
            to="/search" 
            icon={<Search size={20} />} 
            label="Search" 
            isActive={location.pathname === '/search'} 
          />
          <SidebarLink 
            to="/upload" 
            icon={<Upload size={20} />} 
            label="Upload Data" 
            isActive={location.pathname === '/upload'} 
          />
          <SidebarLink 
            to="/settings" 
            icon={<Settings size={20} />} 
            label="Settings" 
            isActive={location.pathname === '/settings'} 
          />
        </div>
        
        <div className="mt-auto px-3">
          <div className="rounded-lg p-4 bg-slate-100 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Analyze startup data with AI-powered insights.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
