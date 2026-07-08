import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Export prisma from dedicated lib module (dotenv already loaded above)
export { prisma } from './lib/prisma';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import institutionRoutes from './routes/institutions';
import assetRoutes from './routes/assets';
import incidentRoutes from './routes/incidents';
import riskRoutes from './routes/risks';
import complianceRoutes from './routes/compliance';
import aiRoutes from './routes/ai';
import dashboardRoutes from './routes/dashboard';

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cyber Security API is running' });
});

// Setup Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
