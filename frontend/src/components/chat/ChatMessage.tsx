import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-4 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1 ${
          isUser ? 'bg-slate-700 text-slate-300' : 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/20'
        }`}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
            isUser 
              ? 'bg-accent-primary text-white rounded-tr-sm' 
              : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm shadow-xl'
          }`}>
            {message.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < message.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
            
            {/* Keep the compact weather card for a direct current-conditions answer only. */}
            {message.weather_data && message.intent === 'CURRENT_WEATHER' && (
              <div className="mt-4 p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-4">
                <div className="text-3xl font-bold">{Math.round(message.weather_data.temperature)}°</div>
                <div>
                  <div className="font-medium text-white">{message.weather_data.weather_description}</div>
                  <div className="text-xs text-slate-400">Rain: {message.weather_data.precip_probability}% • Wind: {message.weather_data.wind_speed} km/h</div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};
