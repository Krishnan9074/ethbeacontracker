const express = require('express');
const cors = require('cors');
const path = require('path');
const { trackDeposits } = require('./app');
const depositsRoutes = require('./routes/deposits');
const logger = require('./utils/logger');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/deposits', depositsRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  trackDeposits().catch(error => logger.error('Deposit tracking error:', error));
});

// const express = require('express');
// const promClient = require('prom-client');
// const app = express();

// // Create a Registry to register the metrics
// const register = new promClient.Registry();

// // Add default metrics
// promClient.collectDefaultMetrics({ register });

// // Create a custom metric
// const httpRequestDurationMicroseconds = new promClient.Histogram({
//   name: 'http_request_duration_ms',
//   help: 'Duration of HTTP requests in ms',
//   labelNames: ['method', 'route', 'code'],
//   buckets: [50, 100, 200, 300, 400, 500] // Define your buckets here
// });

// // Register the custom metric
// register.registerMetric(httpRequestDurationMicroseconds);

// // Middleware to measure request duration
// app.use((req, res, next) => {
//   const end = httpRequestDurationMicroseconds.startTimer();
//   res.on('finish', () => {
//     end({ method: req.method, route: req.route ? req.route.path : req.path, code: res.statusCode });
//   });
//   next();
// });

// // Expose metrics endpoint
// app.get('/metrics', async (req, res) => {
//   res.set('Content-Type', register.contentType);
//   res.end(await register.metrics());
// });

// // Your existing routes
// app.use('/api/deposits', require('./src/routes/deposits'));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });