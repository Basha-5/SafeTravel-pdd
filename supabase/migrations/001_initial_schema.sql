-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  SafeTravel - Tourist Safety Monitoring System                  ║
-- ║  Complete Supabase SQL Database Setup                           ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. User Profiles Table (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  nationality TEXT DEFAULT 'International Tourist',
  address TEXT,
  government_id TEXT,
  location_tracking_enabled BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Emergency Contacts Table (For WhatsApp SOS Dispatch)
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user ON public.emergency_contacts(user_id);

-- 4. Emergency SOS Alerts Table
CREATE TABLE IF NOT EXISTS public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved', 'cancelled')) DEFAULT 'active',
  message TEXT,
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sos_alerts_user ON public.sos_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON public.sos_alerts(status);

-- 5. Monitored Travel History Table
CREATE TABLE IF NOT EXISTS public.travel_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  destination TEXT NOT NULL,
  source_coords DOUBLE PRECISION[] NOT NULL,
  destination_coords DOUBLE PRECISION[] NOT NULL,
  distance DOUBLE PRECISION NOT NULL,
  duration DOUBLE PRECISION NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'cancelled')) DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_travel_history_user ON public.travel_history(user_id);

-- 6. GPS Breadcrumb Telemetry Tracking Log
CREATE TABLE IF NOT EXISTS public.location_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_location_logs_user ON public.location_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_location_logs_time ON public.location_logs(recorded_at);

-- 7. Safety Notifications & Advisories Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('alert', 'sos', 'reminder', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- 8. Verified Tourist Facilities Table
CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('police', 'hospital', 'pharmacy', 'hotel', 'restaurant', 'tourist_info', 'atm', 'transport', 'embassy')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  rating NUMERIC(2,1),
  opening_hours TEXT,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Row Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- Allow public read on verified facilities
CREATE POLICY "Anyone can view facilities" ON public.facilities
  FOR SELECT USING (true);

-- User-scoped policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own contacts" ON public.emergency_contacts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contacts" ON public.emergency_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contacts" ON public.emergency_contacts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contacts" ON public.emergency_contacts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sos alerts" ON public.sos_alerts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sos alerts" ON public.sos_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sos alerts" ON public.sos_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own travel history" ON public.travel_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own travel history" ON public.travel_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own location logs" ON public.location_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own location logs" ON public.location_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 10. Automatic Profile Creation Trigger on Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Real-time Broadcasting for Live SOS and Tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'sos_alerts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_alerts;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'location_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.location_logs;
  END IF;
END $$;

-- 12. Seed Verified Facilities
INSERT INTO public.facilities (name, type, latitude, longitude, address, phone, rating, opening_hours)
VALUES
  ('Central Tourist Police Station', 'police', 28.6139, 77.2090, 'Connaught Place Outer Circle, Sector 1', '+91 11 2341 2222', 4.8, '24 Hours / 7 Days'),
  ('St. Jude International Hospital & Emergency Trauma', 'hospital', 28.6189, 77.2150, '14 Park Avenue Medical Enclave', '+91 11 4455 6677', 4.9, '24 Hours Emergency'),
  ('MediQuick 24/7 Pharmacy', 'pharmacy', 28.6110, 77.2040, 'Shop 12, Metro Plaza Ground Floor', '+91 11 9876 5432', 4.6, '24 Hours'),
  ('Grand Heritage Palace Hotel', 'hotel', 28.6175, 77.2025, '7 Imperial Way, Diplomatic Enclave', '+91 11 6677 8899', 4.7, '24 Hours Front Desk'),
  ('City Tourist Assistance & Visitor Center', 'tourist_info', 28.6145, 77.2120, 'Tourism Pavilion, Block B', '+91 11 1363 0000', 4.5, '08:00 AM - 08:00 PM'),
  ('SafeBank ATM (Multi-Currency & Guarded)', 'atm', 28.6125, 77.2065, 'Near Central Metro Gate 3', '+91 1800 11 2211', 4.4, '24 Hours Guarded'),
  ('Central Metro Transit Hub & Bus Terminal', 'transport', 28.6155, 77.2085, 'Interchange Station Platform 1 & 2', '+91 11 155370', 4.6, '05:30 AM - 11:30 PM'),
  ('The Spice Garden Safe Dining Restaurant', 'restaurant', 28.6160, 77.2110, '22 Heritage Lane, Food Boulevard', '+91 11 2334 4556', 4.8, '11:00 AM - 11:00 PM')
ON CONFLICT DO NOTHING;
