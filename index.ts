import express from 'express';
import client from 'prom-client'
import { createLogger, transport } from 'winston';
import LokiTransport from 'winston-loki';

const options = {
  transports: [
    new LokiTransport({
      host: "http://192.168.29.143:3100"
    })
  ]
};
const logger = createLogger(options);

const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

const app = express();


// Helper function to generate random errors
function generateRandomError() {
  const shouldError = Math.random() < 0.5; // 50% chance of error
  if (shouldError) {
    throw new Error('Random error occurred');
  }
}
// Fast response route
app.get('/', (req, res) => {
  logger.info('home route working as expected')
  res.send({ 'Hello': "Backend Server running at Port 8080" })
})

// Quick response route
app.get('/quick', (req, res) => {
  setTimeout(() => {
    try {
      logger.info('quick route working as expected')
      generateRandomError();
      res.send({ 'Response': 'Quick response route' });
    } catch (error: any) {
      logger.info('quick route not working as expected because', error.message)
      res.status(500).send({ 'error': error.message });
    }

  }, 100);
});

// Slow response route
app.get('/slow', (req, res) => {
  setTimeout(() => {
    try {
      logger.info('slow route working as expected')
      generateRandomError();
      res.send({ 'Response': 'Slow response route' });
    } catch (error: any) {
      logger.info('slow route not working as expected because', error.message)
      res.status(500).send({ 'error': error.message });
    }
  }, 3000);
})

app.get('/metrics', async (req, res) => {
  const metrics = await register.metrics();
  logger.info('metrics route working as expected')
  res.set('Content-Type', register.contentType);
  res.send(metrics);
})

app.listen(8080, () => {
  console.log('express app running on Port 8080')
})
