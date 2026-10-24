import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { weatherApi } from '../../api/weather';
import { Location } from '../../types';

interface LocationSearchProps {
  onSelect: (location: Location) => void;
  className?: string;
  placeholder?: string;
  onUseLocation?: () => void;
  isLocating?: boolean;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onSelect, 
  className = '', 
  placeholder = 'Search city, town, or coordinates...',
  onUseLocation,
  isLocating = false
}) => {
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
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await weatherApi.searchLocation(query.trim());
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
        setError('Location search temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all backdrop-blur-md"
        />
        {loading && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-accent-secondary animate-spin" size={16} />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#0c1222] border border-white/15 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto backdrop-blur-xl">
          {onUseLocation && (
            <button
              type="button"
              onClick={() => {
                onUseLocation();
                setIsOpen(false);
              }}
              disabled={isLocating}
              className="w-full px-4 py-3 hover:bg-white/10 cursor-pointer flex items-center gap-3 border-b border-white/10 text-left transition-colors text-accent-secondary font-medium text-sm group"
            >
              {isLocating ? (
                <Loader2 className="animate-spin text-accent-primary shrink-0" size={16} />
              ) : (
                <Navigation className="text-accent-secondary group-hover:scale-110 transition-transform shrink-0" size={16} />
              )}
              <div>
                <div className="text-sm font-semibold text-white">Use Current Location</div>
                <div className="text-xs text-slate-400">Detect GPS / local weather automatically</div>
              </div>
            </button>
          )}

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
                    <div className="text-xs text-slate-400">
                      {loc.region ? `${loc.region}, ` : ''}{loc.country}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : !loading && query.length >= 2 ? (
            <div className="px-4 py-4 text-sm text-slate-400 text-center">
              {error || 'No matching locations found'}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
