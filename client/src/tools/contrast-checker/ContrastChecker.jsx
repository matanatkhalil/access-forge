import {
  getContrastRatio,
  aaNormalText,
  aaLargeText,
  aaaNormalText,
  aaaLargeText,
  normalizeHex,
  isValidHex,
  getSuggestedColor,
} from './utils';
import { useState } from 'react';

const ContrastChecker = () => {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const isForegroundValid = isValidHex(foregroundColor);
  const isBackgroundValid = isValidHex(backgroundColor);
  const contrastRatio =
    isForegroundValid && isBackgroundValid
      ? Number(
          getContrastRatio(normalizeHex(foregroundColor), normalizeHex(backgroundColor)).toFixed(2)
        )
      : '—';

  const suggestion =
    isForegroundValid && isBackgroundValid && contrastRatio !== '—' && contrastRatio < 4.5
      ? getSuggestedColor(foregroundColor, backgroundColor)
      : null;

  let newRatio = null;
  let passes = false;

  if (suggestion) {
    newRatio = Number(
      getContrastRatio(normalizeHex(suggestion), normalizeHex(backgroundColor)).toFixed(2)
    );
    passes = newRatio >= 4.5;
  }

  return (
    <main className="contrast-checker flex flex-col items-center min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-12 sr-only">Access Forge</h1>
      {/* Input Section */}
      <section className="color-inputs flex flex-col gap-8 mb-12 mt-12 w-full max-w-lg">
        <h2 className="sr-only">Color Selection</h2>
        <div className="flex flex-col gap-3">
          <label htmlFor="foreground-text" className="text-lg font-semibold text-slate-700">
            Foreground Color
          </label>
          <div className="flex items-center gap-4">
            <input
              type="text"
              id="foreground-text"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value.toUpperCase())}
              className={`flex-1 p-2 border rounded-lg font-mono focus:ring-2 outline-none ${!isForegroundValid ? 'border-red-500 focus:ring-red-300' : 'border-slate-300 focus:ring-indigo-500 '}`}
              placeholder="#000000"
              aria-invalid={!isForegroundValid}
              aria-describedby={!isForegroundValid ? 'color-error' : undefined}
            />
            <input
              type="color"
              aria-label="Foreground color picker"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value.toUpperCase())}
              className="w-12 h-12 border-none rounded-lg cursor-pointer bg-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="background-text" className="text-lg font-semibold text-slate-700">
            Background Color
          </label>
          <div className="flex items-center gap-4">
            <input
              type="text"
              id="background-text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value.toUpperCase())}
              className={`flex-1 p-2 border rounded-lg font-mono focus:ring-2 outline-none ${!isBackgroundValid ? 'border-red-500 focus:ring-red-300' : 'border-slate-300 focus:ring-indigo-500'}`}
              placeholder="#FFFFFF"
              aria-invalid={!isBackgroundValid}
              aria-describedby={!isBackgroundValid ? 'color-error' : undefined}
            />
            <input
              type="color"
              aria-label="Background color picker"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value.toUpperCase())}
              className="w-12 h-12 border-none rounded-lg cursor-pointer bg-transparent"
            />
          </div>
        </div>
        {!isForegroundValid || !isBackgroundValid ? (
          <span id="color-error" role="alert" className="text-red-700 text-base">
            Please enter valid hex codes (e.g., #000000, #FFFFFF)
          </span>
        ) : null}
      </section>
      {/* Ratio Display */}
      <section className="mb-6 text-center" aria-live="polite" aria-atomic="true" role="status">
        <h2 className="text-base uppercase tracking-widest text-slate-600 font-bold mb-1">
          Current Ratio
        </h2>
        <p className="text-3xl font-black text-indigo-600">
          <span aria-label={contrastRatio !== '—' ? `${contrastRatio} to 1` : 'Not available'}>
            {contrastRatio}
          </span>
        </p>
      </section>
      {/* Results Table */}
      <section className="w-full max-w-2xl mt-8">
        <h2 className="sr-only">Compliance Results</h2>
        <table
          className="contrast-results gap-y-8 gap-x-12 p-10 bg-slate-50 border border-slate-100 rounded-2xl w-full max-w-2xl items-center shadow-sm"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: '3rem',
            rowGap: '2rem',
            padding: '2.5rem',
          }}
        >
          {/* Header Row */}
          <thead style={{ display: 'contents' }}>
            <tr style={{ display: 'contents' }}>
              <th
                scope="col"
                className="text-base font-bold text-slate-600 uppercase tracking-widest"
              >
                Text Type
              </th>
              <th
                scope="col"
                className="text-base font-bold text-slate-600 uppercase tracking-widest text-center"
              >
                AA Level
              </th>
              <th
                scope="col"
                className="text-base font-bold text-slate-600 uppercase tracking-widest text-center"
              >
                AAA Level
              </th>
            </tr>
          </thead>

          {/* Normal Text Row */}
          <tbody style={{ display: 'contents' }}>
            <tr style={{ display: 'contents' }}>
              <th scope="row" className="text-base font-bold text-slate-800">
                Normal Text
              </th>
              <td
                className={`text-center py-3 rounded-xl font-black text-base ${
                  contrastRatio === '—'
                    ? 'text-slate-600 bg-slate-100'
                    : aaNormalText(contrastRatio) === 'Pass'
                      ? 'text-green-600 bg-green-100/50'
                      : 'text-red-600 bg-red-100/50'
                }`}
              >
                {contrastRatio === '—' ? '—' : aaNormalText(contrastRatio)}
              </td>
              <td
                className={`text-center py-3 rounded-xl font-black text-base ${
                  contrastRatio === '—'
                    ? 'text-slate-600 bg-slate-100'
                    : aaaNormalText(contrastRatio) === 'Pass'
                      ? 'text-green-600 bg-green-100/50'
                      : 'text-red-600 bg-red-100/50'
                }`}
              >
                {contrastRatio === '—' ? '—' : aaaNormalText(contrastRatio)}
              </td>
            </tr>

            {/* Large Text Row */}
            <tr style={{ display: 'contents' }}>
              <th scope="row" className="text-base font-bold text-slate-800">
                Large Text
              </th>
              <td
                className={`text-center py-3 rounded-xl font-black text-base ${
                  contrastRatio === '—'
                    ? 'text-slate-600 bg-slate-100'
                    : aaLargeText(contrastRatio) === 'Pass'
                      ? 'text-green-600 bg-green-100/50'
                      : 'text-red-600 bg-red-100/50'
                }`}
              >
                {contrastRatio === '—' ? '—' : aaLargeText(contrastRatio)}
              </td>
              <td
                className={`text-center py-3 rounded-xl font-black text-base ${
                  contrastRatio === '—'
                    ? 'text-slate-600 bg-slate-100'
                    : aaaLargeText(contrastRatio) === 'Pass'
                      ? 'text-green-600 bg-green-100/50'
                      : 'text-red-600 bg-red-100/50'
                }`}
              >
                {contrastRatio === '—' ? '—' : aaaLargeText(contrastRatio)}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      {suggestion && passes && (
        <section className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl w-full max-w-2xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-800 mb-4">
            💡 Suggested Fix
          </h2>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm"
                style={{ backgroundColor: suggestion }}
              />
              <div>
                <p className="text-sm text-slate-500">Change foreground to</p>
                <p className="font-mono font-bold text-slate-800">{suggestion}</p>
                <p className="text-xs text-green-800 font-semibold mt-1">
                  New ratio: {newRatio} — {passes ? 'Passes AA' : 'Still fails AA'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setForegroundColor(suggestion)}
              aria-label={`Apply suggested foreground color ${suggestion}`}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </section>
      )}
      <footer className="mt-12 pt-8 border-t border-slate-100 w-full max-w-2xl text-center">
        <h2 className="text-[12px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-6">
          WCAG Reference Definitions
        </h2>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-3 text-xs text-slate-600">
          <p>
            <span className="font-bold text-slate-700">Large Text:</span> ≥18pt (24px) Regular or
            ≥14pt (approx. 18.67px) Bold
          </p>
          <p>
            <span className="font-bold text-slate-700">Normal Text:</span> Any size below Large Text
            thresholds
          </p>
        </div>
      </footer>
    </main>
  );
};

export default ContrastChecker;
