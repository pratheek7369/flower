import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShoppingBag, 
  Check, 
  Loader2, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { useCartStore } from '../../stores/useCartStore';
import { FlowerProduct } from '../../shared/types';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  recommendedProducts?: FlowerProduct[];
  suggestedPrompts?: string[];
  timestamp: string;
}

export const FloraChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const addItem = useCartStore((s) => s.addItem);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! I am **FloraAI**, your Master Florist and Cold-Chain Concierge. 🌸

I can help you:
- Select the freshest flowers for **Morning Puja, Anniversaries, or Celebrations**
- Verify **pet-safety** (e.g., lily toxicity alerts for cats)
- Double your bouquet's vase life with **underwater 45° stem cutting**
- Check **hyperlocal express delivery** in your area

What blooms can I assist you with today?`,
      suggestedPrompts: [
        'Best flowers for morning puja rituals',
        'How do I extend Dutch rose vase life?',
        'Are lilies safe for cats and pets?',
        'Can I get express delivery to 400001?',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          text: m.text,
        }));

      const res: any = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, history }),
      }).then((r) => r.json());

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.reply || 'Here is what I recommend for your blooms.',
        recommendedProducts: res.recommendedProducts || [],
        suggestedPrompts: res.suggestedPrompts || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'bot',
          text: 'My floral sensory networks had a brief interruption. Please try again or ask another question!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (product: FlowerProduct) => {
    addItem(product, 1);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-botanical-800 to-botanical-950 text-white shadow-xl shadow-botanical-900/30 hover:scale-105 transition-all duration-300 border border-botanical-600/40"
            aria-label="Open FloraAI Chatbot"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
            </div>
            <span className="font-serif font-bold text-sm tracking-wide">FloraAI</span>
            <span className="hidden sm:inline text-xs text-botanical-200 font-medium">Concierge</span>
          </button>
        ) : null}
      </div>

      {/* Floating Slide-out Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-botanical-950 via-botanical-900 to-botanical-950 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-botanical-700 flex items-center justify-center text-slate-950 shadow-inner">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-bold tracking-wide">FloraAI Master Concierge</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-emerald-300 font-medium">
                  Gemini 2.5 Flash • Cold-Chain Intelligence
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[88%]">
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-botanical-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-botanical-800 text-white rounded-tr-sm shadow-sm'
                        : 'bg-white text-slate-800 rounded-tl-sm border border-slate-200/80 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Interactive Recommended Product Cards */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="mt-2.5 space-y-2 w-full pl-8 max-w-[92%]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Recommended Stems
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.recommendedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-2.5 hover:border-botanical-400 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={prod.images[0] || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80'}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <Link
                                to={`/product/${prod.id}`}
                                onClick={() => setIsOpen(false)}
                                className="font-serif font-bold text-[11px] text-slate-900 truncate block hover:text-botanical-700"
                              >
                                {prod.title}
                              </Link>
                              <span className="text-[10px] text-slate-500 font-bold block">
                                ₹{prod.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleQuickAdd(prod)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                              addedItemIds[prod.id]
                                ? 'bg-emerald-600 text-white'
                                : 'bg-botanical-100 hover:bg-botanical-800 hover:text-white text-botanical-900'
                            }`}
                          >
                            {addedItemIds[prod.id] ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3 h-3" />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested prompt chips */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pl-8">
                    {msg.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-botanical-50 hover:text-botanical-900 border border-slate-200/80 text-[10px] font-medium text-slate-600 transition-colors text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 pl-8 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-botanical-600" />
                <span className="italic text-[11px]">FloraAI is consulting botanical knowledge...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about puja flowers, vase life, cat safety..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600 bg-slate-50/70"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-botanical-800 hover:bg-botanical-900 disabled:bg-slate-200 text-white transition-colors"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
