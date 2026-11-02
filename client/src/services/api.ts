import axios from 'axios';
import { supabase } from '../config/supabase';
import type {
  EmergencyContact,
  EmergencyContactInput,
  Facility,
  FacilityType,
  SOSAlert,
  TravelRecord,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token if available
api.interceptors.request.use(async (config) => {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      config.headers.Authorization = `Bearer ${data.session.access_token}`;
    } else {
      const customToken = localStorage.getItem('safetravel_auth_token');
      if (customToken) {
        config.headers.Authorization = `Bearer ${customToken}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// ─── Auth & Resend Notification API ──────────────────────────────────
export const authAPI = {
  sendOTP: (phone?: string, email?: string) =>
    api.post('/auth/send-otp', { phone, email }),

  sendEmailOTP: (email: string) =>
    api.post('/auth/send-email-otp', { email }),

  verifyOTP: (identifier: { phone?: string; email?: string; otp: string }) =>
    api.post('/auth/verify-otp', identifier),

  testResend: (email?: string) =>
    api.post('/auth/test-resend', { email }),
};

// Initial mock contacts stored in localStorage for seamless testing
const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: 'contact-1',
    user_id: 'demo-user-12345',
    name: 'Sarah Morgan',
    relationship: 'Sister',
    phone: '+1 555-839-2041',
    whatsapp_number: '+15558392041',
    is_primary: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'contact-2',
    user_id: 'demo-user-12345',
    name: 'David Morgan',
    relationship: 'Father',
    phone: '+1 555-492-1102',
    whatsapp_number: '+15554921102',
    is_primary: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'contact-3',
    user_id: 'demo-user-12345',
    name: 'Tourist Police Hotline',
    relationship: 'Emergency Desk',
    phone: '+1 800-555-SAFE',
    whatsapp_number: '+18005557233',
    is_primary: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const getStoredContacts = (): EmergencyContact[] => {
  const item = localStorage.getItem('safetravel_contacts');
  if (item) {
    try {
      return JSON.parse(item);
    } catch (e) {
      // ignore
    }
  }
  localStorage.setItem('safetravel_contacts', JSON.stringify(DEFAULT_CONTACTS));
  return DEFAULT_CONTACTS;
};

// ─── Contacts API ────────────────────────────────────────────────────
export const contactsAPI = {
  getContacts: async (): Promise<EmergencyContact[]> => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .order('is_primary', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      // fallback
    }
    return getStoredContacts();
  },

  addContact: async (contact: EmergencyContactInput): Promise<EmergencyContact> => {
    const newContact: EmergencyContact = {
      id: 'contact-' + Date.now(),
      user_id: 'current-user',
      ...contact,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({ ...contact })
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      // fallback
    }
    const current = getStoredContacts();
    if (newContact.is_primary) {
      current.forEach(c => c.is_primary = false);
    }
    const updated = [newContact, ...current];
    localStorage.setItem('safetravel_contacts', JSON.stringify(updated));
    return newContact;
  },

  updateContact: async (id: string, contact: Partial<EmergencyContactInput>): Promise<EmergencyContact> => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .update({ ...contact, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      // fallback
    }
    const current = getStoredContacts();
    const index = current.findIndex(c => c.id === id);
    if (index !== -1) {
      if (contact.is_primary) {
        current.forEach(c => c.is_primary = false);
      }
      current[index] = { ...current[index], ...contact, updated_at: new Date().toISOString() };
      localStorage.setItem('safetravel_contacts', JSON.stringify(current));
      return current[index];
    }
    throw new Error('Contact not found');
  },

  deleteContact: async (id: string): Promise<void> => {
    try {
      await supabase.from('emergency_contacts').delete().eq('id', id);
    } catch (e) {
      // fallback
    }
    const current = getStoredContacts().filter(c => c.id !== id);
    localStorage.setItem('safetravel_contacts', JSON.stringify(current));
  },

  setPrimary: async (id: string): Promise<void> => {
    const current = getStoredContacts().map(c => ({
      ...c,
      is_primary: c.id === id,
    }));
    localStorage.setItem('safetravel_contacts', JSON.stringify(current));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('emergency_contacts').update({ is_primary: false }).eq('user_id', session.user.id);
        await supabase.from('emergency_contacts').update({ is_primary: true }).eq('id', id);
      }
    } catch (e) {
      // ignore
    }
  },
};

// ─── Dynamic GPS Location-Based Facilities Generator ────────────────
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function generateFacilitiesForLocation(_userLat: number, _userLng: number): Facility[] {
  // All synthetic mock templates removed - strictly real-time Google Places only
  return [];
}

// ─── Default Mock Facilities ─────────────────────────────────────────
export const MOCK_FACILITIES: Facility[] = [];

export const facilitiesAPI = {
  getEmergencyStations: async (lat: number, lng: number, type?: string): Promise<Facility[]> => {
    try {
      const response = await api.get('/facilities/emergency', {
        params: { lat, lng, type: type || 'all' },
      });
      if (response.data && response.data.length > 0) return response.data;
    } catch (e) {
      console.warn('Emergency stations fetch fallback:', e);
    }
    return [];
  },

  getNearby: async (
    lat: number,
    lng: number,
    type?: FacilityType,
    _radius: number = 5000
  ): Promise<Facility[]> => {
    try {
      const response = await api.get('/facilities/google-places', {
        params: { lat, lng, category: type || 'all', radius: _radius },
      });
      if (response.data?.places && response.data.places.length > 0) return response.data.places;
    } catch (e) {
      // fallback
    }
    return [];
  },

  search: async (_query: string, _lat: number, _lng: number): Promise<Facility[]> => {
    return [];
  },
};

// ─── SOS API ─────────────────────────────────────────────────────────
export const sosAPI = {
  activate: async (latitude: number, longitude: number, message?: string, recipientEmail?: string): Promise<SOSAlert> => {
    let alert: SOSAlert = {
      id: 'sos-' + Date.now(),
      user_id: 'user-active',
      latitude,
      longitude,
      status: 'active',
      message: message || 'EMERGENCY! I need assistance right now!',
      activated_at: new Date().toISOString(),
    };

    try {
      // 🚨 Trigger backend dispatch which sends Resend emergency alert notification email
      const response = await api.post('/sos/activate', {
        latitude,
        longitude,
        message: alert.message,
        recipientEmail,
      });
      if (response.data && response.data.id) {
        alert = response.data;
      }
    } catch (e) {
      console.warn('Backend SOS dispatch notice:', e);
    }

    try {
      const { data, error } = await supabase.from('sos_alerts').insert(alert).select().single();
      if (!error && data) alert = data;
    } catch (e) {
      // fallback
    }

    const history = JSON.parse(localStorage.getItem('safetravel_sos_history') || '[]');
    localStorage.setItem('safetravel_sos_history', JSON.stringify([alert, ...history]));
    localStorage.setItem('safetravel_active_sos', JSON.stringify(alert));
    return alert;
  },

  deactivate: async (alertId: string): Promise<void> => {
    try {
      await supabase.from('sos_alerts').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', alertId);
    } catch (e) {
      // fallback
    }
    localStorage.removeItem('safetravel_active_sos');
    const history = JSON.parse(localStorage.getItem('safetravel_sos_history') || '[]');
    const updated = history.map((h: SOSAlert) => h.id === alertId ? { ...h, status: 'resolved', resolved_at: new Date().toISOString() } : h);
    localStorage.setItem('safetravel_sos_history', JSON.stringify(updated));
  },

  cancel: async (alertId: string): Promise<void> => {
    localStorage.removeItem('safetravel_active_sos');
    const history = JSON.parse(localStorage.getItem('safetravel_sos_history') || '[]');
    const updated = history.map((h: SOSAlert) => h.id === alertId ? { ...h, status: 'cancelled', resolved_at: new Date().toISOString() } : h);
    localStorage.setItem('safetravel_sos_history', JSON.stringify(updated));
  },

  getHistory: async (): Promise<SOSAlert[]> => {
    try {
      const { data, error } = await supabase.from('sos_alerts').select('*').order('activated_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      // fallback
    }
    return JSON.parse(localStorage.getItem('safetravel_sos_history') || '[]');
  },

  getActive: async (): Promise<SOSAlert | null> => {
    const active = localStorage.getItem('safetravel_active_sos');
    if (active) {
      try { return JSON.parse(active); } catch (e) {}
    }
    return null;
  },
};

// ─── Travel History API ──────────────────────────────────────────────
const DEFAULT_TRAVEL: TravelRecord[] = [
  {
    id: 'tr-1',
    user_id: 'demo-user-12345',
    source: 'Hotel Grand Palace',
    destination: 'National Museum & Arts Gallery',
    source_coords: [28.6175, 77.2025],
    destination_coords: [28.6118, 77.2193],
    distance: 3.2,
    duration: 14,
    started_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 3.7).toISOString(),
    status: 'completed',
  },
  {
    id: 'tr-2',
    user_id: 'demo-user-12345',
    source: 'National Museum',
    destination: 'Botanical Gardens Promenade',
    source_coords: [28.6118, 77.2193],
    destination_coords: [28.5855, 77.2215],
    distance: 4.8,
    duration: 22,
    started_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 23.6).toISOString(),
    status: 'completed',
  },
];

export const travelAPI = {
  getHistory: async (): Promise<TravelRecord[]> => {
    const stored = localStorage.getItem('safetravel_travel_history');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    localStorage.setItem('safetravel_travel_history', JSON.stringify(DEFAULT_TRAVEL));
    return DEFAULT_TRAVEL;
  },

  addRecord: async (record: Partial<TravelRecord>): Promise<TravelRecord> => {
    const newRecord: TravelRecord = {
      id: 'tr-' + Date.now(),
      user_id: 'demo-user',
      source: record.source || 'Current Location',
      destination: record.destination || 'Destination',
      source_coords: record.source_coords || [28.6139, 77.2090],
      destination_coords: record.destination_coords || [28.6200, 77.2200],
      distance: record.distance || 2.5,
      duration: record.duration || 12,
      started_at: new Date().toISOString(),
      status: 'in_progress',
    };
    const current = await travelAPI.getHistory();
    localStorage.setItem('safetravel_travel_history', JSON.stringify([newRecord, ...current]));
    return newRecord;
  },
};

// ─── Map Search & Routes (Uses OpenStreetMap & OSRM) ─────────────────
export const mapAPI = {
  searchPlaces: async (query: string): Promise<any[]> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      return await response.json();
    } catch (e) {
      return [
        { display_name: `${query}, City Center`, lat: '28.6139', lon: '77.2090' },
        { display_name: `${query}, Airport Express Zone`, lat: '28.5562', lon: '77.1000' },
      ];
    }
  },

  reverseGeocode: async (lat: number, lng: number): Promise<any> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      return await response.json();
    } catch (e) {
      return { display_name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` };
    }
  },

  getRoute: async (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<any> => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&alternatives=true&steps=true`
      );
      const data = await response.json();
      if (data && data.routes && data.routes.length > 0) {
        return data;
      }
    } catch (e) {
      // fallback
    }
    // Fallback direct coordinate route
    return {
      routes: [
        {
          distance: 4200,
          duration: 720,
          geometry: {
            coordinates: [
              [startLng, startLat],
              [startLng + (endLng - startLng) * 0.33, startLat + (endLat - startLat) * 0.4],
              [startLng + (endLng - startLng) * 0.66, startLat + (endLat - startLat) * 0.7],
              [endLng, endLat],
            ],
          },
          legs: [
            {
              steps: [
                { maneuver: { instruction: 'Head northeast on Safe Promenade' }, distance: 600, duration: 120 },
                { maneuver: { instruction: 'Turn right onto Well-Lit Boulevard' }, distance: 1800, duration: 320 },
                { maneuver: { instruction: 'Continue past Tourist Police Enclave' }, distance: 1200, duration: 200 },
                { maneuver: { instruction: 'Arrive at destination on the left' }, distance: 600, duration: 80 },
              ],
            },
          ],
        },
      ],
    };
  },
};

export default api;
