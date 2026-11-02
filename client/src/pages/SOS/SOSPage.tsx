import { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  Share2,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Volume2,
  Radio,
  History,
  Send,
  AlertOctagon,
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { sosAPI, contactsAPI } from '../../services/api';
import type { EmergencyContact, SOSAlert } from '../../types';
import toast from 'react-hot-toast';

const SOSPage = () => {
  const { user } = useAuth();
  const { currentLocation, getLocationLink, startTracking } = useLocation();

  const [sosState, setSosState] = useState<'idle' | 'countdown' | 'active'>('idle');
  const [countdown, setCountdown] = useState<number>(5);
  const [activeAlert, setActiveAlert] = useState<SOSAlert | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [history, setHistory] = useState<SOSAlert[]>([]);
  const [timerElapsed, setTimerElapsed] = useState<number>(0);

  const countdownIntervalRef = useRef<any>(null);
  const elapsedIntervalRef = useRef<any>(null);

  // Load contacts and existing active SOS if any
  useEffect(() => {
    contactsAPI.getContacts().then((data) => setContacts(data));
    sosAPI.getHistory().then((data) => setHistory(data));
    sosAPI.getActive().then((active) => {
      if (active) {
        setActiveAlert(active);
        setSosState('active');
        startTracking();
      }
    });
  }, [startTracking]);

  // Handle countdown
  useEffect(() => {
    if (sosState === 'countdown') {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            triggerActiveSOS();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [sosState]);

  // Handle elapsed timer when SOS active
  useEffect(() => {
    if (sosState === 'active') {
      elapsedIntervalRef.current = setInterval(() => {
        setTimerElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setTimerElapsed(0);
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    }
    return () => {
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    };
  }, [sosState]);

  const handleSOSButtonClick = () => {
    if (sosState === 'idle') {
      setCountdown(5);
      setSosState('countdown');
      toast('SOS Countdown started. Tap Cancel if by mistake.', {
        icon: '⚠️',
        duration: 4000,
      });
    }
  };

  const handleCancelCountdown = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setSosState('idle');
    setCountdown(5);
    toast.success('Emergency SOS cancelled');
  };

  const triggerActiveSOS = async () => {
    const lat = currentLocation?.latitude || 28.6139;
    const lng = currentLocation?.longitude || 77.2090;

    startTracking();

    try {
      const alert = await sosAPI.activate(
        lat,
        lng,
        `EMERGENCY ALERT: Tourist ${user?.full_name || 'Traveler'} triggered SOS!`
      );
      setActiveAlert(alert);
      setSosState('active');
      toast.error('EMERGENCY SOS IS NOW ACTIVE!');
      toast.success('Emergency alert notification email dispatched via Resend!', { icon: '📧', duration: 5000 });

      // Open primary contact WhatsApp automatically
      const primary = contacts.find((c) => c.is_primary) || contacts[0];
      if (primary) {
        const message = buildEmergencyMessage();
        window.open(
          `https://wa.me/${primary.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
            message
          )}`,
          '_blank'
        );
      }
    } catch (e) {
      toast.error('Failed to register SOS alert on server');
    }
  };

  const handleDeactivate = async () => {
    if (!activeAlert) return;
    try {
      await sosAPI.deactivate(activeAlert.id);
      setSosState('idle');
      setActiveAlert(null);
      toast.success('SOS deactivated. Glad you are safe!');
      sosAPI.getHistory().then((data) => setHistory(data));
    } catch (e) {
      toast.error('Failed to deactivate');
    }
  };

  const buildEmergencyMessage = () => {
    const link = getLocationLink();
    const lat = currentLocation?.latitude.toFixed(5) || '28.61390';
    const lng = currentLocation?.longitude.toFixed(5) || '77.20900';
    return `🚨 EMERGENCY ALERT FROM SAFETRAVEL! 🚨\n\nI need immediate assistance! My real-time GPS location is:\n📍 Google Maps: ${link}\nCoordinates: ${lat}° N, ${lng}° E\n\nTourist: ${user?.full_name || 'User'}\nPhone: ${user?.phone || 'Emergency'}\n\nPlease contact me or dispatch local emergency services immediately!`;
  };

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Active Emergency Banner */}
      {sosState === 'active' && (
        <div className="bg-red-600 text-white p-6 rounded-3xl shadow-2xl border-4 border-red-300 animate-pulse-sos">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white text-red-600 rounded-2xl">
                <AlertOctagon className="w-10 h-10 animate-spin-slow" />
              </div>
              <div>
                <span className="inline-block px-3 py-0.5 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                  Active Emergency Broadcast
                </span>
                <h2 className="text-2xl font-black tracking-tight">SOS BEACON ACTIVE</h2>
                <p className="text-red-100 text-xs mt-0.5">
                  Broadcasting live telemetry for {formatElapsed(timerElapsed)}
                </p>
              </div>
            </div>

            <button
              onClick={handleDeactivate}
              className="px-6 py-3 bg-white text-red-700 hover:bg-gray-100 font-extrabold rounded-2xl shadow-lg transition-all shrink-0"
            >
              Resolve / Deactivate SOS
            </button>
          </div>
        </div>
      )}

      {/* Main SOS Trigger Hub */}
      <div className="card bg-white p-8 sm:p-12 text-center rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Tourist Emergency Broadcast
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
          Pressing the SOS button instantly notifies your emergency contacts via WhatsApp with your
          live GPS satellite coordinates.
        </p>

        {/* SOS Button Area */}
        <div className="my-10 flex flex-col items-center justify-center">
          {sosState === 'idle' && (
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute -inset-4 rounded-full bg-red-500/20 animate-ping" />
              <button
                onClick={handleSOSButtonClick}
                className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-rose-700 text-white font-black text-3xl sm:text-4xl shadow-2xl shadow-red-500/50 flex flex-col items-center justify-center border-8 border-red-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-16 h-16 sm:w-20 sm:h-20 mb-2 drop-shadow-md" />
                <span>SOS</span>
                <span className="text-[11px] uppercase tracking-widest font-semibold opacity-90 mt-1">
                  Hold / Press
                </span>
              </button>
            </div>
          )}

          {sosState === 'countdown' && (
            <div className="flex flex-col items-center">
              <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-amber-500 text-white font-black text-7xl flex flex-col items-center justify-center border-8 border-amber-200 shadow-2xl shadow-amber-500/50 animate-pulse">
                <span>{countdown}</span>
                <span className="text-xs uppercase tracking-wider font-bold mt-2">
                  Activating...
                </span>
              </div>
              <button
                onClick={handleCancelCountdown}
                className="mt-6 px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Cancel Emergency (False Alarm)
              </button>
            </div>
          )}

          {sosState === 'active' && (
            <div className="flex flex-col items-center">
              <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-red-600 text-white font-black text-xl flex flex-col items-center justify-center border-8 border-red-300 shadow-2xl shadow-red-600/60 sos-pulse">
                <Radio className="w-16 h-16 animate-ping mb-3 text-red-200" />
                <span>TRANSMITTING</span>
                <span className="text-xs font-mono font-normal mt-1 opacity-80">
                  {formatElapsed(timerElapsed)}
                </span>
              </div>
              <p className="text-xs text-red-600 font-bold mt-4 uppercase tracking-wider">
                Continuous GPS Satellite Uplink Active
              </p>
            </div>
          )}
        </div>

        {/* Live Coordinates Display */}
        <div className="inline-flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-700">
          <MapPin className="w-4 h-4 text-primary-600" />
          <span className="font-semibold">
            Current GPS:{' '}
            {currentLocation
              ? `${currentLocation.latitude.toFixed(5)}° N, ${currentLocation.longitude.toFixed(5)}° E`
              : 'Acquiring high-precision lock...'}
          </span>
          <span className="badge-safe">High Accuracy</span>
        </div>
      </div>

      {/* WhatsApp Dispatch to Individual Contacts */}
      <div className="card bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-600" />
              WhatsApp Emergency Dispatch Direct Links
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Tap any contact to open WhatsApp with your pre-filled GPS alert coordinates.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-gray-900">{contact.name}</h4>
                  <span className="text-xs text-gray-500">({contact.relationship})</span>
                  {contact.is_primary && <span className="badge-safe">Primary</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{contact.whatsapp_number}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  Call
                </a>
                <a
                  href={`https://wa.me/${contact.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    buildEmergencyMessage()
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send WhatsApp SOS
                </a>
              </div>
            </div>
          ))}

          {contacts.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-4">
              No contacts saved yet. Please add them in the Profile tab.
            </p>
          )}
        </div>
      </div>

      {/* Emergency Hotlines Card */}
      <div className="card bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-500" />
          Direct Emergency Line
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <a
            href="tel:112"
            className="p-3 bg-red-50 hover:bg-red-100 rounded-2xl border border-red-200 transition-colors"
          >
            <p className="text-xs text-gray-500 font-semibold">National Emergency</p>
            <p className="text-2xl font-black text-red-600">112</p>
          </a>
          <a
            href="tel:100"
            className="p-3 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 transition-colors"
          >
            <p className="text-xs text-gray-500 font-semibold">Police Dispatch</p>
            <p className="text-2xl font-black text-blue-600">100</p>
          </a>
          <a
            href="tel:108"
            className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-2xl border border-emerald-200 transition-colors"
          >
            <p className="text-xs text-gray-500 font-semibold">Ambulance</p>
            <p className="text-2xl font-black text-emerald-600">108</p>
          </a>
          <a
            href="tel:1363"
            className="p-3 bg-purple-50 hover:bg-purple-100 rounded-2xl border border-purple-200 transition-colors"
          >
            <p className="text-xs text-gray-500 font-semibold">Tourist Helpline</p>
            <p className="text-2xl font-black text-purple-600">1363</p>
          </a>
        </div>
      </div>

      {/* SOS Incident Log */}
      {history.length > 0 && (
        <div className="card bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            Past SOS Activation Records
          </h3>
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-50 rounded-xl text-xs flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">{item.message}</p>
                  <p className="text-gray-400 text-[11px]">
                    {new Date(item.activated_at).toLocaleString()} • Coordinates: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                  </p>
                </div>
                <span
                  className={
                    item.status === 'active'
                      ? 'badge-danger'
                      : item.status === 'resolved'
                      ? 'badge-safe'
                      : 'badge-warning'
                  }
                >
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSPage;
