import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const AiAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: "Hello! I'm CyberIQ's AI Assistant. How can I help you with your compliance or risk analysis today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Call the backend API we just updated
      const response = await api.post('/ai/chat', { prompt: input });
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: response.data.reply
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: error.response?.data?.error || "Sorry, I couldn't connect to the AI service."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-800 rounded-xl border border-slate-700 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="p-4 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm z-10 flex items-center">
        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3 border border-purple-500/30">
          <Bot className="text-purple-400" size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center">
            Gemini Security AI <Sparkles size={16} className="text-amber-400 ml-2" />
          </h2>
          <p className="text-xs text-slate-400">Powered by Google Gemini 2.5</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-sky-500 ml-3' : 'bg-purple-500 mr-3'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-sky-500 text-white rounded-tr-none shadow-lg shadow-sky-500/20' 
                  : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600 shadow-md'
              }`}>
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="flex flex-row max-w-[75%]">
               <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-500 mr-3">
                  <Bot size={16} className="text-white" />
               </div>
               <div className="p-4 rounded-2xl bg-slate-700 rounded-tl-none border border-slate-600 flex space-x-2">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
             </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-slate-800/80 border-t border-slate-700 z-10">
        <form onSubmit={handleSend} className="flex items-center bg-slate-900 rounded-xl border border-slate-600 p-1 pl-4 pr-1 focus-within:border-purple-500/50 transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about compliance, analyze risks, or query incident logs..."
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 text-sm py-3"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors shadow-lg shadow-purple-500/20 ml-2"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;
