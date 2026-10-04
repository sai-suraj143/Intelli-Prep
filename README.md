# Intelli-Prep

AI-powered technical interview preparation platform. Users pick a topic, answer
questions out loud in the browser, and get scored feedback on their speech,
technical accuracy, and delivery.

> Full technical write-up — architecture, data flow, algorithms, scoring, and
> known gaps — lives in [`IMPLEMENTATION_DETAILS.md`](./IMPLEMENTATION_DETAILS.md).

## Project structure

```
.
├── client/                  # React 19 + Vite + Tailwind frontend
│   ├── public/
│   └── src/
│       ├── assets/          # hero + feature imagery
│       ├── components/      # LandingPage, Auth, Dashboard, Session
│       ├── lib/db.js        # localStorage-backed user store
│       ├── App.jsx          # top-level state + hand-rolled router
│       ├── index.css        # Tailwind entrypoint
│       └── main.jsx         # React root
├── server/                  # Express API + Python AI bridge
│   ├── evaluator.py         # transcription + speech scoring
│   ├── index.js             # /api/analyze endpoint (multer + python-shell)
│   ├── requirements.txt     # Python deps
│   └── uploads/             # runtime audio uploads (git-ignored)
├── package.json             # npm workspaces + orchestration scripts
└── IMPLEMENTATION_DETAILS.md
```

## Requirements

- Node.js >= 18
- Python 3.8+ (for the evaluator)
- FFmpeg (required by SpeechRecognition to decode the browser's WebM audio)

## Setup

```bash
npm install                       # installs client + server workspaces
pip install -r server/requirements.txt
```

## Run

```bash
npm run dev        # client on :5173, server on :5000 (both, concurrently)
```

Individually:

```bash
npm run dev:client   # Vite dev server
npm run dev:server   # Express, with --watch reload
```

## Other scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `npm run build`    | Production build of the client               |
| `npm run preview`  | Serve the built client                       |
| `npm run lint`     | ESLint over the client                       |
| `npm start`        | Start the API server without file watching   |

## How it works (short version)

1. The frontend registers/logs in against a `localStorage` user store.
2. A session presents questions one at a time and records the answer with the
   browser `MediaRecorder` API.
3. The recording is sent to `POST /api/analyze`, where Express stores it via
   multer and shells out to `evaluator.py`.
4. Python transcribes the audio, then scores it on technical keywords, filler
   words, and confidence.
5. The client renders a per-question breakdown and an overall readiness score.

> Note: the client currently simulates step 3–4 locally so the UI can be demoed
> without the Python toolchain. See "Backend integration status" in
> `IMPLEMENTATION_DETAILS.md` for exactly what is mocked and how to switch to
> the live endpoint.