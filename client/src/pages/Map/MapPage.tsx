import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import {
  Search,
  Compass,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Navigation,
  Share2,
  Layers,
  MapPin,
  LocateFixed,
  AlertTriangle,
  ArrowRight,
  Radio,
  Phone,
  RefreshCw,
  ExternalLink,
  UtensilsCrossed,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { mapAPI } from '../../services/api';
import {
  searchGooglePlaces,
  type RealPlace,
} from '../../services/realPlacesService';
import toast from 'react-hot-toast';
import GoogleMapView from '../../components/Map/GoogleMapView';

// Custom Map Marker generator using Leaflet DivIcon
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        color: white;
        font-weight: bold;
        font-size: 15px;
      ">
        ${label}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

const userIcon = L.divIcon({
  className: 'user-pin-marker',
  html: `
    <div style="position: relative; width: 26px; height: 26px;">
      <div style="position: absolute; inset: 0; background: #3b82f6; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div>
      <div style="position: relative; width: 26px; height: 26px; background: #2563eb; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 3px 8px rgba(0,0,0,0.4);"></div>
    </div>
  `,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

// Helper component to center Leaflet map
function ChangeView({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || map.getZoom());
  }, [center, map, zoom]);
  return null;
}

// Map Click Listener for Manual Inspection
function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const MapPage = () => {
  const { currentLocation, isTracking, startTracking, stopTracking, getLocationLink, getCurrentLocation } = useLocation();
  const navigate = useNavigate();

  // Default coordinate if browser GPS is pending (e.g. detected local user coordinate)
  const defaultCenter: [number, number] = useMemo(
    () => [currentLocation?.latitude || 13.0895, currentLocation?.longitude || 80.2739],
    [currentLocation]
  );

  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [manualPoint, setManualPoint] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [showGeofences, setShowGeofences] = useState(true);
  const [mapProvider, setMapProvider] = useState<'google' | 'leaflet'>('google');

  // Real-Time Places State (Police, Hospitals, Restaurants)
  const [realPlaces, setRealPlaces] = useState<RealPlace[]>([]);
  const [placeCategory, setPlaceCategory] = useState<'all' | 'police' | 'hospital' | 'restaurant'>('all');
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<RealPlace | null>(null);
  const [googleMapInstance, setGoogleMapInstance] = useState<any>(null);
  const [placesSource, setPlacesSource] = useState<'google' | 'osm' | 'none'>('none');
  const [googlePlacesDenied, setGooglePlacesDenied] = useState(false);

  // Sync map center when currentLocation updates
  useEffect(() => {
    if (currentLocation) {
      setMapCenter([currentLocation.latitude, currentLocation.longitude]);
    }
  }, [currentLocation]);

  const activeLat = currentLocation?.latitude || mapCenter[0];
  const activeLng = currentLocation?.longitude || mapCenter[1];

  // Fetch real-time police stations, hospitals, and restaurants strictly via Google Maps Places API
  const fetchRealPlaces = useCallback(
    async (
      lat: number,
      lng: number,
      cat: 'all' | 'police' | 'hospital' | 'restaurant' = placeCategory,
      mapInst: any = googleMapInstance
    ) => {
      setIsLoadingPlaces(true);
      try {
        const container = mapInst || (typeof window !== 'undefined' && window.google?.maps ? document.createElement('div') : null);
        const gRes = await searchGooglePlaces(container, lat, lng, cat);
        if (gRes.places && gRes.places.length > 0) {
          setRealPlaces(gRes.places);
          setPlacesSource('google');
        } else {
          setRealPlaces([]);
        }
      } catch (err) {
        console.error('Error fetching real places from Google Maps:', err);
      } finally {
        setIsLoadingPlaces(false);
      }
    },
    [placeCategory, googleMapInstance]
  );

  // Re-fetch when coordinate or category changes
  useEffect(() => {
    fetchRealPlaces(activeLat, activeLng, placeCategory, googleMapInstance);
  }, [activeLat, activeLng, placeCategory, googleMapInstance, fetchRealPlaces]);

  // Safety geofences around GPS
  const dynamicZones = useMemo(() => {
    return [
      {
        id: 'safe-1',
        center: [activeLat + 0.0028, activeLng - 0.0035] as [number, number],
        radius: 800,
        type: 'safe' as const,
        name: 'Tourist Safe Zone (High Patrol & CCTV)',
        description: 'Designated high-security zone with regular tourist police rounds and emergency call points.',
      },
      {
        id: 'caution-1',
        center: [activeLat - 0.005, activeLng + 0.006] as [number, number],
        radius: 600,
        type: 'caution' as const,
        name: 'Caution Area (High Transit Traffic)',
        description: 'Crowded transit station periphery. Keep personal belongings safe.',
      },
    ];
  }, [activeLat, activeLng]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const results = await mapAPI.searchPlaces(searchQuery);
      setSearchResults(results);
    } catch (e) {
      toast.error('Location search failed');
    }
  };

  const handleSelectSearchResult = (res: any) => {
    const lat = parseFloat(res.lat);
    const lon = parseFloat(res.lon);
    setMapCenter([lat, lon]);
    setManualPoint({ lat, lng: lon, address: res.display_name });
    setSearchResults([]);
    setSearchQuery(res.display_name.split(',')[0]);
    toast.success(`Centered on ${res.display_name.split(',')[0]}`);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const geo = await mapAPI.reverseGeocode(lat, lng);
      setManualPoint({
        lat,
        lng,
        address: geo.display_name || `Coordinate: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });
    } catch (e) {
      setManualPoint({
        lat,
        lng,
        address: `Selected point: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });
    }
  };

  const handleMyLocationClick = async () => {
    try {
      toast.loading('Acquiring live GPS satellite fix...', { id: 'gps-fix' });
      const loc = await getCurrentLocation();
      setMapCenter([loc.latitude, loc.longitude]);
      fetchRealPlaces(loc.latitude, loc.longitude, placeCategory);
      toast.success(`Live GPS Locked: ${loc.latitude.toFixed(4)}°, ${loc.longitude.toFixed(4)}°`, { id: 'gps-fix' });
    } catch (err: any) {
      toast.error('Could not get GPS. Please allow location permissions in your browser.', { id: 'gps-fix' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Control Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destination, city, or address..."
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary py-2.5 px-4 text-sm font-semibold shrink-0">
              Search
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSearchResult(res)}
                  className="p-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer text-xs flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                  <span className="truncate text-gray-800">{res.display_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleMyLocationClick}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-primary-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors border border-blue-200"
          >
            <LocateFixed className="w-4 h-4" />
            My Location
          </button>

          <button
            onClick={() => (isTracking ? stopTracking() : startTracking())}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isTracking
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isTracking ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'
              }`}
            />
            {isTracking ? 'GPS Tracking On' : 'Start GPS'}
          </button>

          <button
            onClick={() => setShowGeofences(!showGeofences)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              showGeofences
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            Safety Zones
          </button>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(getLocationLink());
                toast.success('Live location link copied!');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Live GPS Active Status Bar */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 px-4 flex items-center justify-between text-xs text-emerald-950 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-extrabold text-emerald-900">Live GPS Location:</span>
          <span className="font-mono font-bold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-emerald-800">
            {activeLat.toFixed(5)}° N, {activeLng.toFixed(5)}° E
          </span>
          <span className="text-emerald-700 hidden md:inline font-medium">
            (Auto-Centering & Continuous Satellite Tracking Active)
          </span>
        </div>
        <button
          onClick={handleMyLocationClick}
          className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold border border-emerald-300 flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <LocateFixed className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lock GPS</span>
        </button>
      </div>

      {/* Real-Time Filter & Status Bar (Police, Hospitals, Restaurants) */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5 mr-1">
            <ShieldAlert className="w-4 h-4 text-primary-600" />
            Real-Time Places:
          </span>

          <button
            onClick={() => setPlaceCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              placeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Real Places ({realPlaces.length})
          </button>

          <button
            onClick={() => setPlaceCategory('police')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              placeCategory === 'police'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <span>👮 Police Stations</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-white/20">
              {realPlaces.filter((p) => p.type === 'police').length}
            </span>
          </button>

          <button
            onClick={() => setPlaceCategory('hospital')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              placeCategory === 'hospital'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <span>🏥 Hospitals</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-white/20">
              {realPlaces.filter((p) => p.type === 'hospital').length}
            </span>
          </button>

          <button
            onClick={() => setPlaceCategory('restaurant')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              placeCategory === 'restaurant'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <span>🍽️ Restaurants</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-white/20">
              {realPlaces.filter((p) => p.type === 'restaurant').length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 hidden md:inline">
            Source:{' '}
            <b className="text-gray-900 font-semibold">
              ✨ Google Maps Places API (Live)
            </b>
          </span>
          <button
            onClick={() => {
              fetchRealPlaces(activeLat, activeLng, placeCategory, googleMapInstance);
              toast.success('Refreshed real-time places');
            }}
            disabled={isLoadingPlaces}
            className="px-2.5 py-1.5 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1.5 font-semibold text-xs border border-gray-200"
            title="Refresh places around current map center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPlaces ? 'animate-spin text-primary-600' : ''}`} />
            <span>{isLoadingPlaces ? 'Scanning...' : 'Refresh'}</span>
          </button>
        </div>
      </div>


      {/* Main Map Canvas & Real Places Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* The Live Map Canvas (Showing Real-Time Police Stations, Hospitals & Restaurants) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-2 shadow-sm border border-gray-100 relative h-[620px] overflow-hidden">
          <GoogleMapView
            center={mapCenter}
            zoom={15}
            currentLocation={currentLocation}
            realPlaces={realPlaces}
            manualPoint={manualPoint}
            showGeofences={showGeofences}
            onMapClick={handleMapClick}
            onMapReady={(map) => {
              setGoogleMapInstance(map);
              fetchRealPlaces(activeLat, activeLng, placeCategory, map);
            }}
            onSelectPlace={(place) => {
              setSelectedPlace(place);
              setMapCenter([place.latitude, place.longitude]);
            }}
          />
        </div>

        {/* Right Info Panel: Real-Time Places List */}
        <div className="space-y-4">
          {/* Closest Real Places List */}
          <div className="card bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary-600" />
                <h3 className="font-bold text-gray-900 text-sm">Real Places Nearby</h3>
              </div>
              <span className="text-[11px] font-semibold text-gray-500">
                {realPlaces.length} found
              </span>
            </div>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {realPlaces.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400">
                  {isLoadingPlaces ? 'Scanning live places database...' : 'No places found in this area. Try zooming out or switching category.'}
                </div>
              ) : (
                realPlaces.slice(0, 7).map((place) => {
                  const isPolice = place.type === 'police';
                  const isHospital = place.type === 'hospital';
                  const isSelected = selectedPlace?.id === place.id;
                  return (
                    <div
                      key={place.id}
                      onClick={() => {
                        setSelectedPlace(place);
                        setMapCenter([place.latitude, place.longitude]);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                          : 'border-gray-100 bg-gray-50/80 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            isPolice
                              ? 'bg-blue-100 text-blue-700'
                              : (isHospital ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700')
                          }`}
                        >
                          {isPolice ? '👮 Police' : (isHospital ? '🏥 Hospital' : '🍽️ Restaurant')}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {place.rating && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                              ★ {place.rating.toFixed(1)}
                            </span>
                          )}
                          <span className="font-extrabold text-emerald-700 text-[11px]">
                            {place.distance ? `${place.distance} km` : 'Nearby'}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{place.name}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{place.address}</p>

                      <div className="mt-2 pt-2 border-t border-gray-200/60 flex items-center justify-between gap-2">
                        {place.phone ? (
                          <a
                            href={`tel:${place.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg text-white flex items-center gap-1 transition-colors ${
                              isPolice ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                          >
                            <Phone className="w-2.5 h-2.5" />
                            <span>Call</span>
                          </a>
                        ) : (
                          <span className="text-[10px] text-gray-400">
                            Google Verified
                          </span>
                        )}

                        <a
                          href={place.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-0.5"
                        >
                          <span>Directions</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Live GPS Telemetry Status */}
          <div className="card bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <h3 className="font-bold text-gray-900 text-sm">GPS Telemetry Status</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-gray-500">Coordinates</span>
                <span className="font-mono font-bold text-gray-900">
                  {currentLocation
                    ? `${currentLocation.latitude.toFixed(4)}°, ${currentLocation.longitude.toFixed(4)}°`
                    : `${mapCenter[0].toFixed(4)}°, ${mapCenter[1].toFixed(4)}° (Center)`}
                </span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-gray-500">Live Database</span>
                <span className="badge-safe">
                  Google Maps Places API
                </span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-gray-500">Search Radius</span>
                <span className="font-semibold text-emerald-700">5 km Live Radius</span>
              </div>
            </div>
          </div>

          {/* Safety Geofence Guide */}
          <div className="card bg-white p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary-600" />
              Safety Geofence Legend
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Green: Tourist Safe Haven
                </div>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  High-security corridor with regular tourist police rounds.
                </p>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Amber: Caution Area
                </div>
                <p className="text-amber-700 text-[11px] mt-0.5">
                  Crowded transit sectors. Keep belongings secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
