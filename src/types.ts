export type UserRole = 'admin' | 'client';

export type View = 
  | 'dashboard' 
  | 'staff' 
  | 'staff-edit' 
  | 'clients' 
  | 'client-add' 
  | 'invoices' 
  | 'invoice-detail'
  | 'invoice-create' 
  | 'payment-record'
  | 'quotes' 
  | 'quote-detail'
  | 'quote-create' 
  | 'tva-report' 
  | 'projects'
  | 'project-details'
  | 'project-create'
  | 'project-timeline'
  | 'project-timeline-pdf'
  | 'project-whatsapp'
  | 'suppliers'
  | 'supplier-add'
  | 'stock'
  | 'costs'
  | 'financial-report'
  | 'profitability-report'
  | 'roles-management'
  | 'roles-project-access'
  | 'company-settings'
  | 'app-launch'
  | 'installation-guide'
  | 'update-notes'
  | 'login'
  | 'client-login'
  | 'client-dashboard'
  | 'client-quotes'
  | 'client-invoices'
  | 'client-projects';

export interface StaffMember {
  id: string;
  nom: string;
  role: string;
  specialization: string;
  phone: string;
  email: string;
  status: 'active' | 'on-leave' | 'inactive';
  salary: number;
  photoUrl: string;
}

export interface Client {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  numero: string;
  client_id: string;
  client?: Client;
  date_facture: string;
  date_echeance: string;
  total_ttc: number;
  sous_total: number;
  tva: number;
  statut_paiement: 'paid' | 'unpaid' | 'partial';
  lignes: InvoiceItem[];
  paiements?: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: 'cash' | 'transfer' | 'check';
  reference?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  numero: string;
  client_id: string;
  client?: Client;
  date_devis: string;
  date_expiration?: string;
  statut: 'draft' | 'sent' | 'accepted' | 'refused' | 'expired';
  total_ttc: number;
  sous_total: number;
  tva: number;
  lignes: InvoiceItem[];
}

export interface Project {
  id: string;
  nom: string;
  reference: string;
  client_id: string;
  client?: Client;
  statut: 'execution' | 'design' | 'completed';
  progression: number;
  budget: number;
  billed: number;
  date_debut?: string;
  description?: string;
  milestones: Milestone[];
  gallery: string[];
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialty: string;
  address?: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  lastRestock?: string;
}

export interface ProjectCost {
  id: string;
  projectId: string;
  projectName: string;
  category: 'materials' | 'labor' | 'equipment' | 'other';
  description: string;
  amount: number;
  date: string;
  supplierId?: string;
}

export interface TeamMemberRole {
  id: string;
  staffId: string;
  staffName: string;
  role: 'admin' | 'manager' | 'architect' | 'accountant' | 'foreman';
  permissions: string[];
  projectAccess: string[]; // List of project IDs
}

export interface FinancialData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ProjectProfitability {
  projectId: string;
  projectName: string;
  revenue: number;
  costs: number;
  margin: number;
  marginPercentage: number;
}

export interface CompanySettings {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: string;
  website?: string;
}

export interface UpdateNote {
  version: string;
  date: string;
  changes: string[];
}
