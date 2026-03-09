import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';
import { View } from './types';
import { Sidebar, BottomNav, Header } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { StaffList } from './components/StaffList';
import { StaffEdit } from './components/StaffEdit';
import { ClientList } from './components/ClientList';
import { ClientAdd } from './components/ClientAdd';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceCreate } from './components/InvoiceCreate';
import { QuoteCreate } from './components/QuoteCreate';
import { TVAReport } from './components/TVAReport';
import { ProjectDetails } from './components/ProjectDetails';
import { ProjectList } from './components/ProjectList';
import { ProjectCreate } from './components/ProjectCreate';
import { ProjectTimeline } from './components/ProjectTimeline';
import { ProjectTimelinePDF } from './components/ProjectTimelinePDF';
import { ProjectWhatsApp } from './components/ProjectWhatsApp';
import { Login } from './components/Login';
import { QuoteList } from './components/QuoteList';
import { QuoteDetail } from './components/QuoteDetail';
import { InvoiceDetail } from './components/InvoiceDetail';
import { PaymentRecord } from './components/PaymentRecord';
import { SupplierList } from './components/SupplierList';
import { SupplierAdd } from './components/SupplierAdd';
import { StockManagement } from './components/StockManagement';
import { CostManagement } from './components/CostManagement';
import { FinancialReport } from './components/FinancialReport';
import { ProfitabilityReport } from './components/ProfitabilityReport';
import { RolesManagement } from './components/RolesManagement';
import { RolesProjectAccess } from './components/RolesProjectAccess';
import { CompanySettings } from './components/CompanySettings';
import { AppLaunchScreen } from './components/AppLaunchScreen';
import { InstallationGuide } from './components/InstallationGuide';
import { UpdateNotes } from './components/UpdateNotes';
import { ClientLogin } from './components/client-portal/ClientLogin';
import { ClientDashboard } from './components/client-portal/ClientDashboard';
import { ClientQuoteList } from './components/client-portal/ClientQuoteList';
import { ClientInvoiceList } from './components/client-portal/ClientInvoiceList';
import { ClientProjectView } from './components/client-portal/ClientProjectView';
import { InstallBanner } from './components/InstallBanner';
import { UserRole, Quote, Invoice, Project, TeamMemberRole } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [expiryTimeLeft, setExpiryTimeLeft] = useState(300); // 5 minutes in seconds
  const [lastActivity, setLastActivity] = useState(Date.now());

  const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
  const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMemberRole | null>(null);
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);

  useEffect(() => {
    // Activity tracking
    const updateActivity = () => {
      const now = Date.now();
      setLastActivity(now);
      localStorage.setItem('last_activity', now.toString());
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUserRole('admin');
        updateActivity();
        if (currentView === 'login' || currentView === 'client-login') {
          setCurrentView('dashboard');
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setUserRole('admin');
        updateActivity();
        if (currentView === 'login' || currentView === 'client-login') {
          setCurrentView('dashboard');
        }
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, []);

  // Session expiry timer
  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') return;

    const interval = setInterval(() => {
      const now = Date.now();
      const storedActivity = localStorage.getItem('last_activity');
      const activity = storedActivity ? parseInt(storedActivity, 10) : lastActivity;
      const elapsed = now - activity;
      
      const remaining = SESSION_DURATION - elapsed;

      if (remaining <= 0) {
        handleLogout();
        alert('Votre session a expiré après 8 heures d\'inactivité.');
      } else if (remaining <= WARNING_THRESHOLD) {
        setShowExpiryWarning(true);
        setExpiryTimeLeft(Math.ceil(remaining / 1000));
      } else {
        setShowExpiryWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn, userRole, lastActivity]);

  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentView(role === 'admin' ? 'dashboard' : 'client-dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setShowExpiryWarning(false);
    localStorage.removeItem('last_activity');
    setCurrentView(userRole === 'admin' ? 'login' : 'client-login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'staff':
        return <StaffList onViewChange={setCurrentView} />;
      case 'staff-edit':
        return <StaffEdit onCancel={() => setCurrentView('staff')} />;
      case 'clients':
        return <ClientList onViewChange={setCurrentView} />;
      case 'client-add':
        return <ClientAdd onCancel={() => setCurrentView('clients')} />;
      case 'invoices':
        return (
          <InvoiceList 
            onViewChange={setCurrentView} 
            onSelectInvoice={(invoice) => {
              setSelectedInvoice(invoice);
              setCurrentView('invoice-detail');
            }} 
          />
        );
      case 'invoice-detail':
        return selectedInvoice ? (
          <InvoiceDetail 
            invoice={selectedInvoice} 
            onBack={() => setCurrentView('invoices')} 
            onRecordPayment={() => setCurrentView('payment-record')}
          />
        ) : null;
      case 'invoice-create':
        return <InvoiceCreate onCancel={() => setCurrentView('invoices')} />;
      case 'payment-record':
        return selectedInvoice ? (
          <PaymentRecord 
            invoice={selectedInvoice} 
            onBack={() => setCurrentView('invoice-detail')}
            onSave={(payment) => {
              // In a real app, we would update the invoice state here
              console.log('Payment recorded:', payment);
              setCurrentView('invoice-detail');
            }}
          />
        ) : null;
      case 'quotes':
        return (
          <QuoteList 
            onViewChange={setCurrentView} 
            onSelectQuote={(quote) => {
              setSelectedQuote(quote);
              setCurrentView('quote-detail');
            }} 
          />
        );
      case 'quote-detail':
        return selectedQuote ? (
          <QuoteDetail 
            quote={selectedQuote} 
            onBack={() => setCurrentView('quotes')} 
          />
        ) : null;
      case 'quote-create':
        return <QuoteCreate onCancel={() => setCurrentView('quotes')} />;
      case 'tva-report':
        return <TVAReport />;
      case 'projects':
        return (
          <ProjectList 
            onViewChange={setCurrentView} 
            onSelectProject={(project) => {
              setSelectedProject(project);
              setCurrentView('project-timeline');
            }} 
          />
        );
      case 'project-create':
        return (
          <ProjectCreate 
            onCancel={() => setCurrentView('projects')} 
            onSave={(project) => {
              console.log('Project created:', project);
              setCurrentView('projects');
            }}
          />
        );
      case 'project-timeline':
        return selectedProject ? (
          <ProjectTimeline 
            project={selectedProject} 
            onBack={() => setCurrentView('projects')}
            onExportPDF={() => setCurrentView('project-timeline-pdf')}
            onShareWhatsApp={() => setCurrentView('project-whatsapp')}
          />
        ) : null;
      case 'project-timeline-pdf':
        return selectedProject ? (
          <ProjectTimelinePDF 
            project={selectedProject} 
            onBack={() => setCurrentView('project-timeline')}
          />
        ) : null;
      case 'project-whatsapp':
        return selectedProject ? (
          <ProjectWhatsApp 
            project={selectedProject} 
            onBack={() => setCurrentView('project-timeline')}
          />
        ) : null;
      case 'project-details':
        return <ProjectDetails />;
      case 'suppliers':
        return <SupplierList onViewChange={setCurrentView} />;
      case 'supplier-add':
        return <SupplierAdd onBack={() => setCurrentView('suppliers')} />;
      case 'stock':
        return <StockManagement />;
      case 'costs':
        return <CostManagement />;
      case 'financial-report':
        return <FinancialReport />;
      case 'profitability-report':
        return <ProfitabilityReport />;
      case 'roles-management':
        return <RolesManagement onViewChange={setCurrentView} onSelectMember={setSelectedTeamMember} />;
      case 'roles-project-access':
        return selectedTeamMember ? (
          <RolesProjectAccess member={selectedTeamMember} onBack={() => setCurrentView('roles-management')} />
        ) : null;
      case 'company-settings':
        return <CompanySettings />;
      case 'installation-guide':
        return <InstallationGuide />;
      case 'update-notes':
        return <UpdateNotes onBack={() => setCurrentView('dashboard')} />;
      case 'login':
        return <Login onLogin={() => handleLogin('admin')} onSwitchToClient={() => setCurrentView('client-login')} />;
      case 'client-login':
        return <ClientLogin onLogin={() => handleLogin('client')} onSwitchToAdmin={() => setCurrentView('login')} />;
      case 'client-dashboard':
        return <ClientDashboard onViewChange={setCurrentView} />;
      case 'client-quotes':
        return <ClientQuoteList />;
      case 'client-invoices':
        return <ClientInvoiceList />;
      case 'client-projects':
        return <ClientProjectView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <p className="text-lg font-medium">Vue "{currentView}" en cours de développement</p>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="mt-4 text-primary hover:underline font-bold"
            >
              Retour au tableau de bord
            </button>
          </div>
        );
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Tableau de Bord';
      case 'staff': return 'Gestion du Personnel';
      case 'staff-edit': return 'Ajouter/Modifier Personnel';
      case 'clients': return 'Liste des Clients';
      case 'client-add': return 'Ajouter un Client';
      case 'invoices': return 'Factures';
      case 'invoice-detail': return 'Détails de la Facture';
      case 'invoice-create': return 'Créer une facture';
      case 'payment-record': return 'Enregistrer un paiement';
      case 'quotes': return 'Liste des Devis';
      case 'quote-detail': return 'Détails du Devis';
      case 'quote-create': return 'Créer un devis';
      case 'tva-report': return 'Rapport de TVA';
      case 'projects': return 'Gestion des Projets';
      case 'project-create': return 'Nouveau Projet';
      case 'project-timeline': return 'Timeline du Projet';
      case 'project-timeline-pdf': return 'Export PDF Timeline';
      case 'project-whatsapp': return 'Partage WhatsApp';
      case 'project-details': return 'Détails du Projet';
      case 'suppliers': return 'Gestion des Fournisseurs';
      case 'supplier-add': return 'Nouveau Fournisseur';
      case 'stock': return 'Gestion du Stock';
      case 'costs': return 'Suivi des Coûts';
      case 'financial-report': return 'Rapport Financier';
      case 'profitability-report': return 'Rentabilité par Projet';
      case 'roles-management': return 'Gestion des Rôles';
      case 'roles-project-access': return 'Accès Projets';
      case 'company-settings': return 'Paramètres Entreprise';
      case 'installation-guide': return 'Guide d\'Installation';
      case 'update-notes': return 'Notes de Mise à Jour';
      case 'client-dashboard': return 'Tableau de Bord Client';
      case 'client-quotes': return 'Mes Devis';
      case 'client-invoices': return 'Mes Factures';
      case 'client-projects': return 'Mon Projet';
      default: return 'Concept Bâtiment 7000';
    }
  };

  if (showLaunchScreen) {
    return <AppLaunchScreen onComplete={() => setShowLaunchScreen(false)} />;
  }

  if (!isLoggedIn) {
    if (currentView === 'client-login') {
      return <ClientLogin onLogin={() => handleLogin('client')} onSwitchToAdmin={() => setCurrentView('login')} />;
    }
    return <Login onLogin={() => handleLogin('admin')} onSwitchToClient={() => setCurrentView('client-login')} />;
  }

  return (
    <div className="flex min-h-screen bg-background-dark text-slate-100 font-display selection:bg-primary/30">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} role={userRole} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header title={getViewTitle()} subtitle={userRole === 'admin' ? "Administration" : "Espace Client"} />
        
        <main className="flex-1 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        <BottomNav currentView={currentView} onViewChange={setCurrentView} role={userRole} onLogout={handleLogout} />
      </div>

      <InstallBanner />

      {/* Background Glows */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
      </div>
    </div>
  );
}
