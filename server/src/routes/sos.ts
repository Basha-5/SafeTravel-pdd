import { Router } from 'express';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';
import { supabase } from '../config/supabase.js';
import { sendSOSAlertEmail } from '../config/resend.js';

const router = Router();

// In-memory active alerts fallback
const alertsStore: any[] = [];

// POST /api/sos/activate
router.post('/activate', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id || 'demo-user-12345';
    const userName = req.user?.full_name || 'Alex Morgan';
    const userEmail = req.user?.email || 'tourist.alex@example.com';
    const { latitude, longitude, message, recipientEmail } = req.body;

    const lat = Number(latitude) || 28.6139;
    const lng = Number(longitude) || 77.2090;
    const locationUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    const alert = {
      id: 'sos-' + Date.now(),
      user_id: userId,
      latitude: lat,
      longitude: lng,
      status: 'active',
      message: message || 'EMERGENCY! Tourist SOS beacon triggered!',
      activated_at: new Date().toISOString(),
    };

    // Save to Supabase if configured
    try {
      const { data } = await supabase.from('sos_alerts').insert(alert).select().single();
      if (data) alert.id = data.id;
    } catch (e) {
      // offline/fallback
    }

    alertsStore.unshift(alert);

    // 🚀 Dispatch Resend Emergency Notification Email
    const targetEmail = recipientEmail || userEmail;
    if (targetEmail) {
      await sendSOSAlertEmail(targetEmail, {
        touristName: userName,
        latitude: lat,
        longitude: lng,
        locationUrl,
        message: alert.message,
        time: new Date().toLocaleString(),
      });
    }

    res.status(201).json({
      ...alert,
      emailDispatchedTo: targetEmail,
      locationUrl,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/sos/:id/deactivate
router.put('/:id/deactivate', authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    try {
      await supabase
        .from('sos_alerts')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', id);
    } catch (e) {}

    const found = alertsStore.find((a) => a.id === id);
    if (found) {
      found.status = 'resolved';
      found.resolved_at = new Date().toISOString();
    }

    res.json({ success: true, message: 'SOS resolved' });
  } catch (err) {
    next(err);
  }
});

// GET /api/sos/history
router.get('/history', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    res.json(alertsStore);
  } catch (err) {
    next(err);
  }
});

export default router;
