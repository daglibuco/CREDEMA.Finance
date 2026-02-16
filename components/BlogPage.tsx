
import React, { useState, useEffect } from 'react';
import { BlogPost, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { ArrowLeft, Clock, Search, Heart, Bookmark, ArrowRight, Twitter, Linkedin, Link, Send, MessageCircle } from 'lucide-react';

interface BlogPageProps {
  language: Language;
  blogPosts: BlogPost[];
}

interface Comment {
   id: string;
   author: string;
   text: string;
   time: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ language, blogPosts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
     { id: '1', author: 'Institutional LP #9', text: 'This perspective on the distribution bottleneck is exactly what we look for in our due diligence processes. Great analysis.', time: '2 hours ago' }
  ]);
  const [scrollProgress, setScrollProgress] = useState(0);

  const t = TRANSLATIONS[language]?.blog || TRANSLATIONS['EN'].blog;

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    if (selectedPost) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedPost]);

  const safePosts = (blogPosts || []).filter(Boolean);
  const filteredPosts = safePosts.filter(post => 
    post?.title?.[language]?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post?.category?.[language]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLike = (id: string) => {
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
       id: Date.now().toString(),
       author: 'Institutional Guest',
       text: commentText,
       time: 'Just now'
    };
    setComments(prev => [newComment, ...prev]);
    setCommentText('');
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'copy') => {
    if (platform === 'copy') {
       navigator.clipboard.writeText(window.location.href);
       alert('Institutional intelligence link copied to clipboard.');
    } else {
       const url = `https://${platform === 'twitter' ? 'x.com' : 'linkedin.com'}/intent/tweet?text=${encodeURIComponent(selectedPost?.title?.[language] || '')}&url=${encodeURIComponent(window.location.href)}`;
       window.open(url, '_blank');
    }
  };

  const renderContent = (content: string) => {
    if (!content) return null;
    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-serif font-bold text-slate-900 mt-10 mb-5">{block.replace('## ', '')}</h2>;
      }
      if (block.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-bold text-slate-800 mt-8 mb-4">{block.replace('### ', '')}</h3>;
      }
      return <p key={i} className="text-slate-600 leading-relaxed mb-6 text-lg">{block}</p>;
    });
  };

  if (selectedPost) {
    return (
      <div className="pt-16 min-h-screen bg-white">
        <div className="fixed top-16 left-0 h-1 bg-slate-100 w-full z-50">
           <div className="h-full bg-slate-900 transition-all duration-150" style={{ width: `${scrollProgress}%` }}></div>
        </div>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <button 
            onClick={() => { setSelectedPost(null); setScrollProgress(0); window.scrollTo(0,0); }}
            className="group flex items-center text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors mb-12 mt-12"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t.back}
          </button>

          <header className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                {selectedPost?.category?.[language] || 'Insight'}
              </span>
              <span className="text-slate-400 text-xs font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1" /> {selectedPost?.readTime?.[language] || '5 min'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-950 leading-[1.1] mb-8 tracking-tight">
              {selectedPost?.title?.[language]}
            </h1>
            
            <div className="flex items-center justify-between border-y border-slate-100 py-8">
               <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-serif font-bold text-xl border border-slate-200">
                     {selectedPost?.author?.name?.charAt(0) || 'E'}
                  </div>
                  <div>
                     <p className="text-sm font-bold text-slate-900">{selectedPost?.author?.name || 'Eric Gaudin'}</p>
                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{selectedPost?.author?.role?.[language] || 'Director'} • {selectedPost?.date?.[language]}</p>
                  </div>
               </div>
               <div className="flex items-center space-x-2">
                  <button onClick={() => handleShare('twitter')} className="p-2 text-slate-400 hover:text-blue-400 transition-colors hover:bg-slate-50 rounded-full"><Twitter className="h-5 w-5" /></button>
                  <button onClick={() => handleShare('linkedin')} className="p-2 text-slate-400 hover:text-blue-700 transition-colors hover:bg-slate-50 rounded-full"><Linkedin className="h-5 w-5" /></button>
                  <button onClick={() => handleShare('copy')} className="p-2 text-slate-400 hover:text-slate-900 transition-colors hover:bg-slate-50 rounded-full"><Link className="h-5 w-5" /></button>
               </div>
            </div>
          </header>

          <div className="prose prose-lg prose-slate max-w-none mb-16">
             {renderContent(selectedPost?.content?.[language])}
          </div>

          <div className="mt-20 sticky bottom-8 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-bottom-8 duration-500 z-40">
             <div className="flex items-center space-x-8 px-4">
                <button 
                  onClick={() => toggleLike(selectedPost.id)}
                  className="flex items-center space-x-2 text-slate-500 hover:text-red-500 transition-all group"
                >
                   <Heart className={`h-5 w-5 transition-transform group-active:scale-150 ${likes[selectedPost.id] ? 'fill-red-500 text-red-500' : ''}`} />
                   <span className="font-mono text-sm font-bold">{34 + (likes[selectedPost.id] || 0)}</span>
                </button>
                <button 
                   onClick={() => setCommentOpen(!commentOpen)}
                   className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors"
                >
                   <MessageCircle className="h-5 w-5" />
                   <span className="font-mono text-sm font-bold">{comments.length}</span>
                </button>
             </div>
             <button 
               onClick={() => setBookmarks(p => ({...p, [selectedPost.id]: !p[selectedPost.id]}))}
               className={`p-3 rounded-xl transition-all ${bookmarks[selectedPost.id] ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
             >
                <Bookmark className={`h-5 w-5 ${bookmarks[selectedPost.id] ? 'fill-white' : ''}`} />
             </button>
          </div>

          {commentOpen && (
             <div className="mt-12 bg-slate-50 rounded-2xl p-8 border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-xl font-bold text-slate-900 mb-6 font-serif">{t.comments}</h3>
                <div className="relative mb-6">
                   <textarea 
                     className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all bg-white"
                     rows={3}
                     placeholder="Contribute to the institutional discussion..."
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                   ></textarea>
                </div>
                <button 
                  onClick={handlePostComment}
                  disabled={!commentText.trim()}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 shadow-lg"
                >
                   Post Insight <Send className="h-3 w-3 ml-2" />
                </button>
             </div>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-32 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
             Institutional Intelligence
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-slate-950 mb-10 tracking-tight leading-tight">
            The <span className="text-slate-400 italic">CREDEMA.Finance</span> Journal
          </h1>
          <div className="relative max-w-xl mx-auto group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
             <input 
               type="text" 
               placeholder={t.searchPlaceholder}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-14 pr-6 py-6 bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-lg font-medium"
             />
          </div>
        </div>

        {!searchQuery && safePosts.length > 0 && (
           <div className="mb-20 cursor-pointer group" onClick={() => { setSelectedPost(safePosts[0]); window.scrollTo(0,0); }}>
              <div className="bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl relative h-[600px] border border-slate-800">
                 <img src={safePosts[0]?.image} alt="Featured" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[3000ms]" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                 <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-20">
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Featured Insight</span>
                        <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{safePosts[0]?.readTime?.[language] || '5 min'} read</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-[1.1] max-w-4xl tracking-tight">{safePosts[0]?.title?.[language]}</h2>
                    <p className="text-slate-300 text-lg md:text-xl mb-12 font-light leading-relaxed max-w-2xl line-clamp-2">{safePosts[0]?.excerpt?.[language]}</p>
                    <div className="flex items-center group/btn">
                       <span className="text-white flex items-center bg-blue-600 px-8 py-4 rounded-2xl hover:bg-blue-500 transition-all shadow-xl font-bold">
                          Read Analysis <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                       </span>
                    </div>
                 </div>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {(searchQuery ? filteredPosts : filteredPosts.slice(1)).map((post) => (
              <div 
                key={post.id}
                onClick={() => { setSelectedPost(post); window.scrollTo(0,0); }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group flex flex-col h-full overflow-hidden"
              >
                 <div className="h-64 overflow-hidden relative">
                    <img src={post.image} alt={post?.title?.[language]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute top-6 left-6">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-950 uppercase tracking-widest rounded-full shadow-md">
                           {post?.category?.[language] || 'Strategy'}
                        </span>
                    </div>
                 </div>
                 <div className="p-10 flex-1 flex flex-col">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                           {post?.title?.[language]}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                           {post?.excerpt?.[language]}
                        </p>
                    </div>
                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-slate-900 uppercase tracking-tighter">{post?.author?.name || 'Eric Gaudin'}</span>
                           <span className="text-[10px] text-slate-400 font-mono mt-1 uppercase">{post?.date?.[language]}</span>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all duration-300">
                           <ArrowRight className="h-6 w-6" />
                        </div>
                    </div>
                 </div>
              </div>
           ))}
        </div>
        {filteredPosts.length === 0 && (
            <div className="py-32 text-center">
                <p className="text-slate-400 italic">No intelligence nodes found for your query.</p>
            </div>
        )}
      </div>
    </div>
  );
};
