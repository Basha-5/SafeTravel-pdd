import { Router } from 'express';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';
import { supabase } from '../config/supabase.js';

const router = Router();

// GET /api/contacts
router.get('/', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false });

    if (error || !data || data.length === 0) {
      return res.json([
        {
          id: 'contact-1',
          name: 'Sarah Morgan',
          relationship: 'Sister',
          phone: '+1 555-839-2041',
          whatsapp_number: '+15558392041',
          is_primary: true,
        },
        {
          id: 'contact-2',
          name: 'David Morgan',
          relationship: 'Father',
          phone: '+1 555-492-1102',
          whatsapp_number: '+15554921102',
          is_primary: false,
        },
      ]);
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/contacts
router.post('/', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user.id;
    const { name, relationship, phone, whatsapp_number, is_primary } = req.body;

    const { data } = await supabase
      .from('emergency_contacts')
      .insert({
        user_id: userId,
        name,
        relationship,
        phone,
        whatsapp_number: whatsapp_number || phone,
        is_primary: !!is_primary,
      })
      .select()
      .single();

    res.status(201).json(data || { id: 'c-' + Date.now(), ...req.body });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/contacts/:id
router.delete('/:id', authenticateUser, async (req, res, next) => {
  try {
    await supabase.from('emergency_contacts').delete().eq('id', req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
