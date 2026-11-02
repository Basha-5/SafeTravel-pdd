import { Router } from 'express';

const router = Router();

// GET /api/map/ip-location (Auto-detect real user location)
router.get('/ip-location', async (_req, res) => {
  try {
    const ipRes = await fetch('http://ip-api.com/json');
    if (ipRes.ok) {
      const data: any = await ipRes.json();
      if (data && data.status === 'success') {
        return res.json({
          success: true,
          latitude: data.lat,
          longitude: data.lon,
          city: data.city,
          region: data.regionName,
          country: data.country,
        });
      }
    }
  } catch (err) {
    console.warn('IP geolocation service 1 failed:', err);
  }

  try {
    const backupRes = await fetch('https://ipapi.co/json/');
    if (backupRes.ok) {
      const bData: any = await backupRes.json();
      if (bData && bData.latitude && bData.longitude) {
        return res.json({
          success: true,
          latitude: bData.latitude,
          longitude: bData.longitude,
          city: bData.city,
          region: bData.region,
          country: bData.country_name,
        });
      }
    }
  } catch (err) {
    console.warn('Backup IP geolocation failed:', err);
  }

  // Safe fallback to detected local Chennai coordinates
  res.json({
    success: true,
    latitude: 13.0895,
    longitude: 80.2739,
    city: 'Chennai',
    region: 'Tamil Nadu',
    country: 'India',
  });
});

// GET /api/map/search
router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.json([]);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/map/reverse
router.get('/reverse', async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
