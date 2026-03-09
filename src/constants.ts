import { StaffMember, Client, Invoice, Quote, Project, Supplier, StockItem, ProjectCost, FinancialData, ProjectProfitability, TeamMemberRole, CompanySettings, UpdateNote } from './types';

export const MOCK_STAFF: StaffMember[] = [
  {
    id: '1',
    nom: 'Jean Dupont',
    role: 'Architecte Senior',
    specialization: 'Structure Béton',
    phone: '+216 22 123 456',
    email: 'jean.dupont@concept7000.fr',
    status: 'active',
    salary: 2850,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '2',
    nom: 'Sarah Mansour',
    role: "Designer d'Intérieur",
    specialization: 'Luxe & Résidentiel',
    phone: '+216 55 987 654',
    email: 'sarah.mansour@concept7000.fr',
    status: 'on-leave',
    salary: 2400,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '3',
    nom: 'Ahmed Ben Ali',
    role: 'Chef de Chantier',
    specialization: 'Gros Œuvre',
    phone: '+216 50 111 222',
    email: 'ahmed.benali@concept7000.fr',
    status: 'active',
    salary: 2100,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

export const MOCK_CLIENTS: Client[] = [
  { id: '1', nom: 'Ahmed Mansour', telephone: '+216 22 123 456', email: 'ahmed@email.com', adresse: 'Tunis' },
  { id: '2', nom: 'Sonia Ben Salem', telephone: '+216 55 987 654', email: 'sonia@email.com', adresse: 'Sfax' },
  { id: '3', nom: 'Youssef Khelifi', telephone: '+216 98 456 789', email: 'youssef@email.com', adresse: 'Sousse' }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    numero: 'FACT-2024-001',
    client_id: '1',
    date_facture: '12 Jan 2024',
    date_echeance: '12 Feb 2024',
    total_ttc: 1250,
    sous_total: 1050,
    tva: 200,
    statut_paiement: 'paid',
    lignes: []
  },
  {
    id: '2',
    numero: 'FACT-2024-002',
    client_id: '2',
    date_facture: '15 Jan 2024',
    date_echeance: '15 Feb 2024',
    total_ttc: 3420.5,
    sous_total: 2874,
    tva: 546.5,
    statut_paiement: 'unpaid',
    lignes: []
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    nom: 'Villa Carthage - Salon & Suite',
    reference: 'CB-7000-2023',
    client_id: '1',
    statut: 'execution',
    progression: 75,
    budget: 450000,
    billed: 292500,
    milestones: [
      { id: '1', title: 'Design & Planification', date: '12 Mars 2023', status: 'completed' },
      { id: '2', title: 'Exécution - Structure', date: '25 Août 2023', status: 'in-progress' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

export const MOCK_QUOTES: Quote[] = [
  {
    id: '1',
    numero: 'DEV-2024-001',
    client_id: 'c1',
    date_devis: '2024-03-01',
    date_expiration: '2024-04-01',
    statut: 'accepted',
    total_ttc: 12500,
    sous_total: 10500,
    tva: 2000,
    lignes: []
  },
  {
    id: '2',
    numero: 'DEV-2024-002',
    client_id: 'c2',
    date_devis: '2024-03-05',
    date_expiration: '2024-04-05',
    statut: 'sent',
    total_ttc: 8400,
    sous_total: 7058,
    tva: 1342,
    lignes: []
  },
  {
    id: '3',
    numero: 'DEV-2024-003',
    client_id: 'c3',
    date_devis: '2024-03-10',
    date_expiration: '2024-04-10',
    statut: 'draft',
    total_ttc: 45000,
    sous_total: 37815,
    tva: 7185,
    lignes: []
  },
  {
    id: '4',
    numero: 'DEV-2024-004',
    client_id: 'c4',
    date_devis: '2024-02-15',
    date_expiration: '2024-03-15',
    statut: 'expired',
    total_ttc: 3200,
    sous_total: 2689,
    tva: 511,
    lignes: []
  },
  {
    id: '5',
    numero: 'DEV-2024-005',
    client_id: 'c5',
    date_devis: '2024-03-12',
    date_expiration: '2024-04-12',
    statut: 'refused',
    total_ttc: 15600,
    sous_total: 13109,
    tva: 2491,
    lignes: []
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'BatiPro S.A.', phone: '+216 71 123 456', email: 'contact@batipro.tn', specialty: 'Gros Œuvre' },
  { id: '2', name: 'LuxDecor', phone: '+216 71 987 654', email: 'info@luxdecor.tn', specialty: 'Finition & Déco' },
  { id: '3', name: 'ElecTunisie', phone: '+216 71 456 789', email: 'sales@electunisie.tn', specialty: 'Électricité' }
];

export const MOCK_STOCK: StockItem[] = [
  { id: '1', name: 'Ciment Portland', category: 'Matériaux', quantity: 150, unit: 'Sacs', minQuantity: 50, lastRestock: '2024-02-15' },
  { id: '2', name: 'Peinture Blanche 20L', category: 'Finition', quantity: 12, unit: 'Seaux', minQuantity: 20, lastRestock: '2024-01-10' },
  { id: '3', name: 'Câble Électrique 2.5mm', category: 'Électricité', quantity: 500, unit: 'Mètres', minQuantity: 200, lastRestock: '2024-03-01' }
];

export const MOCK_COSTS: ProjectCost[] = [
  { id: '1', projectId: '1', projectName: 'Villa Carthage', category: 'materials', description: 'Achat Ciment', amount: 1200, date: '2024-03-05', supplierId: '1' },
  { id: '2', projectId: '1', projectName: 'Villa Carthage', category: 'labor', description: 'Main d\'œuvre semaine 10', amount: 3500, date: '2024-03-08' }
];

export const MOCK_FINANCIAL_DATA: FinancialData[] = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Fév', revenue: 52000, expenses: 38000, profit: 14000 },
  { month: 'Mar', revenue: 61000, expenses: 42000, profit: 19000 },
  { month: 'Avr', revenue: 58000, expenses: 40000, profit: 18000 },
  { month: 'Mai', revenue: 72000, expenses: 48000, profit: 24000 },
  { month: 'Juin', revenue: 85000, expenses: 55000, profit: 30000 },
];

export const MOCK_PROFITABILITY: ProjectProfitability[] = [
  { projectId: '1', projectName: 'Villa Carthage', revenue: 450000, costs: 320000, margin: 130000, marginPercentage: 28.8 },
  { projectId: '2', projectName: 'Appartement Gammarth', revenue: 120000, costs: 85000, margin: 35000, marginPercentage: 29.1 },
  { projectId: '3', projectName: 'Bureaux Lac 2', revenue: 850000, costs: 680000, margin: 170000, marginPercentage: 20.0 },
];

export const MOCK_ROLES: TeamMemberRole[] = [
  {
    id: '1',
    staffId: '1',
    staffName: 'Jean Dupont',
    role: 'admin',
    permissions: ['all'],
    projectAccess: ['*']
  },
  {
    id: '2',
    staffId: '2',
    staffName: 'Sarah Mansour',
    role: 'architect',
    permissions: ['read_projects', 'edit_projects', 'read_quotes'],
    projectAccess: ['1', '2']
  },
  {
    id: '3',
    staffId: '3',
    staffName: 'Ahmed Ben Ali',
    role: 'foreman',
    permissions: ['read_projects', 'update_progress'],
    projectAccess: ['1']
  }
];

export const MOCK_COMPANY_SETTINGS: CompanySettings = {
  name: 'Concept 7000 Architecture',
  logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=200&h=200',
  address: '123 Avenue Habib Bourguiba, Tunis, Tunisie',
  phone: '+216 71 123 456',
  email: 'contact@concept7000.tn',
  taxNumber: '1234567/A/M/000',
  website: 'www.concept7000.tn'
};

export const MOCK_UPDATE_NOTES: UpdateNote[] = [
  {
    version: '2.1.0',
    date: '2024-03-09',
    changes: [
      'Nouveau module de gestion des rôles et permissions',
      'Rapports financiers détaillés avec graphiques',
      'Analyse de rentabilité par projet',
      'Amélioration de la gestion des stocks et alertes'
    ]
  },
  {
    version: '2.0.0',
    date: '2024-02-15',
    changes: [
      'Interface client (Portail Client)',
      'Suivi des projets en temps réel',
      'Gestion des devis et factures en ligne',
      'Nouveau design mode sombre'
    ]
  }
];
