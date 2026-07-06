import React, { useRef } from 'react';

const SkipLinkExercise = ({ isCompleted, handleFocus, handleKeyDown }) => {
  const mainHeadingRef = useRef(null);

  const handleSkipLinkKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // Notify the parent state engine that Enter was pressed on this target
      if (handleKeyDown) {
        handleKeyDown(e);
      }

      // Focus the heading wrapper programmatically
      mainHeadingRef.current?.focus();
    }
  };

  const navigationLinks = ['Home', 'About', 'Tools', 'Docs', 'Blog', 'Forum', 'Contact'];

  return (
    <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-white shadow-inner">
      {/* Skip Link (Reveals on Tab focus) */}
      <button
        id="skip-link-btn"
        onFocus={handleFocus}
        onKeyDown={handleSkipLinkKeyDown}
        disabled={isCompleted}
        className="absolute top-5 left-5 z-50 bg-indigo-600 text-white px-5 py-3 rounded-lg font-bold text-sm
                   sr-only focus:not-sr-only focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 outline-none transition-all shadow-md"
      >
        Skip to Main Content
      </button>

      {/* Nav Header */}
      <header className="bg-slate-100 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 opacity-60">
        <span className="text-sm font-bold text-slate-900 tracking-tight">Access Forge</span>

        <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:justify-end">
          {navigationLinks.map((item, idx) => (
            <a
              key={idx}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[11px] font-bold text-slate-900 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* Primary Content Block */}
      <main className="p-10 text-center bg-slate-50 min-h-[240px] flex flex-col items-center justify-center gap-y-5">
        <div>
          {/* The Heading wrapper acts as the focus landing dock (tabIndex={-1} makes it focusable via JS) */}
          <h2
            ref={mainHeadingRef}
            tabIndex={-1}
            className="text-2xl font-extrabold text-slate-900 mb-2 focus:outline-none scroll-mt-6"
          >
            Main Content Body
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Don&apos;t waste time tabbing through 7 generic links. Press Tab once to reveal the
            hidden &quot;Skip to Main Content&quot; button, press Enter to bypass the menu, and then
            Tab down to the action.
          </p>
        </div>

        <button
          id="main-content-btn"
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={isCompleted}
          className="mt-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-sm 
                     focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:ring-offset-2 transition-all shadow-sm"
        >
          Interactive Main Action
        </button>
      </main>
    </div>
  );
};

export default SkipLinkExercise;
