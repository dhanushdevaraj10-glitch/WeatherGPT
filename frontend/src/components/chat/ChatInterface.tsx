import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { StarterQuestions } from './StarterQuestions';
import { useAppContext } from '../../store/appStore';
import { weatherApi } from '../../api/weather';

export const ChatInterface: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: text,
      timestamp: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMsg });
    setInput('');
    setIsTyping(true);

    try {
      const res = await weatherApi.sendChat({
        message: text,
        session_id: state.sessionId,
        location: state.selectedLocation,
        user_profile: state.userProfile,
        history: state.chatMessages.map(({ role, content }) => ({ role, content }))
      });
      
      const astMsg = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: res.data.response,
        intent: res.data.intent,
        weather_data: res.data.weather_data,
        timestamp: new Date().toISOString()
      };
      
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: astMsg });
    } catch (err) {
      console.error(err);
      dispatch({ 
        type: 'ADD_CHAT_MESSAGE', 
        payload: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'I am sorry, I encountered an error while processing your request. Please check if the AI API is configured correctly in Settings.',
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg/50">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {state.chatMessages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center max-w-2xl mx-auto text-center mt-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mb-6 shadow-lg shadow-accent-primary/20">
              <Sparkles className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
            <p className="text-slate-400 mb-10">Ask me anything about weather conditions, travel safety, climate trends, or risk assessments.</p>
            <StarterQuestions onSelect={handleSend} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {state.chatMessages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-3 text-slate-400 animate-pulse bg-white/5 p-4 rounded-2xl w-max rounded-tl-sm">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm">WeatherGPT is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 bg-dark-bg border-t border-white/5">
        <form 
          className="max-w-4xl mx-auto relative"
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the weather, travel risks, or forecast..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder:text-slate-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-accent-primary text-white hover:bg-accent-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
