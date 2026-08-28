import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Location } from '../../types';

// Fix Leaflet icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherMapProps {
  center: [number, number];
  zoom?: number;
  location?: Location;
  temperature?: number;
}

// Component to handle map centering when props change
const MapUpdater: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const WeatherMap: React.FC<WeatherMapProps> = ({ center, zoom = 10, location, temperature }) => {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', background: '#0a0e1a' }}
        zoomControl={false}
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={center}>
          <Popup className="dark-popup">
            <div className="p-1">
              <div className="font-bold text-sm">{location?.name || 'Selected Location'}</div>
              {temperature !== undefined && (
                <div className="text-xl font-black text-blue-500 mt-1">{Math.round(temperature)}°C</div>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* CSS override for leaflet popups in dark mode */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #111827;
          color: #f1f5f9;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .leaflet-popup-tip {
          background: #111827;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};
