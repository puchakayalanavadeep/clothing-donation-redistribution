const express = require('express');
const cors = require('cors');
const path = require('path');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const requirementRoutes = require('./routes/requirementRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const impactRoutes = require('./routes/impactRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Controllers & Middleware Imports
const { uploadImages } = require('./controllers/userController');
const upload = require('./middleware/uploadMiddleware');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root Status API Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ReWear Connect API Backend is active and running!',
    version: '1.0.0',
    documentation: '/api'
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ReWear Connect REST API Services',
    endpoints: {
      auth: '/api/auth',
      donations: '/api/donations',
      searchDonations: '/api/search/donations',
      organizations: '/api/organizations',
      requirements: '/api/requirements',
      matches: '/api/matches',
      impact: '/api/impact',
      admin: '/api/admin',
      imageUpload: '/api/upload'
    }
  });
});

// Image Upload Endpoint
app.post('/api/upload', upload.array('images', 5), uploadImages);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/search/donations', donationRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/matches', matchingRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
