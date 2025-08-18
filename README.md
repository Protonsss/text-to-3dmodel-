# Prompt → 3D (Meshy)
Minimal web UI + Node backend to turn text prompts into 3D models via Meshy.

## Quick start
1) `npm i`
2) Copy `.env.example` to `.env` and paste your Meshy API key
3) `export MESHY_API_KEY=... && node server.mjs`  # API on :3000
4) `python3 -m http.server 5502`                   # Frontend on :5502
5) Open `http://localhost:5502/index.html`

live demo here: https://protonsss.github.io/text-to-3dmodel-/
