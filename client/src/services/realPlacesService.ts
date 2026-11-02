import type { FacilityType } from '../types';

export interface RealPlace {
  id: string;
  name: string;
  type: FacilityType;
  latitude: number;
  longitude: number;
  distance: number; // in km
  address: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: string;
  is_open?: boolean;
  phone?: string;
  source: 'google';
  place_id?: string;
  photo_url?: string;
  google_maps_url?: string;
}

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

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyC2Ibs89br_FZCWR4f_1XqtBSWTRSVUExg';

/**
 * Helper to query Google Maps JavaScript API PlacesService inside the browser.
 * Uses Maps JavaScript API client-side session which has independent quota from REST APIs.
 */
function searchViaPlacesService(
  mapOrElement: any,
  lat: number,
  lng: number,
  googleType: string,
  categoryType: FacilityType,
  radius: number
): Promise<RealPlace[]> {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined' || !(window as any).google?.maps?.places?.PlacesService) {
        return resolve([]);
      }

      // Need a map or DOM node for PlacesService
      let container = mapOrElement;
      if (!container || typeof container.getCenter !== 'function') {
        container = document.createElement('div');
      }

      const service = new (window as any).google.maps.places.PlacesService(container);
      const center = new (window as any).google.maps.LatLng(lat, lng);

      service.nearbySearch(
        {
          location: center,
          radius: Math.min(radius, 10000),
          type: googleType,
        },
        (results: any[], status: any) => {
          if (
            status === (window as any).google.maps.places.PlacesServiceStatus.OK &&
            Array.isArray(results) &&
            results.length > 0
          ) {
            const places: RealPlace[] = results.slice(0, 15).map((p) => {
              const pLat = typeof p.geometry?.location?.lat === 'function' ? p.geometry.location.lat() : lat;
              const pLng = typeof p.geometry?.location?.lng === 'function' ? p.geometry.location.lng() : lng;
              const dist = calculateDistanceKm(lat, lng, pLat, pLng);

              return {
                id: `google-${p.place_id || Math.random().toString(36).substr(2, 9)}`,
                name: p.name || 'Google Place',
                type: categoryType,
                latitude: pLat,
                longitude: pLng,
                distance: dist,
                address: p.vicinity || p.formatted_address || `${dist} km away`,
                rating: p.rating,
                user_ratings_total: p.user_ratings_total,
                is_open: p.opening_hours?.isOpen?.() ?? p.opening_hours?.open_now ?? true,
                opening_hours: (p.opening_hours?.isOpen?.() ?? p.opening_hours?.open_now) ? 'Open Now' : 'Hours vary',
                phone:
                  categoryType === 'police'
                    ? '100 / 112'
                    : categoryType === 'hospital'
                    ? '108'
                    : undefined,
                source: 'google',
                place_id: p.place_id,
                photo_url: p.photos?.[0]?.getUrl ? p.photos[0].getUrl({ maxWidth: 400 }) : undefined,
                google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  p.name || ''
                )}&query_place_id=${p.place_id || ''}`,
              };
            });
            return resolve(places);
          }
          resolve([]);
        }
      );
    } catch {
      resolve([]);
    }
  });
}

/**
 * Fetch real-time places strictly using Google Maps Platform Places API (New)
 */
export async function searchGooglePlaces(
  map: any,
  lat: number,
  lng: number,
  category: 'all' | 'police' | 'hospital' | 'restaurant',
  radius: number = 8000
): Promise<{ places: RealPlace[]; status: string; errorMessage?: string }> {
  // 1. Try Google Maps JavaScript SDK PlacesService directly in browser
  try {
    if (typeof window !== 'undefined' && (window as any).google?.maps?.places?.PlacesService) {
      const categories: { type: FacilityType; googleType: string }[] = [];
      if (category === 'all' || category === 'police') categories.push({ type: 'police', googleType: 'police' });
      if (category === 'all' || category === 'hospital') categories.push({ type: 'hospital', googleType: 'hospital' });
      if (category === 'all' || category === 'restaurant') categories.push({ type: 'restaurant', googleType: 'restaurant' });

      const jsApiResults = await Promise.all(
        categories.map((c) => searchViaPlacesService(map, lat, lng, c.googleType, c.type, radius))
      );
      const combinedJs = jsApiResults.flat().sort((a, b) => a.distance - b.distance);
      if (combinedJs.length > 0) {
        return { places: combinedJs, status: 'OK' };
      }
    }
  } catch (jsErr) {
    console.warn('Google Maps JS PlacesService query error:', jsErr);
  }

  // 2. Try our backend proxy to Google Places API (New)
  try {
    const res = await fetch(`/api/facilities/google-places?lat=${lat}&lng=${lng}&category=${category}&radius=${radius}`);
    if (res.ok) {
      const data = await res.json();
      if (data.places && Array.isArray(data.places) && data.places.length > 0) {
        return { places: data.places, status: 'OK' };
      }
    }
  } catch (err) {
    console.warn('Backend proxy failed, calling Google Places API directly:', err);
  }

  // 3. Direct browser call to Google Places API (New searchText)
  try {
    const categoriesToQuery: { type: FacilityType; query: string }[] = [];
    if (category === 'all' || category === 'police') {
      categoriesToQuery.push({ type: 'police', query: 'police station' });
    }
    if (category === 'all' || category === 'hospital') {
      categoriesToQuery.push({ type: 'hospital', query: 'hospital emergency clinic' });
    }
    if (category === 'all' || category === 'restaurant') {
      categoriesToQuery.push({ type: 'restaurant', query: 'restaurant food dining' });
    }

    const promises = categoriesToQuery.map(async ({ type, query }) => {
      const resp = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.nationalPhoneNumber',
        },
        body: JSON.stringify({
          textQuery: query,
          locationBias: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: Math.min(radius, 20000),
            },
          },
          maxResultCount: 10,
        }),
      });

      if (!resp.ok) return [];

      const resultData = await resp.json();
      if (!resultData.places || !Array.isArray(resultData.places)) return [];

      return resultData.places.map((p: any) => {
        const pLat = p.location?.latitude || lat;
        const pLng = p.location?.longitude || lng;
        const dist = calculateDistanceKm(lat, lng, pLat, pLng);

        return {
          id: `google-${p.id || Math.random().toString(36).substr(2, 9)}`,
          name: p.displayName?.text || 'Google Place',
          type,
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
            (type === 'police' ? '100 / 112' : type === 'hospital' ? '108' : undefined),
          source: 'google' as const,
          place_id: p.id,
          google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            p.displayName?.text || ''
          )}&query_place_id=${p.id || ''}`,
        };
      });
    });

    const results = await Promise.all(promises);
    const combined = results.flat().sort((a, b) => a.distance - b.distance);

    return {
      places: combined,
      status: combined.length > 0 ? 'OK' : 'ZERO_RESULTS',
    };
  } catch (directErr: any) {
    return {
      places: [],
      status: 'ERROR',
      errorMessage: directErr?.message || 'Error communicating with Google Places API',
    };
  }
}
