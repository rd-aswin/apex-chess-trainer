import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { API_BASE } from '../config';
import { identifyOpening } from '../services/openingBook';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Settings,
  HelpCircle,
  Compass,
  Shield,
  Lightbulb,
  Check,
  AlertCircle,
  Key,
  Server,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Configure marked for clean chess notes, headings, and lists
marked.setOptions({
  gfm: true,
  breaks: true
});

function renderMarkdown(content) {
  try {
    return { __html: marked.parse(content || '') };
  } catch (err) {
    return { __html: content || '' };
  }
}

/**
 * AI Coach Conversational Panel ("Apex Coach")
 * Provides real-time pedagogical Grandmaster chat grounded in board state,
 * opening knowledge, and Stockfish analysis.
 */
export function AiCoachChat({
  currentFen,
  moves = [],
  currentPly = 0,
  userColor = 'w',
  currentStep = null,
  currentScore = null
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        '👋 Welcome! I am your **Apex Chess Coach**. Ask me anything about this position, why opening moves are played (like in the Ruy Lopez or Sicilian), or what strategic plan you should follow!'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openingInfo, setOpeningInfo] = useState(null);
  const [isPlansExpanded, setIsPlansExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings State
  const [provider, setProvider] = useState('gemini');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3.2:3b');
  const [saveStatus, setSaveStatus] = useState('');

  const messagesEndRef = useRef(null);

  // Identify current opening instantly client-side (0ms latency)
  useEffect(() => {
    const activeMoves = moves.slice(0, currentPly).map((m) => (typeof m === 'string' ? m : m.san || m.uci));
    const detected = identifyOpening(activeMoves);
    if (detected) {
      setOpeningInfo(detected);
    }
  }, [moves, currentPly]);

  // Load saved coach config from localStorage and backend
  useEffect(() => {
    try {
      const localKey = localStorage.getItem('apex_gemini_key');
      if (localKey) {
        setHasGeminiKey(true);
        setMaskedKey(localKey.slice(0, 4) + '••••••••' + localKey.slice(-4));
      }
    } catch (e) {}

    fetch(`${API_BASE}/coach/config`)
      .then((res) => res.json())
      .then((data) => {
        if (data.hasApiKey) {
          setHasGeminiKey(true);
          if (!maskedKey) setMaskedKey('Configured on Cloud');
        }
      })
      .catch(() => {});
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    const activeSanMoves = moves.slice(0, currentPly).map((m) => (typeof m === 'string' ? m : m.san || m.uci));

    try {
      const storedKey = localStorage.getItem('apex_gemini_key') || '';
      const res = await fetch(`${API_BASE}/coach/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          currentFen: currentFen || 'startpos',
          moves: activeSanMoves,
          currentPly,
          userColor,
          score: currentScore?.value || 0,
          bestMoveSan: currentStep?.bestMoveSan || '',
          tacticalFacts: currentStep?.explanation || null,
          opening: openingInfo,
          apiKey: storedKey
        })
      });

      const data = await res.json();
      if ((data.success || data.reply) && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            provider: data.provider || 'gemini',
            needsKey: data.needsKey
          }
        ]);
        if (data.opening) {
          setOpeningInfo(data.opening);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ Sorry, I encountered an issue: ${data.error || 'Unknown error'}`
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Failed to reach coach: ${err.message}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      if (geminiApiKey && geminiApiKey.trim()) {
        localStorage.setItem('apex_gemini_key', geminiApiKey.trim());
        setHasGeminiKey(true);
        setMaskedKey(geminiApiKey.trim().slice(0, 4) + '••••••••' + geminiApiKey.trim().slice(-4));
        setGeminiApiKey('');
      }
      setSaveStatus('Settings saved in browser!');
      setTimeout(() => {
        setSaveStatus('');
        setIsSettingsOpen(false);
      }, 1200);
    } catch (err) {
      setSaveStatus('Failed to save settings.');
    }
  };

  // Quick Question Chips
  const quickQuestions = [
    { label: '💡 Why is this move played?', prompt: 'Why is this specific move played in this opening? What is the strategic logic behind it?' },
    { label: '🗺️ What is my plan here?', prompt: 'What is the primary strategic plan for my side in this position?' },
    { label: '🛡️ What is opponent threatening?', prompt: 'What is my opponent threatening right now, and how should I handle it?' },
    { label: '⚖️ Explain current opening', prompt: 'Can you give me a grandmaster overview of this opening and what both sides are fighting for?' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden relative">
      {/* Header Bar with Opening Badge and Settings */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Bot size={14} className="text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">
                Apex Grandmaster Coach
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 shrink-0">
                {hasGeminiKey ? 'Gemini AI' : 'Heuristic DB'}
              </span>
            </div>
            {openingInfo && (
              <p className="text-[10px] text-slate-400 truncate">
                {openingInfo.name} • {openingInfo.variation} ({openingInfo.eco})
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {openingInfo?.concepts && (
            <button
              onClick={() => setIsPlansExpanded(!isPlansExpanded)}
              className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${
                isPlansExpanded ? 'bg-slate-800 text-emerald-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Toggle Opening Strategic Plans"
            >
              <BookOpen size={14} />
              {isPlansExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Coach Settings (Gemini API Key & Offline LLM)"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Expandable Opening Strategy Drawer */}
      {isPlansExpanded && openingInfo?.concepts && (
        <div className="p-3 bg-slate-950/90 border-b border-slate-800 text-xs text-slate-300 space-y-2 shrink-0 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[160px] overflow-y-auto">
          <div className="flex items-center justify-between font-semibold text-emerald-400">
            <span>📖 {openingInfo.family} Strategic Guide</span>
            <span className="text-[10px] font-mono text-slate-400">{openingInfo.eco}</span>
          </div>
          <div>
            <span className="text-white font-medium">White's Plan: </span>
            <span className="text-slate-300">{openingInfo.concepts.whitePlan}</span>
          </div>
          <div>
            <span className="text-white font-medium">Black's Plan: </span>
            <span className="text-slate-300">{openingInfo.concepts.blackPlan}</span>
          </div>
        </div>
      )}

      {/* Message History Thread */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={13} className="text-emerald-400" />
                </div>
              )}

              <div
                className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-slate-800/95 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-lg'
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div
                    className="coach-markdown"
                    dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                  />
                )}

                {msg.needsKey && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-amber-300">
                    <span>Answered via Opening Knowledge Base.</span>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="underline font-semibold hover:text-amber-200"
                    >
                      Connect Free Gemini Key
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={13} className="text-slate-300" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 animate-pulse">
              <Bot size={13} className="text-emerald-400" />
            </div>
            <div className="bg-slate-800/80 px-3 py-2 rounded-xl rounded-bl-none border border-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              <span className="text-[11px] text-slate-300 ml-1">Apex Coach is analyzing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-2.5 py-1.5 bg-slate-950/60 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q.prompt)}
            disabled={isLoading}
            className="px-2 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 text-[10px] font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap border border-slate-700/60 shrink-0"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Chat Input Field */}
      <div className="p-2 border-t border-slate-800 bg-slate-950 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Ask Coach... (e.g. Why is this move played in the Ruy Lopez?)"
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors flex items-center justify-center shrink-0 shadow-sm"
        >
          <Send size={13} />
        </button>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 w-full max-w-sm shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                <Settings size={16} className="text-emerald-400" />
                Coach AI Settings
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-1.5 py-0.5 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  AI Provider:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProvider('gemini')}
                    className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 transition-colors ${
                      provider === 'gemini'
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-semibold text-[11px] flex items-center gap-1">
                      <Key size={12} /> Google Gemini
                    </span>
                    <span className="text-[9px] text-slate-400">
                      100% Free tier (Superhuman)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('ollama')}
                    className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 transition-colors ${
                      provider === 'ollama'
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-semibold text-[11px] flex items-center gap-1">
                      <Server size={12} /> Local Ollama
                    </span>
                    <span className="text-[9px] text-slate-400">
                      100% Offline (Local Model)
                    </span>
                  </button>
                </div>
              </div>

              {provider === 'gemini' ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-medium">
                      Gemini API Key (Free):
                    </label>
                    {hasGeminiKey && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                        <Check size={10} /> Active ({maskedKey})
                      </span>
                    )}
                  </div>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder={hasGeminiKey ? 'Paste new key to replace...' : 'AIzaSy...'}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Get a completely free key with zero payment details required at{' '}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      Google AI Studio ↗
                    </a>
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Ollama Endpoint URL:
                    </label>
                    <input
                      type="text"
                      value={ollamaUrl}
                      onChange={(e) => setOllamaUrl(e.target.value)}
                      placeholder="http://localhost:11434"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Model Name:
                    </label>
                    <input
                      type="text"
                      value={ollamaModel}
                      onChange={(e) => setOllamaModel(e.target.value)}
                      placeholder="llama3.2:3b or qwen2.5:3b"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {saveStatus && (
                <div className="text-[11px] font-medium text-emerald-400 text-center">
                  {saveStatus}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}