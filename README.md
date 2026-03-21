# Access Forge
A collection of accessibility and assistive technology tools:

- **AAC Communication Board** — A symbol-based communication board for 
  users who rely on augmentative and alternative communication.
- **Screen Reader Practice Environment** — An interactive sandbox for 
  learning and practicing screen reader navigation techniques. 
- **Keyboard Navigation Practice Tool** — Guided exercises for mastering 
keyboard-only navigation across common UI patterns, built for users who 
rely on keyboards and developers who want to understand their experience.
- **WCAG Contrast Checker** — A tool to test foreground and background 
  color combinations against WCAG accessibility standards.

## File Structure
```
access-forge/
├── src/
│   ├── tools/
│   │   ├── aac-board/
│   │   ├── screen-reader-env/
│   │   ├── keyboard-trainer/
│   │   └── contrast-checker/
│   ├── components/   # shared UI
│   └── App.jsx
```
## Tech Stack
**Frontend:**  React + JavaScript (TypeScript migration planned)  
**Styling:**   Tailwind CSS  
**Backend:**   Node.js + Express  
**Database:**  PostgreSQL  
**Testing:**   Vitest + React Testing Library  
**Linting:**   ESLint + Prettier  
**Hosting:**   Vercel (frontend) + Railway or Render (backend)  

