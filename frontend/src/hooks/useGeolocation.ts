import { useState, useCallback } from 'react';
import { Location } from '../types';
import { weatherApi } from '../api/weather';

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resolveLocationName = async (lat: number, lon: number): Promise<Location> => {
    // 1. Try Backend reverse geocode
    try {
      const res = await weatherApi.reverseGeocode(lat, lon);
      if (res.data && res.data.name && !res.data.name.startsWith('Location (')) {
        return {
          name: res.data.name,
          country: res.data.country || '',
          region: res.data.region || '',
          latitude: lat,
          longitude: lon,
          timezone: res.data.timezone || 'UTC',
          elevation: res.data.elevation || 0,
        };
      }
    } catch {
      // Backend not reached or reverse endpoint error
    }

    // 2. Client-side fallback to free BigDataCloud reverse geocode
    try {
      const resp = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      if (resp.ok) {
        const data = await resp.json();
        const name = data.city || data.locality || data.principalSubdivision || data.countryName;
        if (name) {
          return {
            name,
            country: data.countryName || '',
            region: data.principalSubdivision || '',
            latitude: lat,
            longitude: lon,
            timezone: 'UTC',
            elevation: 0,
          };
        }
      }
    } catch {
      // Network issue
    }

    // 3. Guaranteed fallback with coordinates
    return {
      name: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
      country: '',
      region: 'Current Coordinates',
      latitude: lat,
      longitude: lon,
      timezone: 'UTC',
      elevation: 0,
    };
  };

  const fetchIPLocationFallback = async (): Promise<Location | null> => {
    try {
      const resp = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
      if (resp.ok) {
        const data = await resp.json();
        const lat = data.latitude;
        const lon = data.longitude;
        if (typeof lat === 'number' && typeof lon === 'number') {
          return {
            name: data.city || data.locality || data.principalSubdivision || 'My Location',
            country: data.countryName || '',
            region: data.principalSubdivision || '',
            latitude: lat,
            longitude: lon,
            timezone: 'UTC',
            elevation: 0,
          };
        }
      }
    } catch {
      // IP lookup failed
    }
    return null;
  };

  const getLocation = useCallback((onSuccess?: (loc: Location) => void) => {
    setLoading(true);
    setError(null);

    const handleSuccessCoords = async (lat: number, lon: number) => {
      try {
        const fullLoc = await resolveLocationName(lat, lon);
        setLocation(fullLoc);
        onSuccess?.(fullLoc);
      } catch (err: any) {
        const fallbackLoc: Location = {
          name: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
          country: '',
          region: '',
          latitude: lat,
          longitude: lon,
          timezone: 'UTC',
          elevation: 0,
        };
        setLocation(fallbackLoc);
        onSuccess?.(fallbackLoc);
      } finally {
        setLoading(false);
      }
    };

    const handleFallbackIP = async (msg: string) => {
      try {
        const ipLoc = await fetchIPLocationFallback();
        if (ipLoc) {
          setLocation(ipLoc);
          onSuccess?.(ipLoc);
          setError(null);
          return;
        }
      } catch {}
      setError(msg);
      setLoading(false);
    };

    if (!navigator.geolocation) {
      handleFallbackIP('Browser GPS not supported. Using IP location fallback.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleSuccessCoords(position.coords.latitude, position.coords.longitude);
      },
      (_err) => {
        // High accuracy might have timed out or failed; try low accuracy once
        navigator.geolocation.getCurrentPosition(
          (position) => {
            handleSuccessCoords(position.coords.latitude, position.coords.longitude);
          },
          (err2) => {
            // Both failed or permission denied -> fallback to IP geolocation!
            handleFallbackIP(err2.message || 'Unable to retrieve GPS location');
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 120000 }
        );
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
    );
  }, []);

  return { getLocation, location, loading, error };
}
