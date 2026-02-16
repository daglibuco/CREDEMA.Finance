
import { User, LoanDeal, BlogPost } from '../types';
import { MOCK_USERS, MOCK_DEALS, BLOG_POSTS } from '../constants';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://uucixshqumweotivolpn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Y2l4c2hxdW13ZW90aXZvbHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MTkxNDMsImV4cCI6MjA4NTI5NTE0M30.IXgx3qwzGpnoLj3FDPWLzMw4PprXp5EB9LblZj6ujik';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * StorageService acts as the bridge between the App and the Database.
 */
export const StorageService = {
  
  // --- USER MANAGEMENT ---
  
  fetchUsers: async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      
      if (error) {
        return getLocalUsers();
      }

      if (!data || data.length === 0) {
         await supabase.from('users').insert(MOCK_USERS.map(u => ({
             id: u.id,
             email: u.email,
             name: u.name,
             role: u.role,
             entity_name: u.entityName,
             status: u.status
         })));
         return MOCK_USERS;
      }

      const users = data.map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        entityName: u.entity_name,
        status: u.status,
        isLoggedIn: false
      }));

      localStorage.setItem('credema_users_v1', JSON.stringify(users));
      return users;
    } catch (e) {
      return getLocalUsers();
    }
  },

  createUser: async (user: User): Promise<User[]> => {
    const dbUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      entity_name: user.entityName,
      status: user.status
    };

    await supabase.from('users').insert([dbUser]);
    return StorageService.fetchUsers();
  },

  updateUser: async (user: User): Promise<User[]> => {
    await supabase
      .from('users')
      .update({ 
        name: user.name,
        email: user.email,
        entity_name: user.entityName,
        role: user.role,
        status: user.status 
      })
      .eq('id', user.id);

    return StorageService.fetchUsers();
  },

  deleteUser: async (userId: string): Promise<User[]> => {
    const localUsers = getLocalUsers();
    const updatedLocal = localUsers.filter(u => u.id !== userId);
    localStorage.setItem('credema_users_v1', JSON.stringify(updatedLocal));

    try {
      await supabase.from('users').delete().eq('id', userId);
    } catch (e) {
      console.warn("Cloud deletion failed, but local state is purged.", e);
    }

    return updatedLocal;
  },

  // --- DEAL/LOAN MANAGEMENT ---

  fetchDeals: async (): Promise<LoanDeal[]> => {
    try {
      const { data, error } = await supabase.from('deals').select('*');
      
      if (error) {
        return getLocalDeals();
      }
      
      if (!data || data.length === 0) {
          const formattedDeals = MOCK_DEALS.map(d => ({
             id: d.id,
             owner_id: d.ownerId,
             company_name: d.companyName,
             tagline: d.tagline,
             sector: d.sector,
             stage: d.stage,
             description: d.description,
             raising_amount: d.raisingAmount,
             instrument: d.instrument,
             valuation: d.valuation,
             valuation_type: d.valuationType,
             min_ticket: d.minTicket,
             investor_note: d.investorNote,
             leverage_amount: d.leverageAmount,
             deposit_amount: d.depositAmount,
             leverage_multiplier: d.leverageMultiplier,
             term_months: d.termMonths,
             months_elapsed: d.monthsElapsed,
             wallet_status: d.walletStatus,
             wallet_address: d.walletAddress,
             last_oracle_check: d.lastOracleCheck,
             seed_investor_verified: d.seedInvestorVerified,
             status: d.status,
             growth_metrics: d.growthMetrics,
             product_metrics: d.productMetrics,
             rag_context: d.ragContext
          }));
          
          await supabase.from('deals').insert(formattedDeals);
          return MOCK_DEALS;
      }

      const deals = data.map((d: any) => ({
        id: d.id,
        ownerId: d.owner_id,
        companyName: d.company_name,
        tagline: d.tagline,
        sector: d.sector,
        stage: d.stage,
        description: d.description,
        raisingAmount: d.raising_amount,
        instrument: d.instrument,
        valuation: d.valuation,
        valuationType: d.valuation_type,
        minTicket: d.min_ticket,
        investorNote: d.investor_note,
        leverageAmount: d.leverage_amount,
        depositAmount: d.deposit_amount,
        leverageMultiplier: d.leverage_multiplier,
        termMonths: d.term_months,
        monthsElapsed: d.months_elapsed,
        walletStatus: d.wallet_status,
        walletAddress: d.wallet_address,
        last_oracle_check: d.last_oracle_check,
        seedInvestorVerified: d.seed_investor_verified,
        status: d.status,
        growthMetrics: d.growth_metrics,
        productMetrics: d.product_metrics,
        ragContext: d.rag_context
      }));

      localStorage.setItem('credema_deals_v1', JSON.stringify(deals));
      return deals;
    } catch (e) {
      return getLocalDeals();
    }
  },

  updateDeal: async (deal: LoanDeal): Promise<LoanDeal[]> => {
    const dbDeal = {
       company_name: deal.companyName,
       tagline: deal.tagline,
       sector: deal.sector,
       stage: deal.stage,
       raising_amount: deal.raisingAmount,
       instrument: deal.instrument,
       valuation: deal.valuation,
       status: deal.status,
       rag_context: deal.ragContext,
       deposit_amount: deal.depositAmount,
       leverage_multiplier: deal.leverageMultiplier,
       leverage_amount: deal.leverageAmount,
       seed_investor_verified: deal.seedInvestorVerified,
       investor_note: deal.investorNote
                  last_oracle_check: deal.lastOracleCheck
    };

    await supabase.from('deals').update(dbDeal).eq('id', deal.id);
    return StorageService.fetchDeals();
  },

  deleteDeal: async (dealId: string): Promise<LoanDeal[]> => {
    const localDeals = getLocalDeals();
    const updatedLocal = localDeals.filter(d => d.id !== dealId);
    localStorage.setItem('credema_deals_v1', JSON.stringify(updatedLocal));

    try {
      await supabase.from('deals').delete().eq('id', dealId);
    } catch (e) {
      console.warn("Cloud deal deletion failed.", e);
    }

    return updatedLocal;
  },

  // --- BLOG MANAGEMENT ---

  fetchBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      const { data, error } = await supabase.from('blog_posts').select('*');
      if (error || !data || data.length === 0) {
        return getLocalBlogPosts();
      }
      const blogs = data.map((b: any) => ({
        id: b.id,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        category: b.category,
        readTime: b.read_time,
        date: b.date,
        author: b.author,
        image: b.image
      }));
      localStorage.setItem('credema_blog_v1', JSON.stringify(blogs));
      return blogs;
    } catch (e) {
      return getLocalBlogPosts();
    }
  },

  updateBlogPost: async (post: BlogPost): Promise<BlogPost[]> => {
    const dbPost = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      read_time: post.readTime,
      date: post.date,
      author: post.author,
      image: post.image
    };
    await supabase.from('blog_posts').update(dbPost).eq('id', post.id);
    return StorageService.fetchBlogPosts();
  },

  createBlogPost: async (post: BlogPost): Promise<BlogPost[]> => {
    const dbPost = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      read_time: post.readTime,
      date: post.date,
      author: post.author,
      image: post.image
    };
    await supabase.from('blog_posts').insert([dbPost]);
    return StorageService.fetchBlogPosts();
  },

  deleteBlogPost: async (id: string): Promise<BlogPost[]> => {
    const local = getLocalBlogPosts();
    const updated = local.filter(b => b.id !== id);
    localStorage.setItem('credema_blog_v1', JSON.stringify(updated));
    try {
      await supabase.from('blog_posts').delete().eq('id', id);
    } catch (e) {
      console.warn("Cloud blog deletion failed.", e);
    }
    return updated;
  },

  // --- SESSION ---

  getSession: (): User | null => {
    try {
      const stored = localStorage.getItem('credema_session_v1');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  setSession: (user: User | null): void => {
    if (user) {
      localStorage.setItem('credema_session_v1', JSON.stringify({ ...user, isLoggedIn: true }));
    } else {
      localStorage.removeItem('credema_session_v1');
    }
  }
};

function getLocalUsers(): User[] {
  try {
    const s = localStorage.getItem('credema_users_v1');
    if (!s) {
       localStorage.setItem('credema_users_v1', JSON.stringify(MOCK_USERS));
       return MOCK_USERS;
    }
    return JSON.parse(s);
  } catch (e) { return MOCK_USERS; }
}

function getLocalDeals(): LoanDeal[] {
  try {
    const s = localStorage.getItem('credema_deals_v1');
    if (!s) {
       localStorage.setItem('credema_deals_v1', JSON.stringify(MOCK_DEALS));
       return MOCK_DEALS;
    }
    return JSON.parse(s);
  } catch (e) { return MOCK_DEALS; }
}

function getLocalBlogPosts(): BlogPost[] {
  try {
    const s = localStorage.getItem('credema_blog_v1');
    if (!s) {
      localStorage.setItem('credema_blog_v1', JSON.stringify(BLOG_POSTS));
      return BLOG_POSTS;
    }
    return JSON.parse(s);
  } catch (e) { return BLOG_POSTS; }
}
