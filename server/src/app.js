const mongoose = require('mongoose');
const config = require('./config/config');
const depositTrackerService = require('./services/depositTrackerService');
const logger = require('./utils/logger');

mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) => logger.error('MongoDB connection error:', error));

async function trackDeposits() {
  while (true) {
    await depositTrackerService.trackDeposits();
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 1 minute
  }
}

module.exports = { trackDeposits };