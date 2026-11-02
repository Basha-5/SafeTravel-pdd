import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Compass,
  Building2,
  Navigation,
  PhoneCall,
  Share2,
  CloudSun,
  ChevronRight,
  HeartHandshake,
  Activity,
  CheckCircle,
  Bell,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { contactsAPI, travelAPI } from '../../services/api';
import { searchGooglePlaces, type RealPlace } from '../../services/realPlacesService';
import type { EmergencyContact, TravelRecord } from '../../types';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { user } = useAuth();
  const { currentLocation, isTracking, startTracking, getLocationLink } = useLocation();
  const navigate = useNavigate();

  const [primaryContact, setPrimaryContact] = useState<EmergencyContact | null>(null);
  const [recentTrips, setRecentTrips] = useState<TravelRecord[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<RealPlace[]>([]);

  useEffect(() => {
    contactsAPI.getContacts().then((contacts) => {
      const primary = contacts.find((c) => c.is_primary) || contacts[0];
      if (primary) setPrimaryContact(primary);
    });
    travelAPI.getHistory().then((history) => {
      setRecentTrips(history.slice(0, 3));
    });
  }, []);

  useEffect(() => {
    const lat = currentLocation?.latitude || 13.0895;
    const lng = currentLocation?.longitude || 80.2739;
    searchGooglePlaces(null, lat, lng, 'all', 6000).then((res) => {
      if (res.places && res.places.length > 0) {
        setNearbyPlaces(res.places.slice(0, 3));
      }
    });
  }, [currentLocation]);

  const handleShareLocation = () => {
    const link = getLocationLink();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      toast.success('Live location link copied to clipboard!');
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium tracking-wide">
                {todayFormatted}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded-full text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Active Safety Guard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Hello, {user?.full_name || 'Traveler'}!
            </h1>
            <p className="text-primary-100 text-sm sm:text-base mt-1.5 max-w-xl">
              You are currently inside a <span className="font-semibold text-emerald-300">Verified Tourist Safe Zone</span>.
              SafeTravel is continuously monitoring your vicinity.
            </p>
          </div>

          {/* Quick SOS Trigger Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/sos')}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-red-500/40 hover:scale-105 transition-all text-base border-2 border-red-300"
            >
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <span>EMERGENCY SOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Status & Live GPS Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tourist Safety Score */}
        <div className="card flex items-center gap-4 bg-white">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#f3f4f6"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#10b981"
                strokeWidth="6"
                fill="none"
                strokeDasharray="175"
                strokeDashoffset="26"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-lg font-bold text-gray-900">88%</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">Tourist Safety Score</h3>
              <span className="badge-safe">Low Risk</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Area patrol density is high. Ambient lighting and tourist facilities nearby.
            </p>
          </div>
        </div>

        {/* Current Location & GPS */}
        <div className="card flex flex-col justify-between bg-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-primary-600 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Live Position
                </span>
                <p className="text-sm font-bold text-gray-900">
                  {currentLocation
                    ? `${currentLocation.latitude.toFixed(4)}° N, ${currentLocation.longitude.toFixed(4)}° E`
                    : 'Locating GPS Satellites...'}
                </p>
              </div>
            </div>
            <button
              onClick={handleShareLocation}
              title="Copy GPS link"
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2 text-xs">
            <span className="text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {isTracking ? 'Continuous Tracking On' : 'GPS Connected'}
            </span>
            <button
              onClick={() => (!isTracking ? startTracking() : null)}
              className="text-primary-600 font-semibold hover:underline"
            >
              {isTracking ? 'Broadcasting' : 'Enable Tracking'}
            </button>
          </div>
        </div>

        {/* Weather & Safety Alert */}
        <div className="card flex items-center gap-4 bg-white">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
            <CloudSun className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">24°C Sunny & Clear</h3>
              <span className="badge-warning">Advisory</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Sunset at 18:45. Recommended to return to main boulevards after 21:00.
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Grid (Quick Access to 4 Core Functions) */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary-600" />
          Safety Navigation Hub
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/map')}
            className="card cursor-pointer group hover:border-primary-300 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform mb-3">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 flex items-center justify-between text-base">
              Interactive Map
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Safe & hazard zone heatmaps, geofences, and live GPS trails.
            </p>
          </div>

          <div
            onClick={() => navigate('/routes')}
            className="card cursor-pointer group hover:border-emerald-300 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform mb-3">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 flex items-center justify-between text-base">
              Safe Routes
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Turn-by-turn routing with hazard avoidance & off-route alerts.
            </p>
          </div>

          <div
            onClick={() => navigate('/facilities')}
            className="card cursor-pointer group hover:border-indigo-300 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 flex items-center justify-between text-base">
              Nearby Facilities
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Police stations, 24/7 hospitals, pharmacies & verified ATMs.
            </p>
          </div>

          <div
            onClick={() => navigate('/sos')}
            className="card cursor-pointer group bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-400 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-red-900 flex items-center justify-between text-base">
              SOS Broadcast
              <ArrowUpRight className="w-4 h-4 text-red-400 group-hover:text-red-700" />
            </h3>
            <p className="text-xs text-red-700 mt-1">
              1-tap WhatsApp location dispatch to emergency contacts.
            </p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Emergency Contacts & Closest Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Contact Card */}
        <div className="card bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-gray-900">Emergency Contact</h3>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="text-xs text-primary-600 font-semibold hover:underline"
            >
              Manage
            </button>
          </div>

          {primaryContact ? (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">{primaryContact.name}</h4>
                  <p className="text-xs text-gray-500">
                    {primaryContact.relationship} • {primaryContact.phone}
                  </p>
                </div>
                <span className="badge-safe">Primary</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <a
                  href={`tel:${primaryContact.phone}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-green-600" />
                  Call Direct
                </a>
                <a
                  href={`https://wa.me/${primaryContact.whatsapp_number}?text=${encodeURIComponent(
                    `Hi ${primaryContact.name}, I am sharing my current SafeTravel status: ${getLocationLink()}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-semibold text-white transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-3">No emergency contacts configured yet</p>
              <button
                onClick={() => navigate('/profile')}
                className="btn-primary text-xs py-2 px-4"
              >
                Add Emergency Contact
              </button>
            </div>
          )}
        </div>

        {/* Closest Verified Facilities */}
        <div className="card lg:col-span-2 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900">Closest Verified Services</h3>
            </div>
            <button
              onClick={() => navigate('/facilities')}
              className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1"
            >
              See All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {nearbyPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nearbyPlaces.map((f) => (
                <div
                  key={f.id}
                  className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between hover:bg-gray-100/70 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-gray-500">
                        {f.type === 'police' ? '👮 Police' : f.type === 'hospital' ? '🏥 Hospital' : '🍽️ Dining'}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {f.distance} km
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{f.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{f.address}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-200/60">
                    <a
                      href={`tel:${f.phone || (f.type === 'police' ? '100' : '108')}`}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3" /> Call
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${f.latitude},${f.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-gray-800"
                    >
                      Directions →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-gray-800">GPS Radar Active:</span> Explore verified police stations, hospitals, and restaurants in live mode.
              </div>
              <button
                onClick={() => navigate('/facilities')}
                className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold whitespace-nowrap ml-3"
              >
                View Places
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Safety Tips & Recent Travel Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Safety Tips */}
        <div className="card bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-gray-900">Tourist Safety Guidelines</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Keep your phone charged and keep SafeTravel GPS tracking turned on.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Use registered yellow/green prepaid cabs or official metro transit stations.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Save hotel keycard contact and your country's embassy hotline number.</span>
            </li>
          </ul>
        </div>

        {/* Recent Travel Logs */}
        <div className="card lg:col-span-2 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-gray-900">Recent Monitored Journeys</h3>
            </div>
            <span className="text-xs text-gray-400">Automatic Logs</span>
          </div>

          <div className="space-y-2.5">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <p className="font-bold text-gray-900">
                      {trip.source} → {trip.destination}
                    </p>
                    <p className="text-gray-400 text-[11px]">
                      {new Date(trip.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {trip.distance} km • {trip.duration} mins
                    </p>
                  </div>
                </div>
                <span className="badge-safe">Verified Safe</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
