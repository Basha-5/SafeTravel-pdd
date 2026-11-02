import { Router } from 'express';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';
import { supabase } from '../config/supabase.js';

const router = Router();

// GET /api/profile
router.get('/', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return res.json({
        id: userId,
        email: req.user.email,
        full_name: 'Alex Morgan',
        phone: '+1 555-019-2834',
        nationality: 'United States',
        address: 'Hotel Grand Palace, Rm 402, Tourist District',
      });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// PUT /api/profile
router.put('/', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user.id;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    const { data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    res.json(data || updates);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/profile
router.delete('/', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user.id;
    await supabase.from('profiles').delete().eq('id', userId);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
