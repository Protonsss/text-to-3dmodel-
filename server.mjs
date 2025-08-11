import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());            
app.use(express.json());

const API_KEY = process.env.MESHY_API_KEY;               
const BASE    = 'https://api.meshy.ai/openapi/v2';       


app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, mode = 'preview' } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const r = await fetch(`${BASE}/text-to-3d`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        mode,                    
        topology: 'game_ready',
        texture: { resolution: 2048 }
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error || data.message || data });

    const id = data.task_id || data.id;
    if (!id) return res.status(500).json({ error: 'No task id in response', raw: data });

    res.json({ id, provider: 'meshy' });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Poll job status
app.get('/api/status', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const r = await fetch(`${BASE}/text-to-3d/${id}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error || data.message || data });

    const status   = data.status || data.task_status; 
    const glb      = data.model_urls?.glb || data.assets?.glb_url || data.model_url || null;
    const progress = data.progress ?? 0;

    res.json({ status, progress, glb, provider: 'meshy' });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});


app.get('/', (_req, res) => {
  res.type('text/plain').send('3D API OK');
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: !!API_KEY });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));