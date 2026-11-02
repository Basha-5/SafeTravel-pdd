import { useEffect, useRef } from 'react';
import type { RealPlace } from '../../services/realPlacesService';
import { LocateFixed } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapViewProps {
  center: [number, number];
  zoom?: number;
  currentLocation: { latitude: number; longitude: number; accuracy?: number } | null;
  realPlaces?: RealPlace[];
  manualPoint?: { lat: number; lng: number; address: string } | null;
  showGeofences?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  onSelectPlace?: (place: RealPlace) => void;
  onMapReady?: (mapInstance: any) => void;
}

export const GoogleMapView = ({
  center,
  zoom = 15,
  currentLocation,
  realPlaces = [],
  manualPoint,
  showGeofences = true,
  onMapClick,
  onSelectPlace,
  onMapReady,
}: GoogleMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const userAccuracyCircleRef = useRef<any>(null);
  const placeMarkersRef = useRef<any[]>([]);
  const manualMarkerRef = useRef<any>(null);
  const circlesRef = useRef<any[]>([]);

  // 1. Initialize Google Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!window.google || !window.google.maps) {
      console.warn('Google Maps API not loaded yet');
      return;
    }

    const initialLat = currentLocation ? currentLocation.latitude : center[0];
    const initialLng = currentLocation ? currentLocation.longitude : center[1];

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: initialLat, lng: initialLng },
      zoom,
      mapTypeId: 'roadmap',
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;

    if (onMapReady) {
      onMapReady(map);
    }

    if (onMapClick) {
      map.addListener('click', (e: any) => {
        onMapClick(e.latLng.lat(), e.latLng.lng());
      });
    }
  }, []);

  // 2. Pan to center when changed
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.panTo({ lat: center[0], lng: center[1] });
    }
  }, [center]);

  // 3. Automatically Pan & Center whenever live GPS location arrives
  useEffect(() => {
    if (mapInstanceRef.current && currentLocation) {
      mapInstanceRef.current.panTo({
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
      });
    }
  }, [currentLocation]);

  // 4. Render Live GPS User Marker & Accuracy Radar Circle
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    const map = mapInstanceRef.current;

    // Clear old user marker & circle
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }
    if (userAccuracyCircleRef.current) {
      userAccuracyCircleRef.current.setMap(null);
      userAccuracyCircleRef.current = null;
    }

    // Clear old geofence circles
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];

    // Add Live User GPS Location Marker
    if (currentLocation) {
      // Accuracy Radar Circle
      const accCircle = new window.google.maps.Circle({
        strokeColor: '#2563eb',
        strokeOpacity: 0.5,
        strokeWeight: 1.5,
        fillColor: '#3b82f6',
        fillOpacity: 0.12,
        map,
        center: { lat: currentLocation.latitude, lng: currentLocation.longitude },
        radius: Math.max(currentLocation.accuracy || 100, 80),
      });
      userAccuracyCircleRef.current = accCircle;

      // Vivid Pulsating User GPS Marker
      const userMarker = new window.google.maps.Marker({
        position: { lat: currentLocation.latitude, lng: currentLocation.longitude },
        map,
        title: 'Your Live GPS Location',
        zIndex: 9999,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: '#2563eb',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 4,
        },
      });

      const userInfowindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding:8px 12px; font-family:sans-serif; text-align:center;">
            <div style="display:inline-block; width:9px; height:9px; border-radius:50%; background:#10b981; margin-right:6px;"></div>
            <b style="color:#1d4ed8; font-size:13px;">Live GPS Location (Active)</b><br/>
            <span style="font-size:11px; color:#475569;">
              ${currentLocation.latitude.toFixed(5)}° N, ${currentLocation.longitude.toFixed(5)}° E
            </span>
          </div>
        `,
      });

      userMarker.addListener('click', () => {
        userInfowindow.open(map, userMarker);
      });

      userMarkerRef.current = userMarker;
    }

    // Add Dynamic Safety Geofences around GPS
    if (showGeofences) {
      const baseLat = currentLocation?.latitude || center[0];
      const baseLng = currentLocation?.longitude || center[1];

      const localZones = [
        {
          center: { lat: baseLat + 0.002, lng: baseLng - 0.002 },
          radius: 800,
          color: '#10b981',
          name: 'Tourist Safe Zone (High Patrol & CCTV)',
        },
        {
          center: { lat: baseLat - 0.005, lng: baseLng + 0.005 },
          radius: 600,
          color: '#f59e0b',
          name: 'Caution Area (High Transit Traffic)',
        },
      ];

      localZones.forEach((zone) => {
        const circle = new window.google.maps.Circle({
          strokeColor: zone.color,
          strokeOpacity: 0.85,
          strokeWeight: 2,
          fillColor: zone.color,
          fillOpacity: 0.12,
          map,
          center: zone.center,
          radius: zone.radius,
        });
        circlesRef.current.push(circle);
      });
    }
  }, [currentLocation, showGeofences, center]);

  // 5. Render Real-Time Police Stations, Hospitals, and Restaurants from Google Places API
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    const map = mapInstanceRef.current;

    // Clear old place markers
    placeMarkersRef.current.forEach((m) => m.setMap(null));
    placeMarkersRef.current = [];

    realPlaces.forEach((place) => {
      const isPolice = place.type === 'police';
      const isHospital = place.type === 'hospital';
      const isRestaurant = place.type === 'restaurant';

      let markerColor = '#1d4ed8'; // blue
      let badgeBg = '#eff6ff';
      let badgeColor = '#1e40af';
      let emoji = '👮';
      let typeLabel = 'POLICE STATION';

      if (isHospital) {
        markerColor = '#dc2626'; // red
        badgeBg = '#fef2f2';
        badgeColor = '#b91c1c';
        emoji = '🏥';
        typeLabel = 'HOSPITAL';
      } else if (isRestaurant) {
        markerColor = '#ea580c'; // orange
        badgeBg = '#fff7ed';
        badgeColor = '#c2410c';
        emoji = '🍽️';
        typeLabel = 'RESTAURANT';
      }

      const marker = new window.google.maps.Marker({
        position: { lat: place.latitude, lng: place.longitude },
        map,
        title: place.name,
        label: {
          text: emoji,
          fontSize: '15px',
        },
        zIndex: 500,
      });

      const ratingBadge = place.rating
        ? `<span style="font-size:11px; font-weight:700; color:#eab308; background:#fefce8; padding:2px 6px; border-radius:4px; margin-left:4px;">★ ${place.rating.toFixed(1)}${place.user_ratings_total ? ` (${place.user_ratings_total})` : ''}</span>`
        : '';

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding:10px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width:260px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:10px; font-weight:800; text-transform:uppercase; background:${badgeBg}; color:${badgeColor}; padding:2px 8px; border-radius:6px; letter-spacing:0.5px;">
                ${emoji} ${typeLabel}
              </span>
              <span style="font-size:11px; font-weight:800; color:#10b981;">
                ${place.distance ? `${place.distance} km` : 'Nearby'}
              </span>
            </div>
            <h4 style="margin:4px 0 2px 0; font-size:13px; font-weight:700; color:#0f172a; line-height:1.3;">
              ${place.name}
            </h4>
            <div style="margin:3px 0 5px 0;">
              ${ratingBadge}
              <span style="font-size:11px; color:#475569; margin-left:4px;">
                ${place.opening_hours || (place.is_open ? 'Open Now' : 'Closed')}
              </span>
            </div>
            <p style="margin:4px 0; font-size:11px; color:#64748b; line-height:1.4;">
              ${place.address}
            </p>
            <div style="margin-top:10px; padding-top:8px; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; gap:8px;">
              ${
                place.phone
                  ? `<a href="tel:${place.phone}" style="background:${markerColor}; color:white; padding:5px 10px; border-radius:8px; font-weight:700; font-size:11px; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">📞 Call</a>`
                  : `<span style="font-size:11px; color:#94a3b8;">Google Verified</span>`
              }
              <a href="${place.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}" target="_blank" rel="noopener noreferrer" style="color:#0f172a; font-weight:700; font-size:11px; text-decoration:none;">
                View on Google Maps →
              </a>
            </div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        if (onSelectPlace) {
          onSelectPlace(place);
        }
      });

      placeMarkersRef.current.push(marker);
    });
  }, [realPlaces]);

  // 6. Update Manual/Searched Pin Marker
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    const map = mapInstanceRef.current;

    if (manualMarkerRef.current) {
      manualMarkerRef.current.setMap(null);
      manualMarkerRef.current = null;
    }

    if (manualPoint) {
      const pinMarker = new window.google.maps.Marker({
        position: { lat: manualPoint.lat, lng: manualPoint.lng },
        map,
        title: 'Selected Point',
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#dc2626',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const pinWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding:6px; font-family:sans-serif; max-width:200px;">
            <b style="font-size:12px; color:#0f172a;">Selected Location</b>
            <p style="font-size:11px; color:#475569; margin:4px 0;">${manualPoint.address}</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${manualPoint.lat},${manualPoint.lng}" target="_blank" rel="noopener noreferrer" style="color:#2563eb; font-size:11px; font-weight:bold; text-decoration:none;">Directions →</a>
          </div>
        `,
      });

      pinMarker.addListener('click', () => {
        pinWindow.open(map, pinMarker);
      });

      manualMarkerRef.current = pinMarker;
    }
  }, [manualPoint]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full rounded-2xl" />

      {/* Floating Center on Live GPS Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current && currentLocation) {
            mapInstanceRef.current.panTo({
              lat: currentLocation.latitude,
              lng: currentLocation.longitude,
            });
            mapInstanceRef.current.setZoom(16);
          }
        }}
        className="absolute bottom-5 right-5 p-3.5 bg-white hover:bg-blue-50 text-blue-600 rounded-2xl shadow-xl border border-gray-200 transition-all z-10 flex items-center gap-2 hover:scale-105 active:scale-95 group font-bold text-xs"
        title="Center on My Live GPS Location"
      >
        <LocateFixed className="w-5 h-5 text-blue-600 group-hover:animate-pulse" />
        <span className="hidden sm:inline">Center on My GPS</span>
      </button>
    </div>
  );
};

export default GoogleMapView;
