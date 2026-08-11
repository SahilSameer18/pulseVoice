# PulseVoice — Full Execution Plan

## 0. Project Snapshot & Complete File Architecture

**What you're building:** A real-time voice-based AI health-screening call web app with a human-centered design. User talks → AI asks adaptive intake questions in English/Hindi → call ends → structured health intake report is generated.

**Tech Stack & Design Theme:**
| Layer | Tech / Design Spec |
|---|---|
| Frontend | React (Vite) + Tailwind CSS + React Router |
| Real-Time Transport | Socket.IO (`socket.io-client` & `socket.io`) |
| Speech-to-Text (STT) | Groq Whisper Large v3 (Turbo) |
| Intake & Report LLM | Groq Llama 3.3 70B |
| Text-to-Speech (TTS) | Browser `SpeechSynthesis` (Web Speech API) |
| Audio Capture | Browser `MediaRecorder` API |
| **Design Identity** | **"Clinical Dusk" Theme** (Deep charcoal-teal `#12191C`, soft chart off-white `#EDEEE7`, coral accent `#E4593F`, sage `#7FA98A`) |
| **Typography** | `Spectral` (Serif for AI spoken text & brand), `IBM Plex Sans` (UI body), `IBM Plex Mono` (Data report fields) |

---

### Project File Map

```
pulseVoice/
├── README.md                           # Root setup instructions & repository README
├── PLAN.md                             # Full execution plan (this file)
├── requirement.md                      # Technical assessment specification
│
├── client/                             # REACT FRONTEND
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── socket.js               # Shared Socket.IO client connection instance
│   │   ├── components/
│   │   │   ├── call/
│   │   │   │   ├── CallControls.jsx    # Start/End call & push-to-talk mic button
│   │   │   │   ├── AudioVisualizer.jsx # Pulse Line & breathing orb recording indicator
│   │   │   │   ├── TranscriptView.jsx  # Chat caption bubbles (Spectral serif for AI text)
│   │   │   │   └── index.js
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx          # Top navbar header with title & language selector
│   │   │   │   └── ErrorAlert.jsx      # UI alert banner for silence & API errors
│   │   │   └── report/
│   │   │       ├── ReportCard.jsx      # Paper-texture structured clinical report card
│   │   │       ├── SymptomsList.jsx    # Symptoms & severity chips display
│   │   │       └── RiskFlags.jsx       # Notable points for physician review (non-diagnostic)
│   │   ├── constants/
│   │   │   └── languages.js            # English, Hindi & Auto-detect configuration
│   │   ├── context/
│   │   │   └── CallContext.jsx         # React global call state management
│   │   ├── hooks/
│   │   │   ├── useRecorder.js          # MediaRecorder audio capture hook (emits mimeType dynamically)
│   │   │   ├── useSpeechSynthesis.js  # Web Speech API TTS playback hook
│   │   │   └── useSocket.js            # Real-time socket event listener hook
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Intake screening landing page with background pulse line
│   │   │   ├── CallPage.jsx            # Live screening call interface with live waveform
│   │   │   └── ReportPage.jsx          # Health report page with session rhythm strip & print CTA
│   │   ├── app.layout.jsx              # Main app wrapper layout
│   │   ├── app.routes.jsx              # Client page routes configuration
│   │   ├── App.jsx                     # Root React component
│   │   ├── index.css                   # Global Clinical Dusk styles & Google Fonts imports
│   │   └── main.jsx                    # React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                             # NODE.JS / EXPRESS BACKEND
    ├── src/
    │   ├── middlewares/
    │   │   └── errorHandler.js       # Socket async wrapper & central Express error handler
    │   ├── prompts/
    │   │   ├── systemPrompt.js       # AI Doctor persona & intake steering prompt
    │   │   └── reportPrompt.js       # Structured JSON health report generator prompt
    │   ├── services/
    │   │   ├── groqStt.js            # Groq Whisper STT service with dynamic MIME type toFile wrapper
    │   │   ├── groqChat.js           # Groq Llama intake conversation (json_object mode + fallback)
    │   │   └── groqReport.js         # Groq Llama report service (json_object mode + fallback)
    │   ├── sockets/
    │   │   ├── index.js              # Socket server initialization & registration
    │   │   └── callHandler.js        # Real-time socket event handlers (`call:start`, `turn:audio`, `call:end`)
    │   ├── store/
    │   │   └── sessionStore.js       # In-memory active session & transcript store
    │   └── utils/
    │       ├── audioHelper.js        # Audio buffer size & silence validation helper
    │       └── fieldExtractor.js     # Helper for parsing extracted JSON intake fields safely
    ├── .env
    ├── .env.example
    ├── package.json                    # Minimal dependencies (cors, dotenv, express, socket.io, groq-sdk, uuid)
    └── server.js                       # Express + HTTP + Socket.IO server entry point
```

