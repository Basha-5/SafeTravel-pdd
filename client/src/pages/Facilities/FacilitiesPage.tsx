import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Building2,
  PhoneCall,
  Navigation,
  Star,
  Clock,
  MapPin,
  Search,
  ShieldAlert,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { searchGooglePlaces, type RealPlace } from '../../services/realPlacesService';
import toast from 'react-hot-toast';

const CATEGORIES: { id: 'all' | 'police' | 'hospital' | 'restaurant'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Places', icon: '📍' },
  { id: 'police', label: 'Police Stations', icon: '👮' },
  { id: 'hospital', label: 'Hospitals & Trauma', icon: '🏥' },
  { id: 'restaurant', label: 'Restaurants & Dining', icon: '🍽️' },
];

const EMERGENCY_SPEED_DIALS = [
  { name: 'Police Helpline', number: '100', icon: '👮', color: 'bg-blue-600' },
  { name: 'Ambulance / Medical', number: '108', icon: '🚑', color: 'bg-red-600' },
  { name: 'Fire Emergency', number: '101', icon: '🚒', color: 'bg-orange-600' },
  { name: 'Tourist Helpline (24/7)', number: '1363', icon: '🌐', color: 'bg-emerald-600' },
  { name: 'Women Safety Helpline', number: '1091', icon: '🛡️', color: 'bg-purple-600' },
];

const FacilitiesPage = () => {
  const { currentLocation, startTracking } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'police' | 'hospital' | 'restaurant'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [places, setPlaces] = useState<RealPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeLat = currentLocation?.latitude || 13.0895;
  const activeLng = currentLocation?.longitude || 80.2739;

  const loadRealPlaces = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await searchGooglePlaces(null, activeLat, activeLng, selectedCategory, 8000);
      if (res.places && Array.isArray(res.places)) {
        setPlaces(res.places);
      } else {
        setPlaces([]);
      }
    } catch (err) {
      console.error('Error fetching Google Places for facilities:', err);
      toast.error('Failed to load places near GPS');
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeLat, activeLng, selectedCategory]);

  useEffect(() => {
    loadRealPlaces();
  }, [loadRealPlaces]);

  const filteredPlaces = useMemo(() => {
    return places
      .filter((place) => {
        const matchCategory =
          selectedCategory === 'all' || place.type === selectedCategory;
        const matchSearch =
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return a.name.localeCompare(b.name);
      });
  }, [places, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & GPS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-primary-600" />
            Real-Time Verified Nearby Places
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Live Google Places around your GPS location (Police Stations, Hospitals, Restaurants).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              startTracking();
              loadRealPlaces();
            }}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-xl text-xs font-semibold border border-primary-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh GPS Places
          </button>
        </div>
      </div>

      {/* Quick Emergency Speed Dials Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 p-5 rounded-3xl text-white shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <h3 className="font-bold text-sm tracking-wide uppercase text-red-200">
            One-Tap Emergency Direct Hotlines
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {EMERGENCY_SPEED_DIALS.map((dial) => (
            <a
              key={dial.number}
              href={`tel:${dial.number}`}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all hover:scale-105"
            >
              <span className="text-2xl">{dial.icon}</span>
              <div>
                <p className="text-xs text-gray-300 font-medium">{dial.name}</p>
                <p className="text-base font-extrabold text-white">{dial.number}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified places by name or address..."
            className="input-field pl-10 py-2.5 text-xs font-medium"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-field py-2 text-xs font-semibold w-auto bg-gray-50 border-gray-200"
          >
            <option value="distance">Distance (Nearest First)</option>
            <option value="rating">Top Rated ⭐</option>
            <option value="name">Alphabetical (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="card bg-white p-5 animate-pulse border border-gray-100 rounded-3xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-8 bg-gray-100 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Real Places Cards Grid */}
      {!isLoading && filteredPlaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaces.map((place) => {
            const badgeBg =
              place.type === 'police'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : place.type === 'hospital'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-amber-50 text-amber-800 border-amber-200';

            const typeLabel =
              place.type === 'police'
                ? '👮 Police Station'
                : place.type === 'hospital'
                ? '🏥 Hospital'
                : '🍽️ Restaurant';

            return (
              <div
                key={place.id}
                className="card bg-white flex flex-col justify-between hover:border-primary-300 transition-all shadow-sm"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${badgeBg}`}>
                        {typeLabel}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <MapPin className="w-3.5 h-3.5" />
                        {place.distance} km away
                      </span>
                    </div>
                    {place.rating && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {place.rating}
                        {place.user_ratings_total ? (
                          <span className="text-[10px] text-amber-600 font-normal">({place.user_ratings_total})</span>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Place Name & Address */}
                  <h3 className="text-base font-bold text-gray-900 mt-2">{place.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{place.address}</p>

                  {/* Hours & Verification Badge */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{place.opening_hours || (place.is_open ? 'Open Now' : 'Hours vary')}</span>
                    <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Google Verified
                    </span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <a
                    href={`tel:${place.phone || (place.type === 'police' ? '100' : place.type === 'hospital' ? '108' : '')}`}
                    className="flex-1 py-2.5 px-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call
                  </a>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Directions
                  </a>

                  {place.google_maps_url && (
                    <a
                      href={place.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open on Google Maps"
                      className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPlaces.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">No Places Found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            No verified places found in this radius. Click "Refresh GPS Places" to scan around your current location or select another category.
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                loadRealPlaces();
              }}
              className="btn-outline text-xs py-2 px-4"
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                startTracking();
                loadRealPlaces();
              }}
              className="btn-primary text-xs py-2 px-4"
            >
              Re-scan GPS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
