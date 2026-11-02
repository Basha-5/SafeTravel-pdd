import { useState, useMemo, useEffect } from 'react';
import {
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  Share2,
  Volume2,
  VolumeX,
  MapPin,
  CheckCircle2,
  AlertCircle,
  LocateFixed,
  Shuffle,
  ChevronDown,
  ChevronUp,
  Car,
  Footprints,
  Bike,
  Train,
  ExternalLink,
  ShieldAlert,
  ArrowUp,
  CornerUpRight,
  CornerUpLeft,
  X,
  Play,
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { travelAPI } from '../../services/api';
import toast from 'react-hot-toast';
import GoogleNavigationMap, { type RouteInfo } from '../../components/Navigation/GoogleNavigationMap';

const RoutesPage = () => {
  const { currentLocation, getLocationLink } = useLocation();

  const [originText, setOriginText] = useState('My Current Location');
  const [destinationText, setDestinationText] = useState('Central Tourist Plaza & Police Station');
  const [travelMode, setTravelMode] = useState<'WALKING' | 'DRIVING' | 'BICYCLING' | 'TRANSIT'>('WALKING');

  // Real-Time Google Routes List
  const [googleRoutes, setGoogleRoutes] = useState<RouteInfo[]>([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);

  // Active Real-Time Turn-by-Turn Navigation State
  const [isNavigating, setIsNavigating] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeStepData, setActiveStepData] = useState<{
    instruction: string;
    distanceText: string;
    durationText: string;
    maneuver?: string;
  } | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showStepsList, setShowStepsList] = useState(true);
  const [routeDeviationAlert, setRouteDeviationAlert] = useState(false);

  // Set Origin from Live GPS on mount if available
  useEffect(() => {
    if (currentLocation && originText === 'My Current Location') {
      setOriginText(`${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}`);
    }
  }, [currentLocation]);

  // Compute Origin parameter for Google Directions
  const originParam = useMemo(() => {
    if (originText === 'My Current Location' || originText.toLowerCase().includes('current')) {
      if (currentLocation) {
        return { lat: currentLocation.latitude, lng: currentLocation.longitude };
      }
      return '28.6139, 77.2090'; // default center
    }
    return originText;
  }, [originText, currentLocation]);

  const activeRoute = googleRoutes[selectedRouteIdx] || (googleRoutes.length > 0 ? googleRoutes[0] : null);

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setOriginText(`${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}`);
      toast.success('Origin set to current live GPS coordinates');
    } else {
      setOriginText('Current Location');
      toast('Acquiring GPS location...');
    }
  };

  const handleSwap = () => {
    const temp = originText;
    setOriginText(destinationText);
    setDestinationText(temp);
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    toast.success('Live Turn-by-Turn Navigation Active!');

    if (voiceEnabled && 'speechSynthesis' in window) {
      const firstStep = activeRoute?.steps[0]?.instructions || 'Proceed along the highlighted safe route';
      const utterance = new SpeechSynthesisUtterance(`Starting safe navigation. ${firstStep}`);
      window.speechSynthesis.speak(utterance);
    }

    if (activeRoute) {
      travelAPI.addRecord({
        source: originText,
        destination: destinationText,
        distance: activeRoute.distanceMeters / 1000,
        duration: Math.round(activeRoute.durationSeconds / 60),
      });
    }
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    setActiveStepData(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    toast('Navigation stopped');
  };

  const handleShareTrip = () => {
    const text = encodeURIComponent(
      `SafeTravel Route Alert:\nI am actively navigating from "${originText}" to "${destinationText}" via Google Maps Platform (${activeRoute?.safetyScore || 96}% Safety Rating).\nLive Tracking: ${getLocationLink()}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Google Maps Mobile App deep link
  const googleMapsMobileUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    typeof originParam === 'object' ? `${originParam.lat},${originParam.lng}` : originParam
  )}&destination=${encodeURIComponent(destinationText)}&travelmode=${travelMode.toLowerCase()}`;

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Route Setup & Travel Mode Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-50 rounded-xl text-primary-600">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Google Maps Real-Time Navigation</h2>
              <p className="text-xs text-gray-500">Google Maps Platform Turn-by-Turn Directions & Safe Corridors</p>
            </div>
          </div>

          {/* Travel Mode Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setTravelMode('WALKING')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                travelMode === 'WALKING'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Walk</span>
            </button>

            <button
              onClick={() => setTravelMode('DRIVING')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                travelMode === 'DRIVING'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Drive</span>
            </button>

            <button
              onClick={() => setTravelMode('BICYCLING')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                travelMode === 'BICYCLING'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Cycle</span>
            </button>

            <button
              onClick={() => setTravelMode('TRANSIT')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                travelMode === 'TRANSIT'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Train className="w-3.5 h-3.5" />
              <span>Transit</span>
            </button>
          </div>
        </div>

        {/* Origin and Destination Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Origin */}
          <div className="lg:col-span-5 relative">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Starting Point (Origin)</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={originText}
                onChange={(e) => setOriginText(e.target.value)}
                placeholder="Enter starting location or GPS..."
                className="input-field pl-9 pr-24 py-2.5 text-xs font-medium"
              />
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-primary-700 hover:text-primary-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <LocateFixed className="w-3 h-3" />
                <span>My GPS</span>
              </button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="lg:col-span-1 flex justify-center pt-2 md:pt-4">
            <button
              onClick={handleSwap}
              title="Swap Start & Destination"
              className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>

          {/* Destination */}
          <div className="lg:col-span-6 relative">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Destination</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-red-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={destinationText}
                onChange={(e) => setDestinationText(e.target.value)}
                placeholder="Enter hotel, tourist attraction, or address..."
                className="input-field pl-9 py-2.5 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Quick Emergency & Tourist Destination Chips */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-gray-400 font-semibold text-[11px]">Quick Safe Destinations:</span>
          <button
            onClick={() => {
              setDestinationText('Nearest Tourist Police Station');
              toast.success('Destination: Nearest Police Station');
            }}
            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors flex items-center gap-1"
          >
            <span>👮 Nearest Police</span>
          </button>
          <button
            onClick={() => {
              setDestinationText('Nearest Emergency Hospital');
              toast.success('Destination: Nearest Emergency Hospital');
            }}
            className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition-colors flex items-center gap-1"
          >
            <span>🏥 Emergency Hospital</span>
          </button>
          <button
            onClick={() => {
              setDestinationText('Top Rated Safe Restaurant & Dining');
              toast.success('Destination: Safe Restaurant');
            }}
            className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 font-semibold transition-colors flex items-center gap-1"
          >
            <span>🍽️ Safe Restaurant</span>
          </button>
          <button
            onClick={() => {
              setDestinationText('Central Tourist Heritage Monument');
              toast.success('Destination: Tourist Monument');
            }}
            className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold transition-colors flex items-center gap-1"
          >
            <span>🏛️ Monument</span>
          </button>
        </div>
      </div>

      {/* Simulated Route Deviation Warning Alert */}
      {routeDeviationAlert ? (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <h4 className="font-bold text-red-900 text-sm">
                Route Deviation Detected!
              </h4>
              <p className="text-xs text-red-700">
                You have strayed 200m off the verified safe corridor into an unmonitored zone.
                WhatsApp notification ready for your emergency contacts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareTrip}
              className="btn-danger text-xs py-1.5 px-3 whitespace-nowrap"
            >
              Alert WhatsApp
            </button>
            <button
              onClick={() => setRouteDeviationAlert(false)}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Real-Time Route Monitoring: Verified tourist safety lighting, CCTV coverage, and police patrol corridors.
            </span>
          </div>
          <button
            onClick={() => setRouteDeviationAlert(true)}
            className="text-[11px] font-bold text-primary-700 hover:underline shrink-0"
          >
            Simulate Deviation Alert
          </button>
        </div>
      )}

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Route Options & Step Navigation Panel */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Navigation HUD Box (When Navigation is Running) */}
          {isNavigating && (
            <div className="bg-slate-950 text-white p-4 rounded-3xl shadow-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Live GPS Turn-by-Turn
                  </span>
                </div>
                <button
                  onClick={handleStopNavigation}
                  className="px-2.5 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>
              </div>

              {/* Next Maneuver Banner */}
              <div className="flex items-start gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
                <div className="p-3 bg-blue-600 rounded-xl text-white shrink-0">
                  {activeStepData?.maneuver?.includes('left') ? (
                    <CornerUpLeft className="w-6 h-6" />
                  ) : activeStepData?.maneuver?.includes('right') ? (
                    <CornerUpRight className="w-6 h-6" />
                  ) : (
                    <ArrowUp className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-extrabold text-blue-400 uppercase">
                    In {activeStepData?.distanceText || '150 meters'}
                  </div>
                  <h3 className="font-bold text-sm text-slate-100 line-clamp-2 mt-0.5">
                    {activeStepData?.instruction || activeRoute?.steps[0]?.instructions || 'Proceed along the highlighted safe route'}
                  </h3>
                </div>
              </div>

              {/* Step Simulator buttons during active navigation */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => {
                    if (activeRoute && activeStepIndex > 0) {
                      const nextIdx = activeStepIndex - 1;
                      setActiveStepIndex(nextIdx);
                      setActiveStepData({
                        instruction: activeRoute.steps[nextIdx].instructions,
                        distanceText: activeRoute.steps[nextIdx].distanceText,
                        durationText: activeRoute.steps[nextIdx].durationText,
                        maneuver: activeRoute.steps[nextIdx].maneuver,
                      });
                    }
                  }}
                  disabled={activeStepIndex === 0}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-[11px]"
                >
                  ← Prev Turn
                </button>
                <span className="text-slate-400 text-[11px]">
                  Step {activeStepIndex + 1} of {activeRoute?.steps.length || 1}
                </span>
                <button
                  onClick={() => {
                    if (activeRoute && activeStepIndex < activeRoute.steps.length - 1) {
                      const nextIdx = activeStepIndex + 1;
                      setActiveStepIndex(nextIdx);
                      setActiveStepData({
                        instruction: activeRoute.steps[nextIdx].instructions,
                        distanceText: activeRoute.steps[nextIdx].distanceText,
                        durationText: activeRoute.steps[nextIdx].durationText,
                        maneuver: activeRoute.steps[nextIdx].maneuver,
                      });
                    }
                  }}
                  disabled={!activeRoute || activeStepIndex >= activeRoute.steps.length - 1}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-[11px]"
                >
                  Next Turn →
                </button>
              </div>
            </div>
          )}

          {/* Suggested Safe Routes List */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-gray-900 text-sm flex items-center justify-between">
              <span>Google Maps Evaluated Routes</span>
              <span className="text-xs font-normal text-gray-500">
                {googleRoutes.length > 0 ? `${googleRoutes.length} route(s) found` : 'Calculating route...'}
              </span>
            </h3>

            {googleRoutes.length > 0 ? (
              googleRoutes.map((route, idx) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteIdx(idx)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedRouteIdx === idx
                      ? 'bg-white border-primary-600 shadow-md ring-2 ring-primary-100'
                      : 'bg-white/80 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            route.safetyScore >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : route.safetyScore >= 75
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {route.safetyScore}% Safety Score
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          {route.safetyLevel}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mt-2 text-sm">{route.title}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-gray-900 block">
                        {route.durationText}
                      </span>
                      <span className="text-xs text-gray-500">{route.distanceText}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-2 border-t border-gray-100 pt-2 line-clamp-1">
                    From {route.startAddress.split(',')[0]} to {route.endAddress.split(',')[0]}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 bg-white rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
                Calculating real-time Google Maps safe route directions...
              </div>
            )}
          </div>

          {/* Action Buttons for Selected Route */}
          <div className="card bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  voiceEnabled
                    ? 'bg-blue-50 text-primary-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{voiceEnabled ? 'Voice Guidance On' : 'Voice Off'}</span>
              </button>

              <button
                onClick={handleShareTrip}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Route</span>
              </button>
            </div>

            {/* Launch Turn-by-Turn Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={isNavigating ? handleStopNavigation : handleStartNavigation}
                className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  isNavigating
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'btn-primary'
                }`}
              >
                {isNavigating ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Stop Navigation</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Turn-by-Turn</span>
                  </>
                )}
              </button>

              <a
                href={googleMapsMobileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
              >
                <span>Google Maps App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Step-by-Step Maneuver List */}
          <div className="card bg-white p-4">
            <div
              onClick={() => setShowStepsList(!showStepsList)}
              className="flex items-center justify-between cursor-pointer"
            >
              <h4 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-primary-600" />
                Turn-by-Turn Instructions ({activeRoute?.steps.length || 0} steps)
              </h4>
              {showStepsList ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>

            {showStepsList && (
              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 max-h-56 overflow-y-auto pr-1">
                {activeRoute?.steps.map((st, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveStepIndex(i);
                      setActiveStepData({
                        instruction: st.instructions,
                        distanceText: st.distanceText,
                        durationText: st.durationText,
                        maneuver: st.maneuver,
                      });
                    }}
                    className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      activeStepIndex === i
                        ? 'bg-primary-50 border border-primary-200 text-primary-950 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="line-clamp-2">{st.instructions}</p>
                      <span className="text-[11px] text-gray-500 font-semibold">{st.distanceText}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Map Canvas for Google Navigation */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-2 shadow-sm border border-gray-100 relative h-[650px] overflow-hidden">
          <GoogleNavigationMap
            origin={originParam}
            destination={destinationText}
            travelMode={travelMode}
            isNavigating={isNavigating}
            voiceEnabled={voiceEnabled}
            currentLocation={currentLocation}
            selectedRouteIndex={selectedRouteIdx}
            onRoutesFound={(routes) => setGoogleRoutes(routes)}
            onActiveStepUpdate={(step, stepIdx) => {
              setActiveStepData(step);
              setActiveStepIndex(stepIdx);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;
