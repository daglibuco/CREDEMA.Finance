
export type Language = 'EN' | 'DE' | 'FR';

export enum View {
  LANDING = 'LANDING',
  ABOUT = 'ABOUT',
  FOUNDATIONS = 'FOUNDATIONS',
  DASHBOARD = 'DASHBOARD',
  OPPORTUNITY_DETAIL = 'OPPORTUNITY_DETAIL',
  REGISTER_STARTUP = 'REGISTER_STARTUP',
  RAG_SETUP = 'RAG_SETUP',
  BLOG = 'BLOG',
  DOCS = 'DOCS',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  RISK = 'RISK',
  ADMIN = 'ADMIN',
  FOUNDER_PORTAL = 'FOUNDER_PORTAL'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum WalletStatus {
  VERIFIED = 'VERIFIED',
  BREACH = 'BREACH', // Balance dropped below threshold
  PENDING = 'PENDING'
}

export type UserRole = 'FOUNDER' | 'SEED_INVESTOR' | 'LEVERAGE_PROVIDER' | 'ADMIN' | null;
export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type InvestmentStage = 'PRE_SEED' | 'SEED' | 'SERIES_A';
export type InstrumentType = 'SAFE' | 'CONVERTIBLE_NOTE' | 'PRICED_EQUITY';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  entityName: string;
  status: UserStatus;
  isLoggedIn: boolean;
}

export interface GrowthMetrics {
  cac: number; // Customer Acquisition Cost
  roas: number; // Return on Ad Spend
  monthlyAdSpend: number;
  conversionRate: number;
  // Series A+ Metrics
  arr?: number; // Annual Recurring Revenue
  nrr?: number; // Net Revenue Retention
  ltv?: number; // Lifetime Value
  yoyGrowth?: number; // Year over Year Growth
}

export interface ProductMetrics {
  // Early Stage Metrics
  burnRate?: number; // Monthly Burn
  runwayMonths?: number;
  waitlistSize?: number;
  teamSize?: number;
  
  // Technical
  githubCommits: number;
  roadmapCompletion: number;
  betaUsers: number;
}

// RAG Data Structure - The "Brain" of the startup
export interface StartupRAGContext {
  problem: string;
  solution: string;
  marketStrategy: string;
  competition: string;
  teamBackground: string;
  useOfFunds: string;
}

export interface LoanDeal {
  id: string;
  ownerId?: string; // Links to the Founder User ID
  companyName: string;
  tagline: string;
  location?: string; // Added location
  sector: string;
  stage: InvestmentStage;
  description: string;
  
  // Fundraising Data
  raisingAmount: number;
  instrument: InstrumentType;
  valuation: number; // Valuation Cap or Pre/Post Money
  valuationType: 'CAP' | 'PRE' | 'POST';
  minTicket: number;
  investorNote: string;
  
  // Leverage/Loan Data (Existing Model)
  leverageAmount: number;
  depositAmount: number; // 10-20% of leverage
  leverageMultiplier: number; // 5x - 10x
  termMonths: number; // Fixed at 24
  monthsElapsed: number;
  
  walletStatus: WalletStatus;
  walletAddress: string;
  lastOracleCheck: string;

  growthMetrics: GrowthMetrics;
  productMetrics: ProductMetrics; 
  
  // The RAG Data
  ragContext: StartupRAGContext;

  seedInvestorVerified: boolean; // "Gatekeeper" flag
  status: 'ACTIVE' | 'PENDING' | 'DEFAULT' | 'CONVERTED' | 'REJECTED'; // Added REJECTED
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'contract' | 'service' | 'client' | 'database';
  x: number;
  y: number;
}

export interface BlogPost {
  id: string;
  title: Record<Language, string>;
  excerpt: Record<Language, string>;
  content: Record<Language, string>; // Markdown-like string
  category: Record<Language, string>;
  readTime: Record<Language, string>;
  date: Record<Language, string>;
  author: {
    name: string;
    role: Record<Language, string>;
  };
  image: string;
}

export interface FoundationChapter {
  id: string;
  title: Record<Language, string>;
  content: {
    subtitle?: Record<Language, string>;
    text: Record<Language, string>;
    regionalNote?: Record<Language, string>; // For EU vs US/Asia context
  }[];
}
