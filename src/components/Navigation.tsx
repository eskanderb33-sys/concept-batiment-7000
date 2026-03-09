import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Settings, 
  FileText, 
  PieChart,
  Plus,
  Bell,
  Search,
  LogOut,
  Construction,
  Receipt,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  Shield,
  Download,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { View, UserRole } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  role: UserRole;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, role, onLogout }) => {
  const adminItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'projects', label: 'Projets', icon: Construction },
    { id: 'quotes', label: 'Devis', icon: FileText },
    { id: 'invoices', label: 'Factures', icon: FileText },
    { id: 'suppliers', label: 'Fournisseurs', icon: Truck },
    { id: 'stock', label: 'Stock', icon: Package },
    { id: 'costs', label: 'Coûts', icon: DollarSign },
    { id: 'financial-report', label: 'Rapports', icon: PieChart },
    { id: 'profitability-report', label: 'Rentabilité', icon: TrendingUp },
    { id: 'roles-management', label: 'Rôles & Accès', icon: Shield },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'staff', label: 'Personnel', icon: FolderOpen },
    { id: 'tva-report', label: 'Rapport TVA', icon: PieChart },
    { id: 'company-settings', label: 'Paramètres', icon: Settings },
    { id: 'installation-guide', label: 'Installation', icon: Download },
    { id: 'update-notes', label: 'Nouveautés', icon: Sparkles },
  ];

  const clientItems = [
    { id: 'client-dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'client-quotes', label: 'Mes Devis', icon: FileText },
    { id: 'client-invoices', label: 'Mes Factures', icon: Receipt },
    { id: 'client-projects', label: 'Mon Projet', icon: Construction },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const navItems = role === 'admin' ? adminItems : clientItems;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-background-dark border-r border-primary/10 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-background-dark shadow-lg shadow-primary/20">
          <LayoutDashboard className="size-6" />
        </div>
        <div>
          <h1 className="text-xs font-medium text-primary uppercase tracking-widest">Concept 7000</h1>
          <p className="text-lg font-extrabold leading-none text-white">{role === 'admin' ? 'Admin' : 'Client'}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              currentView === item.id 
                ? "bg-primary text-background-dark font-bold shadow-lg shadow-primary/20" 
                : "text-slate-400 hover:text-primary hover:bg-primary/5"
            )}
          >
            <item.icon className={cn("size-5", currentView === item.id ? "text-background-dark" : "group-hover:text-primary")} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-primary/10">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <LogOut className="size-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export const BottomNav: React.FC<SidebarProps> = ({ currentView, onViewChange, role }) => {
  const adminItems = [
    { id: 'dashboard', label: 'Board', icon: LayoutDashboard },
    { id: 'projects', label: 'Projets', icon: Construction },
    { id: 'quotes', label: 'Devis', icon: FileText },
    { id: 'invoices', label: 'Factures', icon: FileText },
    { id: 'company-settings', label: 'Param', icon: Settings },
  ];

  const clientItems = [
    { id: 'client-dashboard', label: 'Board', icon: LayoutDashboard },
    { id: 'client-quotes', label: 'Devis', icon: FileText },
    { id: 'client-invoices', label: 'Factures', icon: Receipt },
    { id: 'client-projects', label: 'Projet', icon: Construction },
    { id: 'company-settings', label: 'Param', icon: Settings },
  ];

  const navItems = role === 'admin' ? adminItems : clientItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background-dark/95 backdrop-blur-md border-t border-primary/10 px-4 pb-6 pt-3">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              currentView === item.id ? "text-primary" : "text-slate-500"
            )}
          >
            <item.icon className={cn("size-6", currentView === item.id && "fill-primary/20")} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export const Header: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <header className="sticky top-0 z-30 bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-4 py-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 lg:hidden">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-background-dark">
            <LayoutDashboard className="size-5" />
          </div>
        </div>
        
        <div className="flex-1 lg:flex-none">
          <h1 className="text-xl font-extrabold text-white">{title}</h1>
          {subtitle && <p className="text-xs text-primary font-medium uppercase tracking-widest">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-surface-dark text-slate-400 hover:text-primary transition-colors">
            <Search className="size-5" />
          </button>
          <button className="p-2 rounded-full bg-surface-dark text-slate-400 hover:text-primary transition-colors relative">
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
          </button>
          <div className="size-10 rounded-full border-2 border-primary/50 overflow-hidden hidden sm:block">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" 
              alt="Profile" 
              className="size-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
