# Gemini's Dev Notes: Chess App

## Technical Overview
This project is a simple Chess application built using the following stack:
- **Framework:** React 19 (via Vite)
- **Language:** TypeScript
- **Core Libraries:**
  - `chess.js`: Handles game logic, move validation, and FEN state.
  - `react-chessboard`: Provides the visual board component and drag-and-drop interactions.

### Environment & Deployment
- **Environment:** GitHub Codespaces (Linux).
- **Server:** Vite development server (`npm run dev`) and Preview server (`npm run preview`).
- **Network:** Configured to bind to `0.0.0.0` to ensure external visibility via port forwarding.

## Lessons Learned

### 1. Vite & Codespaces Networking
**Issue:** By default, Vite binds to `127.0.0.1`. In a containerized environment like Codespaces, this prevents the forwarded port from being accessible externally (resulting in HTTP 502 errors).
**Solution:**
- Updated `vite.config.ts` to include `server: { host: true }`.
- Alternatively, run with the CLI flag: `vite --host 0.0.0.0`.

### 2. Process Management in Non-Interactive Shells
**Issue:** Simple background processes (e.g., `npm run dev &`) were being terminated by the environment immediately after the shell command completed.
**Solution:**
Used `nohup` and `disown` to detach the process completely from the current shell session:
```bash
nohup npm run preview -- --host 0.0.0.0 --port 5173 > server.log 2>&1 & disown
```

### 3. `react-chessboard` API Changes
**Issue:** The installed version of `react-chessboard` (v5.8.6) uses a different API structure than older versions/common examples. Props must be wrapped in an `options` object.

**Incorrect (Old/Standard way):**
```tsx
<Chessboard position={game.fen()} onPieceDrop={onDrop} />
```

**Correct (v5.8.6 way):**
```tsx
<Chessboard options={{ position: game.fen(), onPieceDrop: onDrop }} />
```

### 4. TypeScript & Event Signatures
**Issue:** The `onPieceDrop` callback signature in the new version did not match the expected type.
- It expects a single object argument (`{ sourceSquare, targetSquare, ... }`) instead of positional arguments.
- `targetSquare` can be `null` (if dropped off-board), which TypeScript correctly flagged as a potential error.

**Fix:**
```typescript
function onDrop({ sourceSquare, targetSquare }: { sourceSquare: string, targetSquare: string | null }) {
  if (!targetSquare) return false;
  // ... move logic
}
```
