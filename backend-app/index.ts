import express from 'express';
import client from 'prom-client'
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
  res.send({ 'Hello': "Backend Server running at Port 8080" })
})

// Quick response route
app.get('/quick', (req, res) => {
  setTimeout(() => {
    try {
      generateRandomError();
      res.send({ 'Response': 'Quick response route' });
    } catch (error: any) {
      res.status(500).send({ 'error': error.message });
    }

  }, 100);
});

// Slow response route
app.get('/slow', (req, res) => {
  setTimeout(() => {
    try {
      generateRandomError();
      res.send({ 'Response': 'Slow response route' });
    } catch (error: any) {
      res.status(500).send({ 'error': error.message });
    }
  }, 3000);
})

app.get('/metrics', async (req, res) => {
  const metrics = await register.metrics();
  // Send the metrics data as a response
  res.set('Content-Type', register.contentType);
  res.send(metrics);
})

app.listen(8080, () => {
  console.log('express app running on Port 8080')
})
