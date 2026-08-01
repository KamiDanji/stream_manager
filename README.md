# OBS Remote Micro-SaaS

A mobile-first, cloud-based remote control for OBS Studio. This project allows streamers and their authorized moderators to control scenes, audio, and macros remotely via a fat-finger-friendly dashboard.

## Architecture

This project is structured as a Monorepo using `bun` workspaces.

- **`/apps/web`**: Next.js 14 App Router frontend (React, Tailwind CSS). Hosts the Moderator Dashboard and the hidden Streamer Bridge.
- **`/apps/server`**: Node.js backend (Express, Socket.IO). Acts as a lightweight Cloud Router that routes real-time commands from moderators to the streamer's bridge.
- **`/shared`**: Shared TypeScript types for Firestore database schemas and WebSocket payloads.

### How it Works
1. **The Bridge**: The streamer opens a hidden page (`/bridge`) which securely connects to their local OBS WebSocket and joins a unique Socket.IO cloud room.
2. **The Remote**: Authorized moderators log in (`/login`) via Firebase Auth, connect to the streamer's cloud room, and use the fat-finger dashboard (`/dashboard`) to push commands.
3. **The Relay**: The Node.js cloud router verifies Firebase Auth tokens and securely relays the commands down to the streamer's bridge page, which executes them in OBS.

## Prerequisites

- [Bun](https://bun.sh/) (for package management and running scripts)
- A Firebase Project (for Authentication and Firestore)
- OBS Studio v28+ (with `obs-websocket` v5 enabled)

## Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Configure Environment Variables:**
   - Copy `apps/web/.env.example` to `apps/web/.env.local` and add your Firebase Client SDK configuration.
   - Copy `apps/server/.env.example` to `apps/server/.env`.
   - *(Optional for Server)*: Generate a Firebase Admin SDK Service Account JSON key from the Firebase Console and point `GOOGLE_APPLICATION_CREDENTIALS` in your server `.env` to its absolute path. (Local default credentials will be used if omitted during testing).

3. **OBS Configuration:**
   - In OBS Studio, go to `Tools > WebSocket Server Settings`.
   - Ensure the server is enabled (usually port `4455`).
   - Set a secure password. You will need this when you open the Bridge page.

## Running the Application

To start both the Next.js frontend and the Node.js Socket.IO server concurrently:

```bash
bun run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend Router:** [http://localhost:3001](http://localhost:3001)

## UI Philosophy

The Moderator Dashboard is explicitly designed for fast, error-free usage during high-stress live streams. It implements a "fat-finger" mobile design:
- Massive, color-coded square buttons for critical actions (e.g., Red for Mute/BRB, Blue for Live).
- Thick horizontal sliders with oversized thumbs for audio mixing.
- Responsive CSS Grid layout optimized for mobile browsers and tablets.
