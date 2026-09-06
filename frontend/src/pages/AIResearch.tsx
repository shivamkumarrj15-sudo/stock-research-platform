import React, { useState } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { aiApi } from '../api';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AIResearch: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! I am your AI Financial Research Copilot. Ask me any question about stock fundamentals, valuation multiples, risk analysis, peer comparisons, or earnings.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    aiApi.chat(userMsg, [])
      .then((res) => {
        setMessages((prev) => [...prev, { sender: 'ai', text: res.reply }]);
      })
      .catch(() => {
        setMessages((prev) => [...prev, { sender: 'ai', text: 'I encountered an error retrieving data. Please try again.' }]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-100">AI Research Assistant</h2>
          <span className="text-[11px] text-slate-400">Strictly powered by retrieved empirical financial data</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : ''}`}>
            {m.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
            }`}>
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                U
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-blue-400">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Analyzing financial data & metrics...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask e.g. 'Analyze Reliance', 'Compare TCS vs INFY', 'Find high ROIC stocks'..."
          className="flex-1 bg-slate-900 text-slate-200 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