---

## Phase 0 — Environment & API Verification (30–45 min)

1. Set up `server/.env`:
   ```env
   GROQ_API_KEY=gsk_your_key_here
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```
2. Populate `server/.env.example` with empty keys for public GitHub submission.
3. Dependencies cleanup:
   - Server: `npm install groq-sdk uuid cors dotenv express socket.io`
   - Client: `socket.io-client`, `react-router-dom`, `react`, `@tailwindcss/vite`, `tailwindcss`.

---

## Phase 1 — Server Skeleton & Socket Plumbing (2–3 hrs)

**Goal:** Establish bidirectional real-time communication between client and server with robust socket error wrapping.

**Files:**
- `server/server.js` — Initializes Express app, HTTP server, attaches Socket.IO with CORS.
- `server/src/middlewares/errorHandler.js` — Provides `wrapSocketHandler(socket, asyncFn)` utility.
- `server/src/sockets/callHandler.js` — Socket event handlers (`call:start`, `turn:audio`, `call:end`).
- `client/src/api/socket.js` — Instantiates singleton `io(SERVER_URL)`.
- `client/src/hooks/useSocket.js` — Exposes socket event binding & message emission.
- `client/src/context/CallContext.jsx` — React Context for global state (`callStatus`: `IDLE`, `CONNECTING`, `LISTENING`, `THINKING`, `SPEAKING`, `ENDED`).

---

## Phase 2 — Conversation State & Field Extraction Strategy (1–2 hrs)

**State Store (`server/src/store/sessionStore.js`):**
In-memory `Map` keyed by `socket.id` keeping transcript history & field state.

**Field Extraction Strategy (LLM Structured JSON per Turn):**
`groqChat.js` instructs Llama 3.3 to return `{ replyText, extractedFields }`. `fieldExtractor.js` merges fields into session state in a single pass.

---

## Phase 3 — Groq AI Integration Services & Dual-Shield JSON Mode (4–5 hrs)

1. **Forced JSON Mode (`response_format: { type: "json_object" }`)** in `groqChat.js` and `groqReport.js`.
2. **Robust Fallback Insurance (`parseLlamaJson`)**:
   - Per-turn fallback in `groqChat.js`: uses raw response text if JSON fails.
   - Report fallback in `groqReport.js`: constructs valid schema defaults.
3. **Dynamic MediaRecorder MIME Handling (`groqStt.js`)**: Passes runtime `mimeType` into `toFile(buffer, filename, { type: cleanMime })`. Tested standalone in `server/testGroq.js`.

---

## Phase 4 — Real-Time Voice Pipeline Wiring (3–4 hrs)

Connect socket handlers (`call:start`, `turn:audio`, `call:end`) to Groq services with full error handling.

---

## Phase 5 — Client UI & "Clinical Dusk" Design Identity (5–6 hrs)

### Design Architecture & Color Palette:
- **`--ink` (`#12191C`)**: Deep charcoal-teal background.
- **`--paper` (`#EDEEE7`)**: Soft chart off-white card surface for report cards.
- **`--pulse` (`#E4593F`)**: Desaturated coral accent for call controls, live voice orb, and CTA buttons.
- **`--vital` (`#7FA98A`)**: Muted sage green for success/completed states.
- **`--graphite` (`#495057`)**: Text on paper surfaces & borders.
- **`--ash` (`#B9B2A0`)**: Eyebrows, timestamps, muted labels.

### Typography Hierarchy:
- **`Spectral` (Serif)**: Logo title & AI spoken responses (human voice gets the human serif).
- **`IBM Plex Sans`**: Standard UI body text & buttons.
- **`IBM Plex Mono`**: Data report key-value fields (duration, severity, timestamps).

### Signature Pulse Line Motif:
1. **HomePage**: Resting-breath pulse line animation (~14 cycles/min).
2. **CallPage**: Live breathing voice orb / dynamic SVG pulse line reacting to speech state.
3. **ReportPage**: Session rhythm strip visualizing user/AI turn cadence.

---

## Phase 6 — Edge Case & Failure Handling (2–3 hrs)

- **Dynamic MIME Type Handling**: Emits and checks `mediaRecorder.mimeType` at runtime.
- **JSON Parsing Fallbacks**: Covered by `parseLlamaJson` in `groqChat.js` and `groqReport.js`.
- **Audio Silence & Empty Turn**: Emits clear `turn:error` notification ("Didn't catch that — try again").
- **Disconnect Cleanup**: Cleans up session from `sessionStore` on socket disconnect.

---

## Phase 7 — Final Verification, Documentation & Submission (2 hrs)

1. Complete `README.md` at root with setup instructions, required `.env` variables, AI architecture rationales, and design identity notes.
2. Conduct fresh-clone test on local machine.
3. Confirm repository visibility is set to **Public** before emailing submission link.
