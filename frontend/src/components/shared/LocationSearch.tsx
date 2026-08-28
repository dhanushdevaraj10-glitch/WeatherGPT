import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { weatherApi } from '../../api/weather';
import { Location } from '../../types';

interface LocationSearchProps {
  onSelect: (location: Location) => void;
  className?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onSelect, className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await weatherApi.searchLocation(query);
        const data = res.data as Location[] | { results?: Location[] };
        if (Array.isArray(data)) {
          setResults(data);
        } else if (Array.isArray(data.results)) {
          setResults(data.results);
        } else {
           setResults([]);
        }
      } catch (err) {
        console.error('Location search failed:', err);
        setResults([]);
        setError('Location search is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search location..."
          className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-secondary animate-spin" size={16} />}
      </div>

      {isOpen && (query.length >= 2) && (
        <div className="absolute z-50 w-full mt-2 bg-dark-card border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto backdrop-blur-md">
          {results.length > 0 ? (
            <ul>
              {results.map((loc, i) => (
                <li
                  key={i}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-white/5 last:border-0 transition-colors"
                  onClick={() => {
                    onSelect(loc);
                    setIsOpen(false);
                    setQuery('');
                  }}
                >
                  <MapPin className="text-slate-400 shrink-0" size={16} />
                  <div>
                    <div className="text-sm font-medium text-white">{loc.name}</div>
                    <div className="text-xs text-slate-400">{loc.region ? `${loc.region}, ` : ''}{loc.country}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : !loading && error ? (
            <div className="px-4 py-3 text-sm text-red-300 text-center">{error}</div>
          ) : !loading && (
            <div className="px-4 py-3 text-sm text-slate-400 text-center">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};
