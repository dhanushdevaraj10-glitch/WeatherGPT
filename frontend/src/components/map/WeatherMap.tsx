import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Location } from '../../types';
import { Layers } from 'lucide-react';

interface WeatherMapProps {
  center: [number, number];
  zoom?: number;
  location?: Location;
  temperature?: number;
  weatherDescription?: string;
  rainProbability?: number;
  windSpeed?: number;
  riskLevel?: string;
  onMapClick?: (lat: number, lon: number) => void;
  interactive?: boolean;
}

// Custom modern SVG marker with live temperature badge and glowing pulse
const createMarkerIcon = (temp?: number) => {
  const tempStr = temp !== undefined ? `${Math.round(temp)}°` : '📍';
  return L.divIcon({
    className: 'custom-weather-pin',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
          font-weight: 800;
          font-size: 13px;
          padding: 4px 9px;
          border-radius: 9999px;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.6), 0 0 0 2px rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        ">
          <span style="font-size: 14px;">⚡</span>
          <span>${tempStr}</span>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid #06b6d4;
          margin-top: -1px;
        "></div>
        <div style="
          width: 8px;
          height: 8px;
          background: #38bdf8;
          border-radius: 50%;
          box-shadow: 0 0 10px #38bdf8;
          margin-top: -3px;
        "></div>
      </div>
    `,
    iconSize: [60, 42],
    iconAnchor: [30, 38],
    popupAnchor: [0, -36],
  });
};

// Component to handle map centering and tile invalidation
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [center, zoom, map]);
  return null;
};

// Handle clicks on map
const MapClickHandler: React.FC<{ onMapClick?: (lat: number, lon: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

export const WeatherMap: React.FC<WeatherMapProps> = ({ 
  center, 
  zoom = 10, 
  location, 
  temperature,
  weatherDescription,
  rainProbability,
  windSpeed,
  riskLevel,
  onMapClick,
  interactive = true
}) => {
  const [mapStyle, setMapStyle] = useState<'dark' | 'standard' | 'satellite'>('dark');

  const tileUrls = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  const attributions = {
    dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    standard: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    satellite: '&copy; Esri, Maxar, Earthstar Geographics',
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative z-0">
      {/* Map Layer Switcher Button */}
      {interactive && (
        <div className="absolute top-3 left-3 z-[400] flex items-center bg-dark-bg/80 backdrop-blur-md border border-white/10 rounded-xl p-1 gap-1 text-xs">
          <Layers size={14} className="text-slate-400 ml-1 mr-0.5" />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setMapStyle('dark'); }}
            className={`px-2 py-1 rounded-lg transition-all ${mapStyle === 'dark' ? 'bg-accent-primary text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Dark
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setMapStyle('standard'); }}
            className={`px-2 py-1 rounded-lg transition-all ${mapStyle === 'standard' ? 'bg-accent-primary text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Street
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setMapStyle('satellite'); }}
            className={`px-2 py-1 rounded-lg transition-all ${mapStyle === 'satellite' ? 'bg-accent-primary text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Satellite
          </button>
        </div>
      )}

      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', background: '#0a0e1a' }}
        zoomControl={false}
      >
        <MapUpdater center={center} zoom={zoom} />
        {interactive && <MapClickHandler onMapClick={onMapClick} />}
        
        <TileLayer
          key={mapStyle}
          attribution={attributions[mapStyle]}
          url={tileUrls[mapStyle]}
          subdomains={mapStyle === 'dark' ? 'abcd' : 'abc'}
          maxZoom={19}
        />
        
        <Marker position={center} icon={createMarkerIcon(temperature)}>
          <Popup className="dark-popup">
            <div className="p-2 min-w-[170px]">
              <div className="font-bold text-sm text-white flex items-center justify-between">
                <span>{location?.name || 'Selected Location'}</span>
                {riskLevel && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    riskLevel === 'SEVERE' ? 'bg-red-500/30 text-red-400' :
                    riskLevel === 'HIGH' ? 'bg-orange-500/30 text-orange-400' :
                    riskLevel === 'MODERATE' ? 'bg-yellow-500/30 text-yellow-400' :
                    'bg-emerald-500/30 text-emerald-400'
                  }`}>
                    {riskLevel}
                  </span>
                )}
              </div>
              
              {location?.region || location?.country ? (
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {[location.region, location.country].filter(Boolean).join(', ')}
                </div>
              ) : null}

              {temperature !== undefined && (
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-blue-400">{Math.round(temperature)}°C</span>
                  {weatherDescription && (
                    <span className="text-xs text-slate-300 capitalize">{weatherDescription}</span>
                  )}
                </div>
              )}

              {(rainProbability !== undefined || windSpeed !== undefined) && (
                <div className="mt-2 pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  {rainProbability !== undefined && (
                    <div>Rain: <span className="font-semibold text-blue-300">{Math.round(rainProbability)}%</span></div>
                  )}
                  {windSpeed !== undefined && (
                    <div>Wind: <span className="font-semibold text-slate-200">{Math.round(windSpeed)} km/h</span></div>
                  )}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* CSS override for leaflet popups in dark mode */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          color: #f1f5f9 !important;
          border-radius: 14px !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7) !important;
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #94a3b8 !important;
          padding: 6px !important;
        }
        .leaflet-container a.leaflet-popup-close-button:hover {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};
