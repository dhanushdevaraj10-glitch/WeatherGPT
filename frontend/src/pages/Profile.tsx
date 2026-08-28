import React from 'react';
import { useAppContext } from '../store/appStore';
import { User, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { userProfile } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    dispatch({ 
      type: 'UPDATE_PROFILE', 
      payload: { [e.target.name]: e.target.value } 
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-2">Digital Twin Profile</h1>
      <p className="text-slate-400 mb-8">Personalize your AI weather recommendations.</p>

      <div className="glass-card p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center text-accent-primary">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
            <div className="text-sm text-slate-400">{userProfile.category} Profile</div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Name</label>
              <input 
                name="name"
                type="text" 
                value={userProfile.name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent-primary" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Profile Category</label>
              <select 
                name="category"
                value={userProfile.category}
                onChange={handleChange}
                className="w-full bg-[#111827] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent-primary"
              >
                <option value="General">General</option>
                <option value="Farmer">Farmer</option>
                <option value="Traveller">Traveller</option>
                <option value="Commuter">Daily Commuter</option>
                <option value="Outdoor Worker">Outdoor Worker</option>
              </select>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-accent-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-primary/80 transition-colors">
            <Save size={18} /> Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};
