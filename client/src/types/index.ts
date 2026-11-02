// ─── User & Auth Types ───────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality?: string;
  address?: string;
  government_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

// ─── Emergency Contact Types ─────────────────────────────────────────

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  phone: string;
  whatsapp_number: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContactInput {
  name: string;
  relationship: string;
  phone: string;
  whatsapp_number: string;
  is_primary: boolean;
}

// ─── Location Types ──────────────────────────────────────────────────

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface LocationState {
  currentLocation: Location | null;
  isTracking: boolean;
  error: string | null;
  watchId: number | null;
}

// ─── Map & Navigation Types ─────────────────────────────────────────

export interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  type: FacilityType;
  icon?: string;
}

export interface Route {
  id: string;
  name: string;
  distance: number;
  duration: number;
  safetyScore: number;
  coordinates: [number, number][];
  warnings: RouteWarning[];
}

export interface RouteWarning {
  type: 'unsafe_area' | 'restricted' | 'high_crime' | 'low_visibility';
  message: string;
  location: [number, number];
}

// ─── Facility Types ──────────────────────────────────────────────────

export type FacilityType =
  | 'police'
  | 'hospital'
  | 'pharmacy'
  | 'hotel'
  | 'restaurant'
  | 'tourist_info'
  | 'atm'
  | 'transport'
  | 'embassy';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  latitude: number;
  longitude: number;
  distance?: number;
  address: string;
  phone?: string;
  rating?: number;
  opening_hours?: string;
  is_open?: boolean;
}

// ─── SOS Types ───────────────────────────────────────────────────────

export interface SOSAlert {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'resolved' | 'cancelled';
  activated_at: string;
  resolved_at?: string;
  message?: string;
}

export interface SOSState {
  isActive: boolean;
  countdown: number | null;
  alert: SOSAlert | null;
}

// ─── Safety & Weather Types ──────────────────────────────────────────

export interface SafetyScore {
  overall: number;
  crime: number;
  infrastructure: number;
  health: number;
  natural_disaster: number;
  label: 'Safe' | 'Moderate' | 'Caution' | 'Unsafe';
  color: string;
}

export interface WeatherAlert {
  id: string;
  type: 'storm' | 'flood' | 'heat' | 'cold' | 'earthquake' | 'general';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export interface SafetyAlert {
  id: string;
  type: 'crime' | 'health' | 'weather' | 'travel_advisory' | 'general';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  location?: Location;
  timestamp: string;
}

// ─── Travel History ──────────────────────────────────────────────────

export interface TravelRecord {
  id: string;
  user_id: string;
  source: string;
  destination: string;
  source_coords: [number, number];
  destination_coords: [number, number];
  distance: number;
  duration: number;
  started_at: string;
  completed_at?: string;
  status: 'in_progress' | 'completed' | 'cancelled';
}

// ─── Notification Types ──────────────────────────────────────────────

export interface Notification {
  id: string;
  type: 'alert' | 'sos' | 'reminder' | 'info';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
