# Intelli-Prep — Implementation Details

Complete technical documentation of the Intelli-Prep codebase: what every file
does, how data flows between layers, how the analysis algorithms work, how to
run it, and the known gaps that remain.

- **Repository:** https://github.com/sai-suraj143/Intelli-Prep
- **Branch:** `main`
- **Root:** repository root (npm workspaces monorepo)

---



## Table of contents

1. [System overview](#1-system-overview)
2. [Repository layout](#2-repository-layout)
3. [Technology stack](#3-technology-stack)
4. [Client implementation](#4-client-implementation)
5. [Server implementation](#5-server-implementation)
6. [Python evaluator](#6-python-evaluator)
7. [Data contracts](#7-data-contracts)
8. [Algorithms & formulas](#8-algorithms--formulas)
9. [Design system & styling](#9-design-system--styling)
10. [Persistence model](#10-persistence-model)
11. [Build, run & verify](#11-build-run--verify)
12. [Backend integration status](#12-backend-integration-status)
13. [Known issues & technical debt](#13-known-issues--technical-debt)
14. [Structural cleanup applied](#14-structural-cleanup-applied)
15. [Future work](#15-future-work)

---

## 1. System overview

Intelli-Prep is a single-page voice-based mock interview platform. A candidate
picks a technical topic, is asked a question, answers out loud, and receives a
scored evaluation of the answer.

The system is a **two-tier application**:

```
┌──────────────────────────────────────────────────────────────────┐
│  CLIENT  (React 19 + Vite, port 5173)                            │
│                                                                  │
│  Landing → Auth → Dashboard → TopicBrowser → InterviewSession     │
│                                                     ↓             │
│                                               ResultView          │
│                                                                  │
│  Data: localStorage (users/progress) · sessionStorage (session)   │
└───────────────────────────┬──────────────────────────────────────┘
                            │ POST /api/analyze   (multipart/form-data)
                            │ field name: "audio"
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  SERVER  (Express 5, port 5000)                                  │
│                                                                  │
│  cors → express.json → multer(diskStorage) → PythonShell.run()   │
└───────────────────────────┬──────────────────────────────────────┘
                            │ spawn: python evaluator.py <file>
                            │ stdout: single JSON line
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  PYTHON  evaluator.py                                           │
│                                                                  │
│  SpeechRecognition → transcript → keyword/filler analysis → JSON │
└──────────────────────────────────────────────────────────────────┘
```

**Key architectural characteristic:** the Node and Python tiers communicate over
a process boundary using a **stdout JSON contract** — Python must print exactly
one JSON object and nothing else. The client and server tiers are **not yet
connected** (see [§12](#12-backend-integration-status)).

---

## 2. Repository layout

```
Intelli-Prep/
├── .gitignore                       # node_modules, dist, uploads, __pycache__, .env
├── package.json                     # npm workspaces + orchestration scripts
├── README.md                        # setup and usage
├── IMPLEMENTATION_DETAILS.md        # this document
│
├── client/
│   ├── index.html                   # Vite entry HTML (#root mount, meta, inline SVG favicon)
│   ├── package.json                 # name: client, scripts dev/build/lint/preview
│   ├── vite.config.js               # @vitejs/plugin-react, no proxy configured
│   ├── tailwind.config.js           # content globs, default theme
│   ├── postcss.config.js            # tailwindcss + autoprefixer
│   ├── eslint.config.js             # flat config: js.recommended + react-hooks + react-refresh
│   ├── public/                      # empty (static passthrough)
│   └── src/
│       ├── main.jsx                 # createRoot + StrictMode
│       ├── App.jsx                  # app shell, auth state, view router, progress writes
│       ├── index.css                # @tailwind base/components/utilities
│       ├── lib/
│       │   └── db.js                # localStorage user store (CRUD + auth)
│       ├── components/
│       │   ├── LandingPage.jsx      # marketing page (hero, features, footer)
│       │   ├── Auth.jsx             # combined sign-in / sign-up screen
│       │   ├── Dashboard.jsx        # TOPICS data, Sidebar, DashboardHome, TopicBrowser
│       │   └── Session.jsx          # useNativeRecorder hook, InterviewSession, ResultView
│       └── assets/
│           ├── hero-image.png       # hero screenshot mockup
│           ├── feature-code.png     # feature card: live coding prep
│           ├── feature-audio.png    # feature card: speech analysis
│           └── feature-chart.png    # feature card: detailed analysis
│
└── server/
    ├── package.json                 # name: server, scripts start/dev, CommonJS
    ├── index.js                     # Express app + /api/analyze
    ├── evaluator.py                 # transcription + speech scoring engine
    ├── requirements.txt             # SpeechRecognition==3.14.3
    └── uploads/                     # runtime audio storage (git-ignored, .gitkeep tracked)
```

### Component boundaries

| Module | Owns | Does not own |
| --- | --- | --- |
| `App.jsx` | Global state (`user`, `view`, `activeTopic`, `sessionData`), routing, progress persistence | Rendering |
| `lib/db.js` | User records in `localStorage` | React state |
| `Dashboard.jsx` | `TOPICS` catalogue, navigation chrome, topic grid | Session state |
| `Session.jsx` | Microphone access, recording, question sequencing, results | Global state |
| `server/index.js` | HTTP layer, file upload, Python process lifecycle | Scoring logic |
| `server/evaluator.py` | Transcription + all scoring heuristics | HTTP concerns |

---

## 3. Technology stack

### Client

| Dependency | Version | Purpose |
| --- | --- | --- |
| `react` / `react-dom` | ^19.2.0 | UI runtime, `createRoot`, StrictMode |
| `lucide-react` | ^0.559.0 | Tree-shaken SVG icon set (no hand-written icon SVGs) |
| `react-media-recorder` | ^1.7.2 | **Declared but unused** — the native `MediaRecorder` API is used instead |
| `vite` | `rolldown-vite@7.2.5` | Dev server, bundler (Rolldown-powered Vite via npm alias) |
| `@vitejs/plugin-react` | ^5.1.1 | JSX transform + React Fast Refresh |
| `tailwindcss` | ^3.4.18 | Utility-first styling |
| `postcss` / `autoprefixer` | ^8.5.6 / ^10.4.22 | Tailwind processing + vendor prefixes |
| `eslint` + plugins | ^9.39.1 | Flat-config linting |

> **Vite is aliased.** Both `devDependencies.vite` and `overrides.vite` are
> `npm:rolldown-vite@7.2.5`. The `overrides` block forces every transitive Vite
> dependency to the Rolldown build as well, which is why it appears twice.
> Removing `overrides` would let a second Vite copy be installed and cause
> plugin duplicate-instance errors.

> **No router library.** No `react-router`. Navigation is a `view` string in
> `App` state — see [§4.1](#41-view-state-machine).

### Server

| Dependency | Version | Purpose |
| --- | --- | --- |
| `express` | ^5.2.1 | HTTP server, routing, JSON body parsing |
| `multer` | ^2.0.2 | Multipart parsing + disk storage for audio uploads |
| `python-shell` | ^5.0.0 | Spawns `evaluator.py`, captures stdout |
| `cors` | ^2.8.5 | Cross-origin access for the Vite dev server |

### Python

| Package | Version | Purpose |
| --- | --- | --- |
| `SpeechRecognition` | 3.14.3 | Audio decoding (`AudioFile`) + ASR (`recognize_google`) |

External binary: **FFmpeg** — `SpeechRecognition` shells out to it to convert the
browser's `audio/webm` into PCM WAV. Without FFmpeg installed, transcription
raises `ValueError`, which the evaluator catches and converts into a simulated
transcript ([§6.3](#63-format-failure-simulation)).

---

## 4. Client implementation

### 4.1 View state machine

`App.jsx` holds a single `view` string. There are five views plus an auth flow:

```
                    ┌──────────────────────────────────────────┐
                    │                                          │
  "landing" ──Get started──▶ "auth" ──onLogin──▶ "dashboard" ◀─┤
      │                        │  ▲                    │        │
      │                        │  └───Back to Home─────┘        │
      │                        │                          │     │
      └──Explore topics──▶ [auth if !user]                ▼     │
                             "topics" ──start──▶ "session"  "result"
                                                       │          │
                                                       └─cancel───┘
```

| View | Rendered component | Sidebar shown |
| --- | --- | --- |
| `landing` | `LandingPage` | no |
| `auth` | `AuthScreen` | no |
| `dashboard` | `DashboardHome` | yes |
| `topics` | `TopicBrowser` | yes |
| `session` | `InterviewSession` | no |
| `result` | `ResultView` | no |

Layout is applied in `App.jsx`: the sidebar is fixed `w-64` on the left, and
`<main>` is offset with `md:ml-64` only for `dashboard` and `topics`. The
sidebar itself is `hidden md:flex`, so **there is no mobile navigation** — see
[§13](#13-known-issues--technical-debt).

Navigation is implemented with early returns at the top of `App`, so
`LandingPage` and `AuthScreen` render outside the flex layout wrapper entirely.

### 4.2 Authentication (`lib/db.js` + `Auth.jsx`)

The auth layer is a **client-side simulation**. There is no server, no hashing,
and no token.

`localStorage` key `intelli_users` holds an array of user objects:

```js
{
  name: "John Doe",
  email: "john@example.com",
  password: "plaintext",     // stored in cleartext
  progress: { dsa: 3, sys: 1 },  // questions solved per topic id
  totalHours: 0.25,          // accumulated session time in hours
  streak: 1,                 // never updated after registration
  joinedAt: "2026-01-01T00:00:00.000Z"
}
```

API surface:

| Function | Behaviour |
| --- | --- |
| `db.getUsers()` | Parses `intelli_users`, defaults to `[]` |
| `db.saveUser(user)` | Upsert by `email` (find index → replace, else push) |
| `db.findUser(email, password)` | Linear scan, exact match on both fields |
| `db.register(name, email, password)` | Rejects duplicate email with `{ error }`, else creates and returns `{ user }` |

`AuthScreen` toggles `isLogin` to switch between sign-in and sign-up modes.
Sign-up validates that all three fields are non-empty; there is **no email
format validation and no password strength check** beyond `type="email"`.
Errors render in a red `AlertCircle` banner above the form.

**Session persistence:** on mount, `App` reads `sessionStorage.intelli_user` and
jumps straight to `dashboard` if present. `sessionStorage` (not `localStorage`) is
used deliberately so closing the tab signs the user out.

### 4.3 Topic catalogue (`Dashboard.jsx`)

`TOPICS` is a module-level exported array of 9 topic objects. This is the single
source of truth for topic metadata and is imported by both `Dashboard.jsx` and
`Session.jsx`.

```js
{
  id: "dsa",                          // used as the progress-map key
  name: "Data Structures",
  description: "Arrays, Trees, Graphs",
  icon: <Code className="w-6 h-6" />,  // a React element, not a component ref
  color: "bg-blue-600",               // progress bar fill
  bgColor: "bg-blue-50",              // icon tile background
  textColor: "text-blue-600",         // icon tile foreground
  questionsCount: 12,                 // denominator for progress percentage
}
```

| id | Name | Questions |
| --- | --- | --- |
| `dsa` | Data Structures | 12 |
| `sys` | System Design | 8 |
| `hr` | Behavioral (HR) | 15 |
| `fe` | Frontend React | 10 |
| `be` | Backend Node | 9 |
| `cloud` | Cloud & DevOps | 7 |
| `mobile` | Mobile Development | 6 |
| `ai` | AI/ML Engineering | 5 |
| `sec` | Cybersecurity | 8 |

Because `icon` is a rendered element, icons are instantiated once at module load
and shared by every card — a single `Code` element instance is reused for both
`dsa` and `ai`.

### 4.4 Question bank (`Session.jsx`)

`QUESTIONS` is a separate module-level map of `topicId → string[]`. It is
**independent of `TOPICS.questionsCount`** — the counts are for display only and
never drive how many questions are asked.

| Topic id | Questions |
| --- | --- |
| `dsa` | 4 |
| `sys` | 4 |
| `hr` | 4 |
| `fe` | 4 |
| `be` | 4 |
| `cloud` | 4 |
| `mobile`, `ai`, `sec` | **0 → fall back to `QUESTIONS.dsa`** |

The fallback chain is `QUESTIONS[topicId] || QUESTIONS.dsa`, so a candidate who
selects *AI/ML Engineering* is silently asked Data Structures questions. The
module also imports `React` symbols that are not all used, and imports the icon
set from `lucide-react` in `Session.jsx` where only a subset is rendered.

### 4.5 Recording pipeline (`useNativeRecorder` hook)

A custom hook in `Session.jsx` wraps the browser `MediaRecorder` API.

**Start flow:**
1. `navigator.mediaDevices.getUserMedia({ audio: true })` → permission prompt.
2. `new MediaRecorder(stream)` — **no `mimeType` option**, so the browser picks
   its default. Chrome and Firefox choose `audio/webm`; Safari chooses
   `audio/mp4`. This is the root cause of the FFmpeg dependency ([§6.3](#63-format-failure-simulation)).
3. `ondataavailable` pushes non-empty chunks into `chunksRef`.
4. `start()` is called; `isRecording` becomes `true`.

**Stop flow:**
1. `stop()` fires `onstop`.
2. Chunks are joined: `new Blob(chunksRef, { type: "audio/webm" })` — the Blob
   MIME type is **hardcoded** regardless of what the browser actually produced.
3. `URL.createObjectURL(blob)` produces a `blob:` URL handed to `onStop`.
4. **Every `MediaStreamTrack` is stopped** to release the microphone — this is
   the critical cleanup step that prevents the browser's recording indicator from
   staying lit.
5. `isRecording` returns to `false`.

**Error handling:** a `getUserMedia` rejection (permission denied, no device) is
logged and surfaced with `alert("Could not access microphone. Please allow
permissions.")`. No React error state is set, so the UI gives no persistent
feedback.

**Object URL lifecycle:** `audioUrl` is stored in the answers array and rendered
in `<audio src={...}>` on the results page. `URL.revokeObjectURL` is **never
called**, so each answer leaks a blob for the lifetime of the page.

### 4.6 Session state machine (`InterviewSession`)

| State | Type | Purpose |
| --- | --- | --- |
| `currentQuestionIndex` | number | 0-based cursor into `questions` |
| `answers` | array | One result object per completed answer |
| `analyzing` | boolean | Swaps the UI to the "Analyzing…" spinner |
| `timer` | number | Whole **seconds** since mount |
| `timerRef` | ref | `setInterval` handle for cleanup |

**Timer:** a 1-second `setInterval` increments `timer` by 1 on mount and clears
on unmount. Display is formatted by `formatTime(seconds)` →
`"M:SS"` with zero-padded seconds (e.g. `90` → `"1:30"`). The raw second count
is what gets persisted as `totalHours`.

**Answer loop (`handleRecordingStop`):**

```
user stops recording
      ↓
analyzing = true
      ↓
await 2000ms (simulated API latency)
      ↓
fillerCount = floor(random() * 8)              → 0…7
score       = max(1, 10 - fillerCount - floor(random() * 2))  → 1…10
confidence  = score > 8 ? "High" : score > 5 ? "Medium" : "Low"
      ↓
answers = [...answers, result]
      ↓
more questions?  ──yes──▶ currentQuestionIndex++
      └──no──▶  onFinish({
                   topic, date, score,
                   answers, duration: timer
                 })
```

Each result object records `question`, `transcript`, `feedback`, `score`,
`audioUrl`, `duration` (hardcoded `30`), `fillerCount`, `confidence`, `pacing`.

Because the scoring inputs are `Math.random()`, **a perfect 10 is essentially
unreachable** — `fillerCount` must be 0 *and* the second random draw must be 0,
a 1-in-80 chance per answer. The overall score is the mean of per-answer scores,
so a session of 4 answers almost always lands below 10.

`duration: 30` is stored per answer but the real elapsed time is only known for
the whole session. The results page therefore shows the same `30s` next to every
question regardless of how long the candidate actually spoke.

**Abort semantics:** `onCancel` ("End Session") unmounts the component and
discards all accumulated answers. There is no partial-credit save.

### 4.7 Recording visualisation

While recording, 20 animated bars are rendered:

```jsx
[...Array(20)].map((_, i) => (
  <div style={{ height: `${Math.max(20, Math.random() * 100)}%`,
                animationDelay: `${i * 0.05}s`,
                animationDuration: '0.8s' }} />
))
```

`Math.random()` is called during render, so the heights are not stable across
re-renders and React may log a purity warning under StrictMode. The Tailwind
classes `animate-wave`, `animate-fade-in-up`, and `animate-ping` are used, but
**none of them are defined** — `tailwind.config.js` has an empty
`theme.extend` — so these animations are inert and fall back to no motion.

### 4.8 Dashboard metrics (`DashboardHome`)

Three stat cards and three progress cards are computed from the user record:

```js
const totalSolved = Object.values(user.progress || {}).reduce((a, b) => a + b, 0);
const solved      = user.progress?.[topic.id] || 0;
const percent     = Math.min(100, Math.round((solved / topic.questionsCount) * 100));
```

- **Hours Practiced** — `user.totalHours`, accumulated on session finish.
- **Questions Solved** — sum of all `progress` values.
- **Day Streak** — `user.streak`, written once as `1` at registration and never
  incremented, so it is always `1`.

`Continue Learning` renders `TOPICS.slice(0, 3)` (Data Structures, System
Design, Behavioral). The cards navigate to `topics` but do not deep-link to the
specific topic.

### 4.9 Progress write-back (`App.handleFinishSession`)

Called by `InterviewSession` when the last question is answered:

```js
const updatedUser = { ...user };
if (!updatedUser.progress) updatedUser.progress = {};

updatedUser.progress[activeTopic] =
  (updatedUser.progress[activeTopic] || 0) + data.answers.length;

const hoursAdded = data.duration / 3600;
updatedUser.totalHours =
  parseFloat(((updatedUser.totalHours || 0) + hoursAdded).toFixed(2));

db.saveUser(updatedUser);
sessionStorage.setItem("intelli_user", JSON.stringify(updatedUser));
setUser(updatedUser);
```

Three writes are needed because there are two stores: `db.saveUser` persists to
`localStorage`, and `sessionStorage` + React state refresh the live session.
`.toFixed(2)` bounds float drift from repeated second→hour division.

Because `totalHours` is rounded to 2 decimals, the 5th very short session can
round away entirely (`0.004h` sessions). Also note the count increments by
`answers.length` regardless of the answers' quality — unanswered or aborted
questions are not distinguished.

### 4.10 Results view (`ResultView`)

**Overall score dial:** a hand-rolled SVG donut. Circumference is a hardcoded
`440` (an approximation of `2πr` for `r=70`, which is really `439.8`):

```jsx
strokeDasharray="440"
strokeDashoffset={440 - (440 * data.score) / 10}
```

`data.score` is on a 0–10 scale (Python emits 0–100, see [§7](#7-data-contracts)),
so the dial assumes the client-side scale. Colour thresholds: green ≥ 8, amber
≥ 5, red below.

**Derived metrics:**

| Metric | Formula |
| --- | --- |
| Duration | `Math.floor(duration / 60)` minutes + `duration % 60` seconds |
| Questions | `answers.length` |
| Avg. Fillers | `(Σ fillerCount / answers.length).toFixed(1)` |
| Confidence | `score >= 8 ? "High" : score >= 5 ? "Medium" : "Low"` |

`avgFillers` divides by `answers.length` with no zero-guard; an empty answers
array yields `NaN`. Reachable in practice only if the final answer is recorded
and then the session is finished — currently impossible, but fragile.

The `confidence` value stored on each answer is never used; the page
recomputes confidence from the overall score instead.

### 4.11 Landing page

A static marketing page: fixed blurred navbar with smooth-scroll anchors
(`#features`, `#footer`), hero with a browser-chrome-framed screenshot, three
feature cards (Live Coding Prep, Speech Analysis, Detailed Analysis), and a
four-column footer. Only feature card 1 is clickable and routes to `topics`.

Placeholders that are inert: navbar items *One Company*, *Search Analysis*,
*Recent Program* scroll to arbitrary sections; all social and footer links are
`href="#"`; Instagram/Linkedin/X icons have no URLs.

---

## 5. Server implementation

`server/index.js` — 72 lines, CommonJS, single route.

### 5.1 Middleware order

```js
app.use(cors());            // 1. permissive CORS for the Vite origin
app.use(express.json());    // 2. JSON body parsing (unused by /api/analyze)
```

`cors()` is opened to all origins with no allow-list, and there is **no
authentication, rate limiting, or body size cap** on the upload route.

### 5.2 Upload directory bootstrap

```js
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
```

Resolving the path with `__dirname` rather than a relative literal is what
prevents the `ENOENT` failure — the process CWD is not guaranteed to be
`server/`. The directory is force-created on boot, so a fresh clone works
without manual setup.

### 5.3 Multer disk storage

```js
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
```

Filenames are `<epoch-ms>-<originalname>`. The `originalname` segment is
**unsanitised user input written into the filesystem path**, and `multer` is
configured with no `limits`, so there is no cap on file size, count, or field
size — a large upload will be buffered to disk without bound.

### 5.4 `POST /api/analyze`

```
Request:  multipart/form-data, single field named "audio"
Response: 200 application/json — the parsed evaluator output
          400 { error: "No audio file received" }
          500 { error: "AI Engine Failed", details }
```

Handler flow:

1. Guard `!req.file` → `400`.
2. Log the saved path.
3. Spawn Python:

```js
const options = {
  mode: "text",
  pythonPath: "python",
  pythonOptions: ["-u"],
  args: [req.file.path],
};
PythonShell.run("evaluator.py", options)
```

| Option | Why |
| --- | --- |
| `mode: "text"` | Collect raw stdout strings |
| `pythonPath: "python"` | Windows-friendly binary name (see below) |
| `pythonOptions: ["-u"]` | Unbuffered stdout — critical, since a buffered child would appear to hang |
| `args: [req.file.path]` | Passes the absolute upload path as `sys.argv[1]` |

`evaluator.py` is resolved relative to the **process CWD**, not `__dirname`. The
route therefore only works if the server is started from inside `server/` (which
`npm run dev:server`, via `npm --workspace`, guarantees).

On Linux/macOS the binary is usually `python3`; `python` may be absent or point
at Python 2. This is a portability landmine — `pythonPath` is hardcoded and
there is no fallback or config override.

4. Resolve:

```js
.then((messages) => {
  if (!messages || messages.length === 0) throw new Error("Python script returned empty response");
  const result = JSON.parse(messages[0]);
  res.json(result);
})
```

`messages[0]` is the **first** stdout line. Any `print`, warning banner, or
library log line emitted before the JSON payload breaks parsing — hence the
`print ONLY the JSON string` warning at the bottom of `evaluator.py`.

5. Catch → `500` with `err.message`.

**The upload is never deleted.** Every request permanently adds a file to
`server/uploads/`, so the directory grows without bound.

The server listens on a hardcoded port `5000` with no `PORT` env override and no
`SIGTERM`/`SIGINT` handling.

---

## 6. Python evaluator

`server/evaluator.py` — 80 lines, stdlib + `SpeechRecognition`. Invoked as
`python evaluator.py <audio_path>`.

### 6.1 Transcription

```python
recognizer = sr.Recognizer()
with sr.AudioFile(file_path) as source:
    audio_data = recognizer.record(source)
    text = recognizer.recognize_google(audio_data)
```

`recognize_google` calls Google's free Speech API **over the network with no API
key**. It requires internet access per request, and Google may throttle or reject
it under load. There is no retry, no timeout, and no alternative/offline engine
(e.g. `whisper`), so the pipeline fails closed without connectivity.

### 6.2 Exception handling

The transcription call is wrapped in three handlers that never let an exception
escape:

| Exception | Cause | Simulated text |
| --- | --- | --- |
| `ValueError` | Audio is not PCM WAV (i.e. WebM/MP4) — **the expected case** | A hardcoded HashMap sentence |
| `sr.UnknownValueError` | Silence or unintelligible audio | `"..."` |
| `Exception` | Anything else (network, permissions, codec) | `"Error processing audio."` |

Each branch also sets `error_message`, which is surfaced as `debug_note` in the
response — so the UI can tell the user *why* the analysis looks synthetic.

### 6.3 Format-failure simulation

Because the browser records `audio/webm` and the server stores it with that
extension, **every real request lands in the `ValueError` branch on a machine
without FFmpeg**. The evaluator then reports a canned HashMap transcript and a
fixed score of `85`:

```python
if error_message and "WebM" in error_message:
    score = 85
```

This is an intentional demo affordance — the product is demonstrable without
installing FFmpeg or a Google API key — but it means a "successful" analysis
currently carries no information about the candidate's actual answer.

Two genuine fixes exist: install FFmpeg, or have the client record
`audio/wav` via an `AudioContext` resample. Note that `SpeechRecognition` accepts
FLAC on some platforms, so `audio/x-flac` is another option.

### 6.4 Analysis

All heuristics operate on the lowercased transcript.

**Keyword matching:**

```python
keywords = ["complexity", "optimization", "scalability", "structure", "hash", "index"]
found_keywords = [word for word in keywords if word in text.lower()]
```

Substring matching, not word matching — `"hashes"` matches `"hash"`, and so does
`"hashmap"`. Keywords are **hardcoded globally**, so they are DSA-flavoured even
when the question is behavioural or system design.

**Filler detection:**

```python
fillers = ["um", "uh", "like", "basically", "actually"]
filler_count = sum(text.lower().count(f) for f in fillers)
```

`str.count` returns **substring** occurrences, not words, and is not
word-boundary aware. `"likewise"` → 1 filler, `"um"` inside `"summary"` → 1
filler. `"like"` inside `"likely"` → 1 filler. Real transcripts routinely inflate
this count substantially.

### 6.5 Scoring

```python
base_score = 70
score = base_score + (len(found_keywords) * 5) - (filler_count * 2)
if error_message and "WebM" in error_message:
    score = 85
score = max(0, min(100, score))
```

| Component | Points |
| --- | --- |
| Base | 70 |
| Each unique keyword found | +5 (max +30 for all six) |
| Each filler occurrence | −2 |
| WebM simulation override | fixed 85 |
| Clamp | 0 … 100 |

**The scale is 0–100, but the client renders 0–10.** `ResultView` divides
`data.score` by 10 for the dial and compares against 8 and 5 for
green/amber/red thresholds. Wiring the real endpoint in without rescaling would
clamp every result to a full dial at 100% and always show "High" confidence.

**Ceiling:** 70 + 30 = **100**, and only with all six keywords present *and* zero
fillers. Any filler drops the score immediately.

The score is a keyword-density heuristic, not an assessment of correctness — a
candidate who repeats "complexity optimization scalability" ten times without
answering scores near the maximum.

### 6.6 Output

```python
result = {
    "transcript": text,
    "score": score,                       # 0–100
    "filler_count": filler_count,
    "keywords_found": found_keywords,
    "feedback": "Good use of technical terms." if found_keywords else "Could not detect keywords. (Audio format issue)",
    "debug_note": error_message or "Audio Processed Successfully",
}
print(json.dumps(result))
```

Two design constraints are load-bearing and easy to break:

1. **Exactly one `print`, no banners.** `python-shell` parses `messages[0]`; a
   stray print shifts the JSON out of position and yields a `JSON.parse`
   failure.
2. **The top-level `try/except` always prints valid JSON**, so even a crash
   during analysis produces parseable output:

```python
except Exception as e:
    print(json.dumps({"error": "Critical Script Failure", "details": str(e)}))
```

`json.dumps` is not `print(..., flush=True)`, so `pythonOptions: ["-u"]` is what
guarantees the payload is not lost in a buffer.

Note that in the failure path the returned object contains an `error` key but
**no `score` key**, and `server/index.js` forwards it verbatim with HTTP 200 — so
a critical Python failure surfaces to the UI as a successful response with
undefined metrics rather than as an error.

### 6.7 The import is outside the safety net

The "ultimate fallback" `try/except` in `__main__` does **not** cover the
module-level import on line 3, which executes before `__main__` is ever
reached. If `speech_recognition` is missing, Python dies with a traceback on
stderr and prints **nothing** to stdout.

Verified behaviour with the dependency absent:

```
$ python evaluator.py uploads/1765531050990-interview.wav
Traceback (most recent call last):
  File "evaluator.py", line 3, in <module>
    import speech_recognition as sr
ModuleNotFoundError: No module named 'speech_recognition'
exit=1
```

`python-shell` therefore returns zero messages, `index.js` throws
`Python script returned empty response`, and the client receives:

```
HTTP 500 {"error":"AI Engine Failed",
          "details":"ModuleNotFoundError: No module named 'speech_recognition'"}
```

The outcome is a correct 500 with a useful message, but it arrives by accident
rather than by design. Moving the import inside the `try` block, or guarding it
explicitly, would let the script emit the documented JSON error payload instead
of crashing — see [§15](#15-future-work).

---

## 7. Data contracts

### 7.1 `POST /api/analyze`

**Request**

```
Content-Type: multipart/form-data
audio: <audio file>   ← field name must be exactly "audio"
```

**200 response** (shape produced by `evaluator.py`, scale as noted above)

```json
{
  "transcript": "The HashMap is a data structure that stores key-value pairs.",
  "score": 85,
  "filler_count": 3,
  "keywords_found": ["structure", "hash"],
  "feedback": "Good use of technical terms.",
  "debug_note": "Browser sent WebM audio. (Real transcription requires FFmpeg.)"
}
```

**400** `{ "error": "No audio file received" }`
**500** `{ "error": "AI Engine Failed", "details": "<message>" }`

### 7.2 Client-side answer object (what the UI actually consumes today)

```json
{
  "question": "How does a hash map work?",
  "transcript": "This is a simulated transcript of the user's answer...",
  "feedback": "Excellent clear delivery...",
  "score": 8,
  "audioUrl": "blob:http://localhost:5173/9f2c...",
  "duration": 30,
  "fillerCount": 2,
  "confidence": "High",
  "pacing": "Good"
}
```

### 7.3 Contract mismatches to resolve when wiring up

| Field | Python emits | Client expects | Impact |
| --- | --- | --- | --- |
| `score` | `0–100` | `0–10` | Dial overflows; all results read "High" |
| `filler_count` | snake_case | `fillerCount` | `Avg. Fillers` renders `NaN` |
| `keywords_found` | present | unused | No UI for it yet |
| `transcript` | present | present | Compatible |
| `feedback` | present | present | Compatible |
| `debug_note` | present | unused | Should be surfaced to the user |
| `confidence` | absent | required | Needs a client-side or Python-side derivation |
| `pacing` | absent | required | Needs a real implementation |

### 7.4 Session summary object

Passed to `onFinish` and consumed by `ResultView`:

```json
{
  "topic": "Data Structures",
  "date": "10/4/2026",
  "score": 8,
  "duration": 134,
  "answers": [ /* answer objects */ ]
}
```

`score` is the arithmetic mean of `answers[].score`; `duration` is whole seconds.

---

## 8. Algorithms & formulas

| Metric | Location | Formula |
| --- | --- | --- |
| Transcript keyword score | `evaluator.py` | `70 + 5·|keywords_found| − 2·filler_count` |
| Filler count | `evaluator.py` | `Σ text.count(filler)` over 5 fillers, no word boundaries |
| Session score | `Session.jsx` | `round(Σ answers[].score / answers.length)` |
| Simulated score | `Session.jsx` | `max(1, 10 − fillerCount − floor(random()·2))` |
| Confidence | `Session.jsx` | `score > 8 → High`, `> 5 → Medium`, else `Low` |
| Avg fillers | `ResultView` | `(Σ fillerCount / answers.length).toFixed(1)` |
| Dial offset | `ResultView` | `440 − (440 · score / 10)` |
| Topic progress | `DashboardHome` | `min(100, round(solved / questionsCount · 100))` |
| Total solved | `DashboardHome` | `Σ Object.values(progress)` |
| Hours accumulated | `App` | `totalHours += duration / 3600`, rounded to 2dp |
| Timer display | `Session` | `floor(s/60) : pad(s % 60)` |

---

## 9. Design system & styling

Tailwind 3 with the **stock palette** — no custom theme tokens.

**Visual language**

- Rounded geometry: `rounded-3xl` on cards, `rounded-xl` on controls, `rounded-full` on avatars and the mic button.
- Layering: `shadow-xl shadow-slate-200/50` on elevated cards, `border border-slate-100` as the hairline.
- Surfaces: `bg-white` primary, `bg-slate-50` for page and sidebar backgrounds.
- Interactive accent is **black** (`bg-black hover:bg-slate-800`), with blue reserved for links and progress.
- Type scale runs `text-xs` → `text-6xl`, mostly `font-extrabold` headings and `font-medium` body.

**Status colours** are applied inline at each call site rather than centralised:

| Meaning | Colour |
| --- | --- |
| Success / high score | `text-green-600`, `bg-green-50/100` |
| Warning / medium | `text-yellow-600`, `bg-orange-*` |
| Danger / low | `text-red-500/600`, `bg-red-50` |
| Recording active | `bg-red-500` mic button with `scale-110` |

**Motion** relies on `animate-ping` (recording ring, analysis spinner),
`animate-pulse` (CPU icon), and the custom `animate-wave` / `animate-fade-in-up`
waveform bars. Only `animate-ping` and `animate-pulse` are real Tailwind
utilities; the two custom keyframes are referenced but never registered.

**Responsive behaviour:** `md:` breakpoints handle the auth split-panel
(`md:flex-row`), the topic grid (`md:grid-cols-2 lg:grid-cols-3`), and the
dashboard stat cards (`md:grid-cols-3`). The sidebar is `hidden md:flex`.

**Accessibility gaps:** the mic button, all navbar items, and the interactive
feature cards are `<button>`/`<div onClick>` with **no `aria-label`** and no
visible text on some of them; there is no focus-visible ring styling; the
waveform conveys recording state through colour and motion only.

---

## 10. Persistence model

| Store | Key | Contents | Lifetime |
| --- | --- | --- | --- |
| `localStorage` | `intelli_users` | `User[]` — credentials, `progress`, `totalHours`, `streak` | Persistent, cleared manually |
| `sessionStorage` | `intelli_user` | The single active `User` | Per tab |
| Memory | React state | `user`, `view`, `activeTopic`, `sessionData` | Per page load |
| Filesystem | `server/uploads/` | Raw `.webm` recordings | Permanent, never deleted |
| Python | none | — | — |

There is **no database**. No server-side user store, no session/token model, no
API for progress or history. Because both stores key off `email` and progress is
written on every session, progress survives reloads and browser restarts, but
it is per-browser, per-machine, and trivially editable from the console. Answer
history is **not persisted** — `sessionData` lives only in memory, so a refresh
on the results page leaves `data` undefined and `ResultView` throws.

---

## 11. Build, run & verify

### 11.1 Install

```bash
npm install                                  # workspaces: client + server
pip install -r server/requirements.txt       # SpeechRecognition
```

### 11.2 Develop

```bash
npm run dev          # concurrently: client :5173, server :5000
npm run dev:client   # vite only
npm run dev:server   # node --watch index.js only
```

Vite serves the client with HMR on `http://localhost:5173`; the API is on
`http://localhost:5000`. `cors()` is fully permissive, so no Vite proxy is
required.

### 11.3 Verify

```bash
npm run lint         # ESLint flat config over client
npm run build        # production bundle → client/dist
npm run preview      # serve the built bundle
npm start            # run the API without --watch
```

No test framework is configured in either package — `server/package.json` has no
`test` script and the client has no test runner.

#### Lint baseline

`npm run lint` currently fails with **4 pre-existing errors**. These were
confirmed present on the original committed code (`de5e92d2`) and are not
regressions from the restructure. They are all instances of issues catalogued
in [§13](#13-known-issues--technical-debt):

| File:line | Rule | Issue |
| --- | --- | --- |
| `src/App.jsx:19` | `react-hooks/set-state-in-effect` | `setUser`/`setView` called directly in the mount effect |
| `src/components/Dashboard.jsx:18` | `react-refresh/only-export-components` | `TOPICS` constant exported from a component file — breaks Fast Refresh for that module |
| `src/components/Session.jsx:133` | `no-unused-vars` | `audioBlob` parameter is never used |
| `src/components/Session.jsx:248` | `react-hooks/purity` | `Math.random()` called during render for waveform bar heights |

The build is unaffected — `vite build` does not run ESLint.

### 11.4 Manual smoke test

1. `npm run dev`, open `http://localhost:5173`.
2. *Get started* → register a new account → land on the dashboard with 0 stats.
3. *Practice Topics* → **Data Structures**.
4. Record an answer to Q1, stop, wait for the (mocked) 2s analysis.
5. Repeat for Q2–Q4; the results view opens automatically.
6. *Back to Dashboard* → confirm Questions Solved = 4 and progress bar moved.

To exercise the real backend:

```bash
curl -F "audio=@sample.wav" http://localhost:5000/api/analyze
```

Verified responses:

| Scenario | Result |
| --- | --- |
| `POST` with no file part | `400 {"error":"No audio file received"}` |
| Valid file, dependency installed, WebM input, no FFmpeg | `200` with `score: 85` and the WebM `debug_note` |
| Valid file, `speech_recognition` missing | `500 {"error":"AI Engine Failed","details":"ModuleNotFoundError..."}` |

> `npm run dev:server` must be launched through the workspace script so the
> process CWD is `server/` — `evaluator.py` is resolved relative to it
> ([§5.4](#54-post-apianalyze)).

---

## 12. Backend integration status

**The client never calls the server.** `Session.jsx` imports no `fetch` and no
`axios`; `handleRecordingStop` fabricates its result after a `setTimeout(2000)`.
The Express route and the Python evaluator are fully implemented and runnable,
but nothing routes to them.

Everything downstream of transcription is therefore currently simulated on both
tiers. The comments in `Session.jsx` (`// Simulating response for now to work
without backend`) mark this as deliberate.

### To wire it up

**1. Add a dev proxy** in `client/vite.config.js` so the browser stays
same-origin and no CORS or env plumbing is needed:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": { target: "http://localhost:5000", changeOrigin: true } },
  },
});
```

**2. Replace the mock in `handleRecordingStop`** — `blob` is already provided by
`onStop`, so no file plumbing is needed:

```js
const formData = new FormData();
formData.append("audio", blob, "answer.webm");

const res = await fetch("/api/analyze", { method: "POST", body: formData });
if (!res.ok) throw new Error(`Analysis failed: ${res.status}`);
const data = await res.json();
```

**3. Map the response to the answer shape `ResultView` expects**, including the
scale fix:

```js
const result = {
  question: currentQuestion,
  transcript: data.transcript,
  feedback: data.feedback,
  score: Math.round(data.score / 10),        // 0–100 → 0–10
  audioUrl,
  duration: measuredSeconds,
  fillerCount: data.filler_count,             // snake_case → camelCase
  confidence: derivedFromScore,
  pacing: "—",
};
```

**4. Surface `debug_note`** in the UI so users learn why an answer scored 85, and
fall back gracefully when `data.error` is set (the Python failure path returns
`error` with no `score`).

**5. Measure real duration** from the `MediaRecorder` start/stop timestamps
instead of the hardcoded `30`, and store per-answer seconds so the results page
stops showing `30s` for every question.

---

## 13. Known issues & technical debt

**Functional**

1. **Client and server are disconnected** — analysis is fully simulated in the browser ([§12](#12-backend-integration-status)).
2. **Score scale mismatch** — Python emits `0–100`, the UI assumes `0–10` ([§7.3](#73-contract-mismatches-to-resolve-when-wiring-up)).
3. **Filler-count field name mismatch** — `filler_count` vs `fillerCount`; `Avg. Fillers` would render `NaN` if wired directly.
4. **Three topics have no questions** — `mobile`, `ai`, `sec` silently fall back to DSA questions.
5. **`questionsCount` is decorative** — the 6–15 per-topic counts never match the 4 questions actually asked, so progress bars read ~33% after a full session.
6. **Answers are not persisted** — a refresh on the results page crashes `ResultView` on undefined `data`.
7. **No mobile navigation** — the sidebar is `hidden md:flex` with no hamburger or drawer; content is unreachable below 768px.
8. **`streak` is never updated** — permanently `1`.
9. **Object URLs are never revoked** — one leaked blob per answer.
10. **Uploads are never deleted** — `server/uploads/` grows without bound.

**Correctness / robustness**

11. **Filler counting is substring-based** — `"likely"`, `"summary"`, `"likewise"` all register false fillers ([§6.4](#64-analysis)).
12. **Keyword matching is substring-based and topic-agnostic** — DSA keywords are applied to behavioural answers.
13. **Hardcoded `pythonPath: "python"`** — fails on systems where only `python3` exists ([§5.4](#54-post-apianalyze)).
14. **`evaluator.py` path is CWD-relative** — the route breaks if the server is started from the repo root.
15. **Unsanitised `originalname` in the upload path** — user-controlled input reaches the filesystem.
16. **No `multer.limits`** — no cap on upload size or field count.
17. **`cors()` is wide open** and there is **no auth or rate limiting** on an endpoint that calls a third-party API per request.
18. **Python `ValueError` path returns 200 with no `score`** — critical failures look successful ([§6.6](#66-output)).
18a. **The `speech_recognition` import sits outside the `try/except` safety net** — a missing dependency yields an empty stdout, which `index.js` reports as the misleading `"Python script returned empty response"` rather than the intended JSON error payload ([§6.7](#67-the-import-is-outside-the-safety-net)).
18b. **`npm run lint` fails with 4 pre-existing errors** on `App.jsx:19`, `Dashboard.jsx:18`, and `Session.jsx:133`/`248` — see the lint baseline in [§11.3](#113-verify).
19. **`Google STT is unauthenticated and network-dependent`** — no retry, no timeout, no offline fallback.
20. **`recognize_google` is unthrottled** — Google will start rejecting calls.
21. **`Math.random()` in render** (`Session.jsx` waveform) — impure render, StrictMode warnings.
22. **`avgFillers` has no zero-division guard.**
23. **Hardcoded `440` dash circumference** — `2πr` for `r=70` is `439.82`.
24. **`handleRecordingStop` closes over stale `answers`/`timer`** — safe only because it is created fresh per render.
25. **Clear the 4-error lint baseline** — fix the `Math.random()` render purity, drop the unused `audioBlob` param, move `TOPICS` out of `Dashboard.jsx`, and reconcile the session-restore effect.

**Hygiene**

26. **`react-media-recorder` is installed but unused** — the native `MediaRecorder` API is used instead.
27. **`animate-wave` and `animate-fade-in-up` are undefined** in Tailwind — the waveform does not animate.
28. **Blob MIME type is hardcoded to `audio/webm`** regardless of the browser's actual format.
29. **Hardcoded port `5000`**, no `PORT` env override, no graceful shutdown.
30. **Landing-page copy is placeholder** ("One Company", "Search Analysis", "Recent Program", `href="#"` links).
31. **Passwords stored in plaintext** in `localStorage`, alongside the credentials they protect.
32. **No tests** in either package, no CI, no lint on the server.
33. **No accessibility labels** on icon-only controls.
34. **Revealing teaching comments left in `index.js`** ("This fixes the ENOENT error by telling Windows exactly where to look") — accurate, but they document past bugs rather than current behaviour.

---

## 14. Structural cleanup applied

The repository was reorganised as part of producing this document.

### Before

```
Intelli-Prep/                      ← stray, untracked .gitignore
└── Intelli-Prep/                  ← actual repo, duplicated name
    ├── .git/
    ├── .gitignore                 ← not tracked
    ├── client/
    └── server/
```

The checkout directory contained a nested folder of the same name, and the
`.gitignore` sat one level above the repository root — so it had no effect.

### After

```
Intelli-Prep/                      ← repository root
├── .git/
├── .gitignore                     ← now tracked and effective
├── package.json                   ← workspaces + orchestration
├── README.md
├── IMPLEMENTATION_DETAILS.md
├── client/
└── server/
```

### Changes made

| # | Change | Reason |
| --- | --- | --- |
| 1 | Moved `.git`, `client/`, `server/` up one level; deleted the nested folder | Removed the duplicated directory level. History, branch, and the `origin` remote verified intact (`main`, 8 commits, clean tree) |
| 2 | Rewrote `.gitignore` at the true root; added `node_modules/`, `dist/`, `server/uploads/*`, `__pycache__/`, `.env`, editor cruft | The old file was untracked and out of scope |
| 3 | Added `server/uploads/.gitkeep` | Keeps the directory in git while its contents stay ignored |
| 4 | Untracked and deleted `server/uploads/1765531050990-interview.wav` | A user recording was committed; runtime data, not source |
| 5 | Deleted unused `client/src/App.css`, `client/src/assets/react.svg`, `client/public/vite.svg` | Zero imports — verified by grep; `App.css` is the Vite starter leftover |
| 6 | Added root `package.json` with npm **workspaces** and `concurrently` | One `npm install`, one command to run both tiers |
| 7 | Added `server` scripts `start` and `dev` (`node --watch`) | The package had only a failing placeholder `test` script |
| 8 | Renamed `server/requirement.txt` → `requirements.txt`, pinned `SpeechRecognition==3.14.3`, documented FFmpeg | Conventional name; the unpinned single line was ambiguous |
| 9 | Replaced `client/README.md` (Vite template boilerplate) with a root `README.md` | Template text described nothing about this project |
| 10 | Set `client/package.json` to `name: client`, `version: 1.0.0`, added a description | Aligned with `server` |
| 11 | Fixed `client/index.html`: real `<title>`, meta description, inline SVG favicon | Title was `client`; the favicon pointed at the deleted `vite.svg` |
| 12 | Added `IMPLEMENTATION_DETAILS.md` | This document |

No application logic was changed. The 34 issues in [§13](#13-known-issues--technical-debt)
are documented, not fixed — they are product decisions for the owner.

---

## 15. Future work

**Priority 1 — make the product real**

1. Wire `InterviewSession` to `POST /api/analyze` through the Vite proxy.
2. Introduce an explicit score contract (`0–10` end to end, or convert once at the boundary) and rename `filler_count` → `fillerCount` at the API edge.
3. Install FFmpeg or record/transcode to WAV client-side so transcription stops being a simulation.
4. Persist session history and make `ResultView` resilient to a missing `data`.

**Priority 2 — analysis quality**

5. Word-boundary tokenisation for filler detection; drop substring counting.
6. Per-topic keyword and competency sets instead of one global list.
7. Swap `recognize_google` for a keyed or offline engine (Whisper) with retry and timeout.
8. Compute real `confidence` and `pacing` (words per minute, pause ratio) from audio + transcript.
9. Have the evaluator compare the transcript against the expected answer for actual technical correctness, not keyword density.

**Priority 3 — platform hardening**

10. Real backend auth: hashed passwords, JWT or server sessions, per-user data.
11. Persist users, progress, and history in a database; remove `localStorage` as the source of truth.
12. Delete uploads after analysis, or move to object storage with signed URLs; add `multer.limits`.
13. Restrict CORS, add rate limiting and request size caps.
14. Sanitise `originalname`; add `PORT` from env and graceful shutdown.
15. Add `mobile`, `ai`, and `sec` question sets; reconcile `questionsCount` with reality.

**Priority 4 — UX and quality**

16. Mobile navigation drawer; the app is currently desktop-only.
17. Register the `animate-wave` / `animate-fade-in-up` keyframes in `tailwind.config.js`.
18. Move `TOPICS` and `QUESTIONS` into `src/data/` and share the question set across tiers.
19. Replace the `view`-string router with a real router for deep links and browser history.
20. Surface `keywords_found` and `debug_note` in the results UI.
21. Remove `react-media-recorder` (unused) or adopt it.
22. Revoke object URLs on unmount; use real per-answer durations.
23. Add tests: Vitest + React Testing Library for the client, supertest for `/api/analyze`, pytest for the scoring functions.
24. Accessibility pass — `aria-label` on icon-only controls, focus-visible rings, live regions for recording state.
25. Guard the `speech_recognition` import inside `evaluator.py`'s `try` block so a missing dependency emits the JSON error payload instead of an empty stdout, and report the real reason rather than `"Python script returned empty response"`.
26. Resolve the `python` vs `python3` binary problem — probe both, or read the interpreter from a `PYTHON_PATH` env var.
27. Bring `npm run lint` to zero errors ([§11.3](#113-verify)) and add lint to CI.