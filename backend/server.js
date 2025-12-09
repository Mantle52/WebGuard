const express = require('express');
const path = require('path');
const cors = require('cors');
const { analyzeUrl } = require('./analyzer');
const { createSimulation } = require('./simulator');

const app = express();
app.use(cors());
app.use(express.json());

// Serve testbed static pages
app.use('/testbed', express.static(path.join(__dirname, 'testbed')));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Analyze endpoint
app.post('/api/analyze', async (req, res) => {
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: 'No url provided' });
  try {
    const result = await analyzeUrl(url);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

// Simulate endpoint
app.post('/api/simulate', (req, res) => {
  const analysis = req.body || {};
  const sim = createSimulation(analysis);
  res.json(sim);
});

// Serve frontend build optionally (not required for dev)
app.use('/', express.static(path.join(__dirname, '../frontend/dist')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
