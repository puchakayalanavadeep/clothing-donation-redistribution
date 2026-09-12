const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ♻️ ReWear Connect Backend API Service Active `);
  console.log(` 🚀 Server listening on: http://localhost:${PORT}`);
  console.log(` 🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
});
