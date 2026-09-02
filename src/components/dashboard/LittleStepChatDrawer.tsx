import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ArrowRight,
  Shield,
  Layers,
  Trash2,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage } from '../../types';

export const LittleStepChatDrawer: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    isChatSending,
    sendChatMessage,
    clearChatHistory,
    setActiveTab,
  } = useApp();
  const { user, openAuthGate } = useAuth();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isChatSending) return;

    if (!user) {
      openAuthGate({
        actionType: 'chat',
        title: 'Sign In for LittleStep Care Assistant',
        message: 'Create a free account to chat with our multi-agent AI team about your space, plant care, and microclimate guidance.',
      });
      return;
    }

    const text = inputVal;
    setInputVal('');
    sendChatMessage(text);
  };

  const handleActionClick = (targetTab: string) => {
    setActiveTab(targetTab as any);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-lg h-[600px] max-h-[85vh] bg-slate-900/95 border-2 border-emerald-500/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md animate-slideUp">
      {/* Chat Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">LittleStep Care Assistant</h3>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-900 text-emerald-300 rounded font-mono font-bold">
                CARE TEAM
              </span>
            </div>
            <p className="text-[11px] text-emerald-400/80">Helping with Care, Space & Plant Health</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={clearChatHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-emerald-500 text-emerald-950'
                    : 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-none'
                }`}
              >
                <div className="prose prose-invert prose-xs whitespace-pre-wrap">{msg.text}</div>

                {msg.isFallback && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-950/70 border border-amber-800/80 text-[10px] text-amber-300 font-medium">
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>Rule-based Heuristic Fallback (AI Model Offline)</span>
                  </div>
                )}

                {/* Routing & Guide transparency pill */}
                {msg.sourceAgents && msg.sourceAgents.length > 0 && !isUser && (
                  <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-700/60 text-[10px] text-slate-400">
                    <span className="font-mono text-emerald-400">Guides:</span>
                    {msg.sourceAgents.map((agent, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-300 font-mono"
                      >
                        {agent}
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(action.targetTab)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 font-semibold text-[11px] flex items-center gap-1 transition-all"
                      >
                        <span>{action.label}</span>
                        <ArrowRight className="w-3 h-3 text-emerald-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isChatSending && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-9">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span>Consulting your plant guides...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Fast Prompts */}
      <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
        {[
          'What should I do today?',
          'Can I add another plant?',
          'Check my plant health',
          'How is the indoor humidity?',
        ].map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => sendChatMessage(promptText)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask LittleStep (e.g. 'Should I water today?')"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={isChatSending}
          className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isChatSending}
          className="p-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-950 font-bold transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
