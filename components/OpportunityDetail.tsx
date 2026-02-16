
import React, { useState, useRef, useEffect } from 'react';
import { LoanDeal, Language, User, BlogPost } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/generative-ai";
import { ArrowLeft, Send, Mic, MicOff, Loader2, Activity, Shield, Video, PenTool, Printer, Lock } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';
import { InfoTooltip } from './InfoTooltip';

interface OpportunityDetailProps {
  deal: LoanDeal;
  language: Language;
  onBack: () => void;
  user: User;
  blogPosts: BlogPost[];
}

const AudioUtils = {
  createBlob: (data: Float32Array): any => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) { int16[i] = data[i] * 32768; }
    const uint8 = new Uint8Array(int16.buffer);
    let binary = '';
    const len = uint8.byteLength;
    for (let i = 0; i < len; i++) { binary += String.fromCharCode(uint8[i]); }
    return { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' };
  },
  decode: (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
    return bytes;
  },
  decodeAudioData: async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; }
    }
    return buffer;
  }
};

const ProjectAIConsole: React.FC<{ deal: LoanDeal; language: Language; blogPosts: BlogPost[] }> = ({ deal, language, blogPosts }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'disconnected' | 'connecting' | 'listening' | 'speaking'>('disconnected');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    setMessages([{ role: 'model', text: language === 'EN' 
        ? `Hello. I am the AI Representative for ${deal?.companyName || 'this company'} on the CREDEMA.Finance portal.` 
        : `Hallo. Ich bin der KI-Repräsentant für ${deal?.companyName || 'dieses Unternehmen'} auf dem CREDEMA.Finance Portal.`
    }]);
  }, [language, deal?.companyName]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { return () => stopVoiceSession(); }, []);

  const getSystemInstructionText = () => {
    const knowledge = (blogPosts || []).filter(Boolean).map(p => p?.title?.[language] || 'Strategy').join(', ');
    return `
    You are the AI Representative of ${deal?.companyName || 'the startup'}, appearing on the CREDEMA.Finance portal.
    Language: ${language === 'DE' ? 'German' : language === 'FR' ? 'French' : 'English'}.
    Status: CREDEMA.Finance is an agent/intermediary portal.
    Context: ${deal?.tagline || ''} | Problem: ${deal?.ragContext?.problem || ''} | Solution: ${deal?.ragContext?.solution || ''}
    Market Knowledge: ${knowledge}
  `};

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, text: input };
    setMessages(p => [...p, userMsg]); setInput(''); setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: getSystemInstructionText() },
        history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
      });
      const result = await chat.sendMessage({ message: userMsg.text });
      setMessages(p => [...p, { role: 'model', text: result.text || "..." }]);
    } catch (e) { console.error(e); } finally { setIsTyping(false); }
  };

  const startVoiceSession = async () => {
    if (voiceStatus !== 'disconnected') return;
    setIsVoiceMode(true); setVoiceStatus('connecting');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx; audioContextRef.current = outputCtx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } } },
          systemInstruction: getSystemInstructionText(),
        },
        callbacks: {
          onopen: () => {
            setVoiceStatus('listening');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              sessionPromise.then(session => session.sendRealtimeInput({ media: AudioUtils.createBlob(e.inputBuffer.getChannelData(0)) }));
            };
            source.connect(scriptProcessor); scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const b64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (b64 && audioContextRef.current) {
              setVoiceStatus('speaking');
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await AudioUtils.decodeAudioData(AudioUtils.decode(b64), ctx, 24000, 1);
              const source = ctx.createBufferSource(); source.buffer = audioBuffer; source.connect(ctx.destination);
              source.addEventListener('ended', () => { sourcesRef.current.delete(source); if (sourcesRef.current.size === 0) setVoiceStatus('listening'); });
              source.start(nextStartTimeRef.current); nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onclose: () => setVoiceStatus('disconnected'),
          onerror: () => setVoiceStatus('disconnected'),
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) { setVoiceStatus('disconnected'); setIsVoiceMode(false); }
  };

  const stopVoiceSession = () => {
    inputAudioContextRef.current?.close(); audioContextRef.current?.close();
    setVoiceStatus('disconnected'); setIsVoiceMode(false);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 h-[500px] flex flex-col overflow-hidden shadow-2xl">
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-white font-serif font-bold flex items-center text-sm">
            <Activity className="h-4 w-4 text-green-500 mr-2" /> Founder AI Console
          </h3>
        </div>
        <button onClick={isVoiceMode ? stopVoiceSession : startVoiceSession} className={`p-2 rounded-full ${isVoiceMode ? 'bg-red-500 animate-pulse' : 'bg-slate-800'}`}>
          {isVoiceMode ? <MicOff className="h-4 w-4 text-white" /> : <Mic className="h-4 w-4 text-slate-300" />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {isVoiceMode ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
             <div className={`h-16 w-16 rounded-full border-4 ${voiceStatus === 'speaking' ? 'border-green-500' : 'border-blue-500'}`}><div className="animate-ping h-full w-full rounded-full bg-white/10" /></div>
             <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">{voiceStatus}</p>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-xs ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <Loader2 className="h-4 w-4 text-slate-500 animate-spin" />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      {!isVoiceMode && (
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex space-x-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask about the business model..." className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none" />
          <button onClick={handleSend} className="bg-blue-600 p-2 rounded-lg text-white"><Send className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
};

export const OpportunityDetail: React.FC<OpportunityDetailProps> = ({ deal, language, onBack, user, blogPosts }) => {
  const [accessRequested, setAccessRequested] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TERM_SHEET'>('OVERVIEW');
  const t = TRANSLATIONS[language]?.dashboard || TRANSLATIONS['EN'].dashboard;
  const tooltips = TRANSLATIONS[language]?.tooltips || TRANSLATIONS['EN'].tooltips;
  const detail = t?.detail || TRANSLATIONS['EN'].dashboard.detail;
  const tabs = t?.tabs || TRANSLATIONS['EN'].dashboard.tabs;

  const handleBooking = () => {
    const text = encodeURIComponent(`Founder Intro: ${deal?.companyName || ''}`);
    const details = encodeURIComponent(`Discussing triangular financing structure via CREDEMA.Finance.`);
    window.open(`https://calendar.google.com/calendar/u/0/r/eventedit?text=${text}&details=${details}&location=Google+Meet`, '_blank');
  };

  const handlePrint = () => {
    const printContent = document.getElementById('term-sheet-preview');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); 
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" /> {tabs?.back || 'Back'}
        </button>

        <div className="flex space-x-6 border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar">
           <button onClick={() => setActiveTab('OVERVIEW')} className={`pb-4 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${activeTab === 'OVERVIEW' ? 'text-white border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}`}>
              {detail?.dealOverview || 'Overview'}
           </button>
           <button onClick={() => setActiveTab('TERM_SHEET')} className={`pb-4 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${activeTab === 'TERM_SHEET' ? 'text-white border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}`}>
              {detail?.termSheetGen || 'Term Sheet'}
           </button>
        </div>

        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8 text-slate-200">
              <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800">
                 <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                    <div>
                       <h1 className="text-2xl font-serif font-bold text-white mb-2">{deal?.companyName}</h1>
                       <p className="text-base text-slate-400">{deal?.tagline}</p>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-xl font-mono font-bold text-green-400">€{((deal?.raisingAmount || 0)/1000000).toFixed(1)}M</span>
                       <span className="text-[10px] text-slate-500 uppercase tracking-widest">{t?.raising || 'Raising'}</span>
                       <button onClick={handleBooking} className="mt-2 flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700">
                         <Video className="h-3 w-3 text-red-500" />
                         <span className="text-[10px] font-bold uppercase">{detail?.bookMeet || 'Meet'}</span>
                       </button>
                    </div>
                 </div>
                 <p className="text-slate-300 leading-relaxed mb-8 text-sm">{deal?.description}</p>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800 pt-6">
                    <div><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Valuation</p><p className="font-mono text-sm">€{((deal?.valuation || 0)/1000000).toFixed(1)}M</p></div>
                    <div><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Instrument</p><p className="text-sm">{deal?.instrument || 'N/A'}</p></div>
                    <div><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Min Ticket</p><p className="font-mono text-sm">€{((deal?.minTicket || 0)/1000).toFixed(0)}k</p></div>
                    <div><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Sector</p><p className="text-sm truncate">{deal?.sector || 'N/A'}</p></div>
                 </div>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center"><Lock className="h-5 w-5 text-emerald-500 mr-2" /> Escrow Configuration</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                       <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Deposit</p>
                       <p className="text-2xl font-mono font-bold text-emerald-400">€{((deal?.depositAmount || 0) / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                       <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Multiplier</p>
                       <p className="text-2xl font-mono font-bold text-blue-400">{deal?.leverageMultiplier || 0}x</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                       <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Growth Capital</p>
                       <p className="text-2xl font-mono font-bold text-white">€{((deal?.leverageAmount || 0) / 1000000).toFixed(1)}M</p>
                    </div>
                 </div>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
               <div className="sticky top-24">
                  <ProjectAIConsole deal={deal} language={language} blogPosts={blogPosts} />
                  <div className="mt-4 p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl flex items-start space-x-3">
                      <span className="text-lg">🤖</span>
                      <div>
                          <p className="text-sm font-bold text-purple-200">Institutional Digital Twin</p>
                          <p className="text-[10px] text-slate-400 mt-1">Authorized representative for {deal?.companyName || 'this company'} on the CREDEMA.Finance portal.</p>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'TERM_SHEET' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                   <h3 className="font-bold text-white mb-4">Contract Protocol</h3>
                   <button onClick={handlePrint} className="w-full py-3 bg-white text-slate-900 rounded-lg font-bold flex items-center justify-center hover:bg-slate-200 transition-colors">
                      <Printer className="h-4 w-4 mr-2" /> Save PDF Agreement
                   </button>
                </div>
             </div>
             <div className="lg:col-span-8 bg-white text-slate-900 p-8 rounded-sm shadow-xl min-h-[800px] font-serif text-sm leading-relaxed" id="term-sheet-preview">
                <div className="text-center mb-8">
                   <h2 className="text-xl font-bold underline mb-2 uppercase">Loan Agreement</h2>
                   <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest italic">Intermediary Notice: Provided via CREDEMA.Finance</p>
                </div>
                <div className="mb-6"><p><strong>CREDEMA.Finance</strong> acts exclusively as an agent to connect both parties. It is NOT a party to this agreement and assumes no liability for its execution or performance.</p></div>
                <div className="mt-12 border-t pt-8 grid grid-cols-2 gap-12 font-sans">
                  <div className="border-t border-black pt-2"><p><strong>Lender Signature:</strong></p><p className="mt-4 font-mono text-slate-300">___________________</p></div>
                  <div className="border-t border-black pt-2"><p><strong>Borrower Signature:</strong></p><p className="mt-4 font-mono text-slate-300">___________________</p></div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
