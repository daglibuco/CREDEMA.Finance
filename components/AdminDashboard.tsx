
import React, { useState } from 'react';
import { User, LoanDeal, BlogPost, Language, UserRole } from '../types';
import { CheckCircle2, XCircle, Users, Activity, Search, Edit2, Trash2, X, Save, Plus, ShieldCheck, FileText, AlertTriangle, BookOpen, Clock, Image as ImageIcon } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

interface AdminDashboardProps {
  users: User[];
  deals: LoanDeal[];
  blogPosts: BlogPost[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateUser: (user: User) => void;
  onDeleteDeal: (dealId: string) => void;
  onUpdateDeal: (deal: LoanDeal) => void;
  onUpdateBlog: (post: BlogPost) => void;
  onCreateBlog: (post: BlogPost) => void;
  onDeleteBlog: (id: string) => void;
  language: Language;
}

interface DeleteTarget {
  type: 'user' | 'deal' | 'blog';
  id: string;
  name: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  users, deals, blogPosts, onApproveUser, onRejectUser, onDeleteUser, onUpdateUser, 
  onDeleteDeal, onUpdateDeal, onUpdateBlog, onCreateBlog, onDeleteBlog, language 
}) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'DEALS' | 'BLOG'>('USERS');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [search, setSearch] = useState('');
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingDeal, setEditingDeal] = useState<LoanDeal | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const t = { ...TRANSLATIONS['EN'].admin, ...(TRANSLATIONS[language]?.admin || {}) };
  const tc = { ...TRANSLATIONS['EN'].common, ...(TRANSLATIONS[language]?.common || {}) };
  const tb = { ...TRANSLATIONS['EN'].blog, ...(TRANSLATIONS[language]?.blog || {}) };

  const filteredUsers = (users || []).filter(Boolean).filter(u => {
    const matchesFilter = filter === 'ALL' || u.status === filter;
    const matchesSearch = u.email?.toLowerCase().includes(search.toLowerCase()) || 
                         u.entityName?.toLowerCase().includes(search.toLowerCase()) ||
                         u.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredDeals = (deals || []).filter(Boolean).filter(d => 
    d.companyName?.toLowerCase().includes(search.toLowerCase()) || 
    d.id?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBlogs = (blogPosts || []).filter(Boolean).filter(b => 
    b.title?.[language]?.toLowerCase().includes(search.toLowerCase()) ||
    b.id?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser(editingUser);
      setEditingUser(null);
    }
  };

  const handleSaveDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDeal) {
      onUpdateDeal(editingDeal);
      setEditingDeal(null);
    }
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlog) {
      const isNew = !blogPosts.filter(Boolean).find(b => b.id === editingBlog.id);
      if (isNew) onCreateBlog(editingBlog);
      else onUpdateBlog(editingBlog);
      setEditingBlog(null);
    }
  };

  const executeDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'user') onDeleteUser(deleteTarget.id);
    else if (deleteTarget.type === 'deal') onDeleteDeal(deleteTarget.id);
    else if (deleteTarget.type === 'blog') onDeleteBlog(deleteTarget.id);
    setDeleteTarget(null);
  };

  const initNewBlog = () => {
    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      title: { EN: '', DE: '', FR: '' },
      excerpt: { EN: '', DE: '', FR: '' },
      content: { EN: '', DE: '', FR: '' },
      category: { EN: 'Strategy', DE: 'Strategie', FR: 'Stratégie' },
      readTime: { EN: '5 min', DE: '5 Min', FR: '5 min' },
      date: { EN: new Date().toLocaleDateString('en-US'), DE: new Date().toLocaleDateString('de-DE'), FR: new Date().toLocaleDateString('fr-FR') },
      author: { name: 'Eric Gaudin', role: { EN: 'Director', DE: 'Direktor', FR: 'Directeur' } },
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070'
    };
    setEditingBlog(newPost);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
           <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900">{t.title}</h1>
              <p className="text-slate-600">{t.subtitle}</p>
           </div>
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button onClick={() => setActiveTab('USERS')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'USERS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                {t.directory}
              </button>
              <button onClick={() => setActiveTab('DEALS')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'DEALS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                {t.applicants}
              </button>
              <button onClick={() => setActiveTab('BLOG')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'BLOG' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                {tb?.title || 'Intelligence'}
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.pendingReg}</h3>
                 <Users className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-2xl font-mono font-bold text-slate-900">{users.filter(u => u?.status === 'PENDING').length}</p>
           </div>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.activeStartups}</h3>
                 <Activity className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-mono font-bold text-slate-900">{deals.filter(Boolean).length}</p>
           </div>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.totalInvestors}</h3>
                 <ShieldCheck className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-mono font-bold text-slate-900">{users.filter(u => u?.role === 'SEED_INVESTOR' && u?.status === 'APPROVED').length}</p>
           </div>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Knowledge Nodes</h3>
                 <BookOpen className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-2xl font-mono font-bold text-slate-900">{blogPosts.filter(Boolean).length}</p>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-900">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-bold">{activeTab === 'USERS' ? t.directory : activeTab === 'DEALS' ? t.applicants : 'Intelligence Library'}</h2>
                {activeTab === 'BLOG' && (
                  <button onClick={initNewBlog} className="flex items-center px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800">
                    <Plus className="h-3 w-3 mr-1.5" /> Add Insight
                  </button>
                )}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input type="text" placeholder={t.searchUsers} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900" />
              </div>
           </div>

           <div className="overflow-x-auto">
              {activeTab === 'USERS' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase font-bold tracking-wider">
                        <th className="px-6 py-4">{t.tableEntity}</th>
                        <th className="px-6 py-4">{t.tableRole}</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{user.entityName}</div>
                              <div className="text-xs text-slate-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex px-2 py-1 rounded text-[10px] font-bold border bg-slate-100">{user.role}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-bold ${user.status === 'APPROVED' ? 'text-green-600' : 'text-orange-500'}`}>{user.status}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                  {user.status === 'PENDING' && (
                                    <button onClick={() => onApproveUser(user.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><CheckCircle2 className="h-4 w-4" /></button>
                                  )}
                                  <button onClick={() => setEditingUser(user)} className="p-1.5 text-slate-400 hover:text-slate-900 rounded"><Edit2 className="h-4 w-4" /></button>
                                  <button onClick={() => setDeleteTarget({ type: 'user', id: user.id, name: user.entityName })} className="p-1.5 text-slate-300 hover:text-red-600 rounded"><Trash2 className="h-4 w-4" /></button>
                              </div>
                            </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'BLOG' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase font-bold tracking-wider">
                        <th className="px-6 py-4">Insight Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredBlogs.map(blog => (
                        <tr key={blog.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4"><div className="font-bold text-slate-900">{blog?.title?.[language] || 'Untitled Node'}</div></td>
                            <td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold rounded uppercase">{blog?.category?.[language] || 'Strategy'}</span></td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                  <button onClick={() => setEditingBlog(blog)} className="p-1.5 text-slate-400 hover:text-slate-900 rounded"><Edit2 className="h-4 w-4" /></button>
                                  <button onClick={() => setDeleteTarget({ type: 'blog', id: blog.id, name: blog?.title?.[language] || blog.id })} className="p-1.5 text-slate-300 hover:text-red-600 rounded"><Trash2 className="h-4 w-4" /></button>
                              </div>
                            </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
           </div>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
              <div className="p-6 bg-red-50 border-b border-red-100 flex items-center">
                 <AlertTriangle className="h-6 w-6 text-red-600 mr-4" />
                 <h3 className="text-lg font-bold text-red-900">Confirm Deletion</h3>
              </div>
              <div className="p-8">
                 <p className="text-slate-600 mb-6 leading-relaxed">Remove <strong>{deleteTarget.name}</strong> from CREDEMA.Finance?</p>
                 <div className="flex space-x-3">
                    <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 bg-white text-slate-500 font-bold border border-slate-200 rounded-xl">Cancel</button>
                    <button onClick={executeDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg">Delete</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {editingBlog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm overflow-y-auto">
           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden border border-slate-200 my-8">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="text-lg font-bold">Manage Intelligence Entry</h3>
                 <button onClick={() => setEditingBlog(null)} className="p-2 hover:bg-white rounded-full"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleSaveBlog} className="p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                       <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Image URL</label><input type="text" value={editingBlog.image} onChange={e => setEditingBlog({...editingBlog, image: e.target.value})} className="w-full p-2 bg-slate-50 border rounded text-xs" /></div>
                       <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category (EN)</label><input type="text" value={editingBlog?.category?.EN || ''} onChange={e => setEditingBlog({...editingBlog, category: {...editingBlog.category, EN: e.target.value}})} className="w-full p-2 bg-slate-50 border rounded text-xs" /></div>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(['EN', 'DE', 'FR'] as const).map(lang => (
                          <div key={lang} className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                             <h4 className="text-[10px] font-bold uppercase border-b pb-1">{lang} Content</h4>
                             <input placeholder="Title" value={editingBlog?.title?.[lang] || ''} onChange={e => setEditingBlog({...editingBlog, title: {...editingBlog.title, [lang]: e.target.value}})} className="w-full p-2 text-xs border rounded" />
                             <textarea placeholder="Excerpt" value={editingBlog?.excerpt?.[lang] || ''} onChange={e => setEditingBlog({...editingBlog, excerpt: {...editingBlog.excerpt, [lang]: e.target.value}})} className="w-full p-2 text-xs border rounded h-16" />
                             <textarea placeholder="Full Analysis (Markdown)" value={editingBlog?.content?.[lang] || ''} onChange={e => setEditingBlog({...editingBlog, content: {...editingBlog.content, [lang]: e.target.value}})} className="w-full p-2 text-xs border rounded h-40 font-mono" />
                          </div>
                        ))}
                    </div>
                 </div>
                 <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button type="button" onClick={() => setEditingBlog(null)} className="px-6 py-2 text-slate-500 font-bold">Cancel</button>
                    <button type="submit" className="px-10 py-2 bg-slate-900 text-white font-bold rounded-xl shadow-xl"><Save className="h-4 w-4 mr-2 inline" /> Save Intelligence Node</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
