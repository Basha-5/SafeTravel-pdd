import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import contactsRoutes from './routes/contacts.js';
import facilitiesRoutes from './routes/facilities.js';
import sosRoutes from './routes/sos.js';
import mapRoutes from './routes/map.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/map', mapRoutes);

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'SafeTravel - Tourist Safety Monitoring System',
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🛡️ SafeTravel backend running at http://localhost:${PORT}`);
});
