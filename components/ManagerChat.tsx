import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { ScenarioConfig } from '../types';
import { createManagerChat } from '../services/geminiService';
import { Button } from './ui/Button';
import ReactMarkdown from 'react-markdown';

interface ManagerChatProps {
  config: ScenarioConfig;
  scenarioText: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ManagerChat: React.FC<ManagerChatProps> = ({ config, scenarioText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when scenario changes
  useEffect(() => {
    if (scenarioText) {
      chatRef.current = createManagerChat(config, scenarioText);
      setMessages([{ role: 'model', text: "I've sent over the brief. Let me know if you have any questions before you get started." }]);
    }
  }, [scenarioText, config]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !chatRef.current) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userMsg });
      if (result.text) {
        setMessages(prev => [...prev, { role: 'model', text: result.text }]);
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I got pulled into a meeting. Can you ask that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!scenarioText) return null;

  return (
    <div className={`fixed bottom-0 right-0 z-50 flex flex-col items-end p-6 pointer-events-none`}>
      
      {/* Chat Window */}
      <div 
        className={`pointer-events-auto bg-white shadow-2xl border border-stone-200 w-80 md:w-96 rounded-t-lg transition-all duration-300 ease-in-out transform origin-bottom-right flex flex-col
          ${isOpen ? 'opacity-100 scale-100 translate-y-0 h-[500px]' : 'opacity-0 scale-95 translate-y-4 h-0 overflow-hidden'}`}
      >
        {/* Header */}
        <div className="bg-stone-900 text-stone-50 px-4 py-3 rounded-t-lg flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <div>
              <p className="text-xs font-sans font-bold uppercase tracking-widest">Manager</p>
              <p className="text-[10px] text-stone-400 font-serif italic">Online</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDFCF8]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-lg p-3 text-sm font-serif leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-stone-200 text-stone-900 rounded-br-none' 
                    : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'
                  }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-stone-200 rounded-lg rounded-bl-none p-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-stone-200 bg-white shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask clarifying questions..."
              className="flex-1 bg-stone-50 border border-stone-200 text-stone-900 text-sm rounded-sm px-3 py-2 focus:outline-none focus:border-stone-400 font-serif"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-stone-900 text-white p-2 rounded-sm hover:bg-stone-800 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      </div>

      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto mt-4 bg-stone-900 text-white shadow-lg hover:bg-stone-800 transition-all flex items-center gap-3 px-5 py-3 rounded-full hover:scale-105 active:scale-95 group"
        >
          <div className="relative">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-stone-900"></span>
          </div>
          <span className="font-sans font-bold text-xs uppercase tracking-wider">Talk to Manager</span>
        </button>
      )}
    </div>
  );
};