import React from 'react';
import { CloudRain, Map, TrendingUp, ShieldAlert, ThermometerSun, GitCompare } from 'lucide-react';

interface StarterQuestionsProps {
  onSelect: (question: string) => void;
}

export const StarterQuestions: React.FC<StarterQuestionsProps> = ({ onSelect }) => {
  const questions = [
    { text: "Will it rain today?", icon: CloudRain },
    { text: "Is tomorrow good for travelling?", icon: Map },
    { text: "Why is the temperature so high?", icon: ThermometerSun },
    { text: "Are there any official warnings?", icon: ShieldAlert },
    { text: "Show climate trends for this area", icon: TrendingUp },
    { text: "Compare weather with Mumbai", icon: GitCompare }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
      {questions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(q.text)}
          className="glass-card p-4 flex items-center gap-3 text-left hover:bg-white/10 hover:border-accent-primary/50 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-accent-secondary group-hover:text-accent-primary transition-colors">
            <q.icon size={16} />
          </div>
          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
            {q.text}
          </span>
        </button>
      ))}
    </div>
  );
};
