import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Film, Loader2 } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'مرحباً بك! أنا "سينما روبوت" 🍿 المساعد الذكي للأفلام والمسلسلات والأنمي. ماذا تحب أن تشاهد اليوم؟ أخبرني بمزاجك أو تصنيفك المفضل وسأقترح لك أفضل الأعمال!',
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user' as const, text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });
      const data = await res.json();

      if (data.result) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.result }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'عذراً، حدث خطأ أثناء إعداد الاقتراح. يرجى محاولة السؤال مرة أخرى.' },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'عذراً، تعذر الاتصال بخادم الذكاء الاصطناعي حالياً.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const presetQueries = [
    'أنمي أكشن وحماس بأسلوب قاتل الشياطين',
    'أفضل فيلم خيال علمي مناسب للسهرة اليوم',
    'مسلسل غموض وإثارة قصير بجودة عالية',
    'اقترح فيلم أنيميشن عائلي ممتع',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md dir-ltr">
      <div className="relative w-full max-w-2xl h-[600px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">مساعد Cinema Mix الذكي (AI)</h3>
              <p className="text-[11px] text-slate-400">يقترح لك الأفلام والأنمي بناءً على الذكاء الاصطناعي</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-red-600 text-white'
                    : 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-300'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-red-600 text-white rounded-tr-none font-medium'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-950 p-3 rounded-2xl border border-slate-800 max-w-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري تحليل الذوق واختيار أفضل الأفلام والأنمي...</span>
            </div>
          )}
        </div>

        {/* Preset Quick Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {presetQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 whitespace-nowrap transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="اكتب طلبك هنا (مثلاً: أريد أنمي غموض ذكي بأسلوب Death Note)..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-slate-900 text-xs sm:text-sm text-slate-100 placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 dir-ltr"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
