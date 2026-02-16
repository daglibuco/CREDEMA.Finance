
import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LeverageDashboard } from './components/LeverageDashboard';
import { TechnicalDocs } from './components/TechnicalDocs';
import { Navigation } from './components/Navigation';
import { LegalPage } from './components/LegalPage';
import { BlogPage } from './components/BlogPage';
import { FoundationsPage } from './components/FoundationsPage';
import { OpportunityDetail } from './components/OpportunityDetail';
import { AIChatBot } from './components/AIChatBot';
import { RAGQuestionnaire } from './components/RAGQuestionnaire';
import { AdminDashboard } from './components/AdminDashboard';
import { FounderPortal } from './components/FounderPortal';
import { AboutUsPage } from './components/AboutUsPage';
import { StartupRegistration } from './components/StartupRegistration';
import { Language, View, User, LoanDeal, BlogPost, StartupRAGContext, WalletStatus } from './types';
import { StorageService } from './utils/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [language, setLanguage] = useState<Language>('EN');
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [deals, setDeals] = useState<LoanDeal[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [user, setUser] = useState<User>({
    id: '',
    email: '',
    name: '',
    role: null,
    entityName: '',
    status: 'PENDING',
    isLoggedIn: false
  });
  
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const selectedOpportunity = deals.find(d => d.id === selectedOpportunityId) || null;

  const fetchData = async () => {
    try {
      const [fetchedUsers, fetchedDeals, fetchedBlogs] = await Promise.all([
        StorageService.fetchUsers(),
        StorageService.fetchDeals(),
        StorageService.fetchBlogPosts()
      ]);
      
      setAllUsers(prev => JSON.stringify(prev) !== JSON.stringify(fetchedUsers) ? fetchedUsers : prev);
      setDeals(prev => JSON.stringify(prev) !== JSON.stringify(fetchedDeals) ? fetchedDeals : prev);
      setBlogPosts(prev => JSON.stringify(prev) !== JSON.stringify(fetchedBlogs) ? fetchedBlogs : prev);
      
    } catch (e) {
      console.error("Background sync error", e);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchData();
      
      const sessionUser = StorageService.getSession();
      if (sessionUser) {
        setUser(sessionUser);
        if (sessionUser.role === 'ADMIN') {
          setCurrentView(View.ADMIN);
        } else if (sessionUser.role === 'FOUNDER') {
          setCurrentView(View.FOUNDER_PORTAL);
        }
        
        const freshUsers = await StorageService.fetchUsers();
        const dbUser = freshUsers.find(u => u.id === sessionUser.id);
        if (dbUser) {
           const updatedSession = { ...dbUser, isLoggedIn: true };
           setUser(updatedSession);
           StorageService.setSession(updatedSession);
        }
      }
      setIsLoading(false);
    };
    init();

    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRegisterUser = async (newUser: Partial<User>) => {
    const userEntry: User = {
      id: `user-${Date.now()}`,
      email: newUser.email || '',
      name: newUser.name || '',
      entityName: newUser.entityName || '',
      role: newUser.role || 'FOUNDER',
      status: 'PENDING',
      isLoggedIn: false
    };
    const updatedUsers = await StorageService.createUser(userEntry);
    setAllUsers(updatedUsers);
  };

  const handleRegisterStartup = async (data: any) => {
    const userId = `founder-${Date.now()}`;
    const userEntry: User = {
      id: userId,
      email: `${data.companyName.toLowerCase().replace(/\s/g, '')}@credema-founder.com`,
      name: 'Startup Lead',
      entityName: data.companyName,
      role: 'FOUNDER',
      status: 'PENDING',
      isLoggedIn: true
    };

    const newDeal: LoanDeal = {
      id: `CD-${new Date().getFullYear()}-${Math.floor(Math.random()*9000) + 1000}`,
      ownerId: userId,
      companyName: data.companyName,
      tagline: data.tagline,
      location: data.location,
      sector: data.sector,
      stage: data.stage,
      description: data.description,
      raisingAmount: data.raisingAmount,
      instrument: data.instrument,
      valuation: data.valuation,
      valuationType: 'CAP',
      minTicket: 50000,
      investorNote: "New Institutional Application",
      leverageAmount: data.leverageNeeded,
      depositAmount: data.hasDeposit ? data.leverageNeeded * 0.2 : 0,
      leverageMultiplier: 5,
      termMonths: 24,
      monthsElapsed: 0,
      walletStatus: WalletStatus.PENDING,
      walletAddress: '0x...',
      lastOracleCheck: new Date().toISOString().split('T')[0],
      growthMetrics: { cac: 0, roas: 0, monthlyAdSpend: 0, conversionRate: 0 },
      productMetrics: { burnRate: 0, runwayMonths: 0, githubCommits: 0, roadmapCompletion: 0, betaUsers: 0 },
      ragContext: data.ragContext,
      seedInvestorVerified: false,
      status: 'PENDING'
    };

    await StorageService.createUser(userEntry);
    const currentDeals = await StorageService.fetchDeals(); 
    const finalDeals = [...currentDeals, newDeal];
    setDeals(finalDeals); 
    setUser(userEntry);
    StorageService.setSession(userEntry);
    setCurrentView(View.FOUNDER_PORTAL);
  };

  const handleUpdateBlogPost = async (post: BlogPost) => {
    const updated = await StorageService.updateBlogPost(post);
    setBlogPosts(updated);
  };

  const handleCreateBlogPost = async (post: BlogPost) => {
    const updated = await StorageService.createBlogPost(post);
    setBlogPosts(updated);
  };

  const handleDeleteBlogPost = async (id: string) => {
    const updated = await StorageService.deleteBlogPost(id);
    setBlogPosts(updated);
  };

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
           <div className="flex flex-col items-center">
              <div className="h-10 w-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Connecting to CREDEMA.Finance...</p>
           </div>
        </div>
      );
    }

    switch (currentView) {
      case View.LANDING:
        return <LandingPage onNavigate={setCurrentView} language={language} />;
      case View.ABOUT:
        return <AboutUsPage language={language} onNavigate={setCurrentView} />;
      case View.REGISTER_STARTUP:
        return (
          <StartupRegistration 
            language={language} 
            onSubmit={handleRegisterStartup}
            onCancel={() => setCurrentView(View.LANDING)}
          />
        );
      case View.FOUNDATIONS:
        return <FoundationsPage language={language} />;
      case View.DASHBOARD:
        return (
          <LeverageDashboard 
            language={language} 
            onViewOpportunity={(deal) => { setSelectedOpportunityId(deal.id); setCurrentView(View.OPPORTUNITY_DETAIL); }}
            onApproveDeal={async (id) => {
              const deal = deals.find(d => d.id === id);
              if (deal) {
                const updated = await StorageService.updateDeal({ ...deal, status: 'ACTIVE' });
                setDeals(updated);
              }
            }}
            deals={deals}
          />
        );
      case View.OPPORTUNITY_DETAIL:
        if (selectedOpportunity) {
          return (
            <OpportunityDetail 
              deal={selectedOpportunity} 
              language={language} 
              onBack={() => setCurrentView(View.DASHBOARD)} 
              user={user}
              blogPosts={blogPosts}
            />
          );
        }
        return <LandingPage onNavigate={setCurrentView} language={language} />;
      case View.RAG_SETUP:
        return (
           <RAGQuestionnaire 
             language={language} 
             onComplete={async (ctx) => {
                const targetId = selectedOpportunityId || (deals.length > 0 ? deals[0].id : null);
                if (targetId) {
                  const deal = deals.find(d => d.id === targetId);
                  if (deal) {
                    const updated = await StorageService.updateDeal({ ...deal, ragContext: ctx });
                    setDeals(updated);
                    setCurrentView(View.OPPORTUNITY_DETAIL);
                  }
                }
             }}
             initialData={selectedOpportunity?.ragContext}
           />
        );
      case View.BLOG:
        return <BlogPage language={language} blogPosts={blogPosts} />;
      case View.DOCS:
        return <TechnicalDocs language={language} />;
      case View.ADMIN:
        if (user.role !== 'ADMIN') return <LandingPage onNavigate={setCurrentView} language={language} />;
        return (
          <AdminDashboard 
            users={allUsers} 
            deals={deals} 
            blogPosts={blogPosts}
            onApproveUser={async (id) => {
              const u = allUsers.find(x => x.id === id);
              if (u) setAllUsers(await StorageService.updateUser({...u, status: 'APPROVED'}));
            }}
            onRejectUser={async (id) => {
              const u = allUsers.find(x => x.id === id);
              if (u) setAllUsers(await StorageService.updateUser({...u, status: 'REJECTED'}));
            }}
            onUpdateUser={async (u) => setAllUsers(await StorageService.updateUser(u))}
            onDeleteUser={async (id) => setAllUsers(await StorageService.deleteUser(id))}
            onUpdateDeal={async (d) => setDeals(await StorageService.updateDeal(d))}
            onDeleteDeal={async (id) => setDeals(await StorageService.deleteDeal(id))}
            onUpdateBlog={handleUpdateBlogPost}
            onCreateBlog={handleCreateBlogPost}
            onDeleteBlog={handleDeleteBlogPost}
            language={language}
          />
        );
      case View.FOUNDER_PORTAL:
        if (user.role !== 'FOUNDER' && user.role !== 'ADMIN') return <LandingPage onNavigate={setCurrentView} language={language} />;
        return <FounderPortal user={user} deals={deals} language={language} />;
      case View.PRIVACY:
      case View.TERMS:
      case View.RISK:
        return <LegalPage view={currentView} language={language} onBack={() => setCurrentView(View.LANDING)} />;
      default:
        return <LandingPage onNavigate={setCurrentView} language={language} />;
    }
  };

  return (
    <div className="min-h-screen w-full font-sans antialiased text-slate-900 bg-white selection:bg-primary-100 selection:text-primary-900">
      {!isLoading && (
        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          language={language} 
          setLanguage={setLanguage}
          user={user}
          setUser={setUser}
          allUsers={allUsers}
          onRegisterUser={handleRegisterUser}
        />
      )}
      <main className="w-full">
        {renderView()}
      </main>
      {!isLoading && currentView !== View.OPPORTUNITY_DETAIL && currentView !== View.RAG_SETUP && currentView !== View.REGISTER_STARTUP && <AIChatBot language={language} blogPosts={blogPosts} />}
    </div>
  );
}
