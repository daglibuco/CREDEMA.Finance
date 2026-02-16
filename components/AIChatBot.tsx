
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { MessageCircle, X, Send, Mic, MicOff, Loader2, Headphones, Activity } from 'lucide-react';
import { Language, BlogPost } from '../types';
import { getSystemInstruction } from '../utils/aiContext';

interface AIChatBotProps {
  language: Language;
  blogPosts: BlogPost[];
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const AudioUtils = {
  createBlob: (data: Float32Array): any => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    const uint8 = new Uint8Array(int16.buffer);
    let binary = '';
    const len = uint8.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    const b64 = btoa(binary);
    return { data: b64, mimeType: 'audio/pcm;rate=16000' };
  },
  decode: (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
    return bytes;
  },
  decodeAudioData: async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
};

export const AIChatBot: React.FC<AIChatBotProps> = ({ language, blogPosts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'model',
    text: language === 'EN' 
      ? 'Hello. I am the CREDEMA.Finance AI Advisor. How can I assist with your financing structure today?' 
      : 'Hallo. Ich bin der CREDEMA.Finance AI Advisor. Wie kann ich Ihnen heute bei Ihrer Finanzierungsstruktur helfen?',
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'disconnected' | 'connecting' | 'listening' | 'speaking'>('disconnected');
  const [visualizerData, setVisualizerData] = useState<number[]>([10, 10, 10, 10, 10]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isOpen, isTyping]);
  useEffect(() => { return () => stopVoiceSession(); }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = getSystemInstruction(language, blogPosts);
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction },
        history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
      });
      const result = await chat.sendMessage({ message: userMsg.text });
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: result.text || "...", timestamp: new Date() }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const startVoiceSession = async () => {
    if (voiceStatus !== 'disconnected') return;
    setIsVoiceMode(true); setVoiceStatus('connecting');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = getSystemInstruction(language, blogPosts);
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx; audioContextRef.current = outputCtx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction,
        },
        callbacks: {
          onopen: () => {
            setVoiceStatus('listening');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              sessionPromise.then(session => session.sendRealtimeInput({ media: AudioUtils.createBlob(inputData) }));
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
    } catch (e) {
      setVoiceStatus('disconnected'); setIsVoiceMode(false);
    }
  };

  const stopVoiceSession = () => {
    inputAudioContextRef.current?.close(); audioContextRef.current?.close();
    setVoiceStatus('disconnected'); setIsVoiceMode(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-slate-800 rotate-90 hidden sm:block' : 'bg-primary-600 hover:bg-primary-500 hover:scale-105'}`}>
        <MessageCircle className="h-6 w-6 text-white" />
      </button>
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full h-full sm:bottom-24 sm:right-6 sm:w-96 sm:h-[600px] sm:rounded-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300 shadow-2xl bg-white border border-slate-200">
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div>
              <h3 className="font-serif font-bold text-lg">CREDEMA.Finance AI</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Institutional Advisor</p>
            </div>
            <div className="flex space-x-2">
               <button onClick={isVoiceMode ? stopVoiceSession : startVoiceSession} className={`p-2 rounded-full transition-colors ${isVoiceMode ? 'bg-red-500 animate-pulse' : 'bg-slate-700 hover:bg-slate-600'}`}>
                  {isVoiceMode ? <MicOff className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
               </button>
               <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-slate-700 sm:hidden"><X className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
            {isVoiceMode ? (
               <div className="absolute inset-0 z-10 bg-slate-900 flex flex-col items-center justify-center text-white p-8 text-center">
                  <div className={`h-24 w-24 rounded-full flex items-center justify-center border-4 ${voiceStatus === 'speaking' ? 'border-green-500' : 'border-primary-500'} mb-6`}><Activity className="h-10 w-10" /></div>
                  <h3 className="text-xl font-bold font-serif mb-2 uppercase tracking-widest">{voiceStatus}</h3>
                  <button onClick={stopVoiceSession} className="mt-8 px-6 py-2 bg-slate-800 rounded-full text-xs font-bold border border-slate-700">Switch to Text</button>
               </div>
            ) : (
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />}
                  <div ref={messagesEndRef} />
               </div>
            )}
          </div>
          {!isVoiceMode && (
            <div className="p-4 bg-white border-t border-slate-200 pb-8 sm:pb-4 flex space-x-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about the protocol..." className="flex-1 bg-slate-50 border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500" />
              <button onClick={handleSend} disabled={!input.trim() || isTyping} className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-500"><Send className="h-5 w-5" /></button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
