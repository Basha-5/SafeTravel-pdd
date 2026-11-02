import { Router } from 'express';

const router = Router();

// In-memory cache to prevent Google Places 429 rate limits
const placesCache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache per area

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

// Helper to query Google Places API (New searchText) with caching & rate-limit protection
async function fetchPlacesFromGoogle(
  lat: number,
  lng: number,
  _types: string[],
  categoryType: 'police' | 'hospital' | 'restaurant',
  radius: number = 8000
) {
  // Round coordinates to ~1km grid to utilize cache across nearby pings
  const gridLat = Math.round(lat * 100) / 100;
  const gridLng = Math.round(lng * 100) / 100;
  const cacheKey = `${categoryType}_${gridLat}_${gridLng}`;

  const cached = placesCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSy_PLACEHOLDER_KEY';

  const textQuery =
    categoryType === 'police'
      ? 'police station'
      : categoryType === 'hospital'
      ? 'hospital emergency clinic'
      : 'restaurant food dining';

  const body = JSON.stringify({
    textQuery,
    locationBias: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: Math.min(radius, 20000),
      },
    },
    maxResultCount: 15,
  });

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.nationalPhoneNumber,places.primaryType',
      },
      body,
    });

    if (!response.ok) {
      console.warn(`[Google Places] ${categoryType} response status: ${response.status}`);
      if (cached) return cached.data;
      return [];
    }

    const data: any = await response.json();
    if (!data.places || !Array.isArray(data.places)) return cached ? cached.data : [];

    const mapped = data.places.map((p: any) => {
      const pLat = p.location?.latitude || lat;
      const pLng = p.location?.longitude || lng;
      const dist = calculateDistanceKm(lat, lng, pLat, pLng);

      return {
        id: `google-${p.id || Math.random().toString(36).substr(2, 9)}`,
        name: p.displayName?.text || 'Google Place',
        type: categoryType,
        latitude: pLat,
        longitude: pLng,
        distance: dist,
        address: p.formattedAddress || `${dist} km from GPS location`,
        rating: p.rating || undefined,
        user_ratings_total: p.userRatingCount || undefined,
        is_open: p.currentOpeningHours?.openNow ?? true,
        opening_hours: p.currentOpeningHours?.openNow ? 'Open Now' : 'Hours vary',
        phone:
          p.nationalPhoneNumber ||
          (categoryType === 'police' ? '100 / 112' : categoryType === 'hospital' ? '108' : undefined),
        source: 'google',
        place_id: p.id,
        google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          p.displayName?.text || ''
        )}&query_place_id=${p.id || ''}`,
      };
    });

    placesCache.set(cacheKey, { data: mapped, timestamp: Date.now() });
    return mapped;
  } catch (err: any) {
    console.warn(`[Google Places] Network exception for ${categoryType}:`, err.message);
    if (cached) return cached.data;
    return [];
  }
}

// GET /api/facilities/google-places (Strictly real Google Places for Police, Hospitals & Restaurants)
router.get('/google-places', async (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 13.0895;
  const lng = parseFloat(req.query.lng as string) || 80.2739;
  const category = (req.query.category as string) || 'all';
  const radius = parseFloat(req.query.radius as string) || 8000;

  try {
    const queries: Promise<any[]>[] = [];

    if (category === 'all' || category === 'police') {
      queries.push(fetchPlacesFromGoogle(lat, lng, ['police'], 'police', radius));
    }
    if (category === 'all' || category === 'hospital') {
      queries.push(fetchPlacesFromGoogle(lat, lng, ['hospital'], 'hospital', radius));
    }
    if (category === 'all' || category === 'restaurant') {
      queries.push(fetchPlacesFromGoogle(lat, lng, ['restaurant'], 'restaurant', radius));
    }

    const results = await Promise.all(queries);
    const combined = results.flat().sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      count: combined.length,
      places: combined,
    });
  } catch (err: any) {
    console.error('Google Places query error:', err);
    res.status(500).json({ success: false, error: err.message, places: [] });
  }
});

// GET /api/facilities/emergency
router.get('/emergency', async (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 13.0895;
  const lng = parseFloat(req.query.lng as string) || 80.2739;
  const type = (req.query.type as string) || 'all';

  try {
    const queries: Promise<any[]>[] = [];
    if (type === 'all' || type === 'police') {
      queries.push(fetchPlacesFromGoogle(lat, lng, ['police'], 'police', 8000));
    }
    if (type === 'all' || type === 'hospital') {
      queries.push(fetchPlacesFromGoogle(lat, lng, ['hospital'], 'hospital', 8000));
    }

    const results = await Promise.all(queries);
    const combined = results.flat().sort((a, b) => a.distance - b.distance);
    return res.json(combined);
  } catch (err) {
    console.warn('Emergency Google Places error:', err);
  }

  res.json([]);
});

export default router;
