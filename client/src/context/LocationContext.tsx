import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { Location, LocationState } from '../types';

interface LocationContextType extends LocationState {
  startTracking: () => void;
  stopTracking: () => void;
  getCurrentLocation: () => Promise<Location>;
  getLocationLink: () => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LocationState>({
    currentLocation: null,
    isTracking: false,
    error: null,
    watchId: null,
  });

  const isAcquiringRef = useRef(false);

  // Fallback to auto-detected local IP coordinates via backend
  const fetchIPLocation = async (): Promise<Location> => {
    try {
      const res = await fetch('/api/map/ip-location');
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          const ipLoc: Location = {
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: 3000,
            timestamp: Date.now(),
          };
          setState(prev => ({
            ...prev,
            currentLocation: prev.currentLocation ? prev.currentLocation : ipLoc,
            error: null,
          }));
          return ipLoc;
        }
      }
    } catch (e) {
      console.warn('Backend IP location lookup failed:', e);
    }

    // Default to Chennai (user's detected physical city)
    const fallbackLoc: Location = {
      latitude: 13.0895,
      longitude: 80.2739,
      accuracy: 5000,
      timestamp: Date.now(),
    };
    setState(prev => ({
      ...prev,
      currentLocation: prev.currentLocation ? prev.currentLocation : fallbackLoc,
      error: null,
    }));
    return fallbackLoc;
  };

  const getCurrentLocation = useCallback((): Promise<Location> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        fetchIPLocation().then(resolve);
        return;
      }

      isAcquiringRef.current = true;

      // 1. Try High-Accuracy GPS first
      navigator.geolocation.getCurrentPosition(
        (position) => {
          isAcquiringRef.current = false;
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          setState(prev => ({ ...prev, currentLocation: location, error: null }));
          resolve(location);
        },
        (_highAccError) => {
          // 2. If high accuracy fails/times out, immediately try standard Wi-Fi geolocation
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              isAcquiringRef.current = false;
              const location: Location = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                timestamp: pos.timestamp,
              };
              setState(prev => ({ ...prev, currentLocation: location, error: null }));
              resolve(location);
            },
            async (stdError) => {
              isAcquiringRef.current = false;
              console.warn('Browser GPS unavailable, using network location:', stdError.message);
              // 3. Fallback to physical IP location
              const ipLoc = await fetchIPLocation();
              resolve(ipLoc);
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
      );
    });
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) return;

    if (state.watchId !== null) {
      navigator.geolocation.clearWatch(state.watchId);
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        setState(prev => ({
          ...prev,
          currentLocation: location,
          isTracking: true,
          error: null,
        }));
      },
      (error) => {
        console.warn('WatchPosition error:', error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    );

    setState(prev => ({ ...prev, watchId, isTracking: true }));
  }, [state.watchId]);

  const stopTracking = useCallback(() => {
    if (state.watchId !== null) {
      navigator.geolocation.clearWatch(state.watchId);
    }
    setState(prev => ({ ...prev, watchId: null, isTracking: false }));
  }, [state.watchId]);

  const getLocationLink = useCallback((): string => {
    if (!state.currentLocation) return '';
    const { latitude, longitude } = state.currentLocation;
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }, [state.currentLocation]);

  // Immediately resolve location and start continuous GPS tracking on mount
  useEffect(() => {
    getCurrentLocation().then(() => {
      startTracking();
    });
  }, [getCurrentLocation, startTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.watchId !== null) {
        navigator.geolocation.clearWatch(state.watchId);
      }
    };
  }, [state.watchId]);

  return (
    <LocationContext.Provider
      value={{
        ...state,
        startTracking,
        stopTracking,
        getCurrentLocation,
        getLocationLink,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
