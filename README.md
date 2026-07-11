# Access Forge

A platform of assistive technology and accessibility experiences, built for users with disabilities first.

## Tools

- **AAC Board** — A symbol-based communication board for users who rely on augmentative and alternative communication.
- **Screen Reader Practice Environment** — An interactive sandbox for learning and practicing screen reader navigation techniques.
- **Keyboard Navigation Practice Tool** — Guided exercises for mastering keyboard-only navigation across common UI patterns, built for users who rely on keyboards and developers who want to understand their experience.
- **WCAG Contrast Checker** — A tool to test foreground and background color combinations against WCAG standards.

## Live Demo

[Access Forge](https://access-forge.netlify.app/)

## Project Structure

```
access-forge/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── tools/
│       │   ├── aac-board/
│       │   ├── screen-reader-env/
│       │   ├── keyboard-trainer/
│       │   └── contrast-checker/
│       ├── components/      # Shared UI components
│       └── App.jsx
├── server/                  # Node.js + Express backend
│   ├── controllers/
│   ├── db/
│   ├── routes/
│   └── index.js
├── docker-compose.yml       # PostgreSQL container
├── .github/workflows/       # CI (GitHub Actions)
└── .env.example
```

## Tech Stack

| Layer    | Technology                                        |
| -------- | ------------------------------------------------- |
| Frontend | React + JavaScript (TypeScript migration planned) |
| Styling  | Tailwind CSS                                      |
| Backend  | Node.js + Express                                 |
| Database | PostgreSQL (Dockerized for development)           |
| Testing  | Vitest + React Testing Library                    |
| Linting  | ESLint + Prettier                                 |
| Hosting  | Vercel (frontend) + Railway or Render (backend)   |

## Getting Started

### Prerequisites

- Node.js v18+
- Docker Desktop

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/matanatkhalil/access-forge.git
cd access-forge

# 2. Set up environment variables
cp .env.example .env
# Fill in your values in .env

# 3. Start the PostgreSQL database
docker-compose up -d

# 4. Install dependencies
npm install
cd client && npm install
cd ../server && npm install

# 5. Start development
cd .. && npm run dev
```

### Available Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Starts both frontend and backend |
| `npm run client`       | Starts frontend only             |
| `npm run server`       | Starts backend only              |
| `npm run lint`         | Runs ESLint across the project   |
| `npm run format`       | Formats code with Prettier       |
| `npm run format:check` | Checks formatting without fixing |
| `npm test`             | Runs the test suite              |
