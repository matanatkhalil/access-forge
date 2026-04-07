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

  return (
    <div className="contrast-checker flex flex-col items-center min-h-screen bg-white p-8">
      {/* Input Section */}
      <div className="color-inputs flex flex-col gap-8 mb-12 mt-12 w-full max-w-lg">
        <label className="flex flex-col gap-3 text-lg font-semibold text-slate-700">
          Foreground Color
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value.toUpperCase())}
              className={`flex-1 p-2 border rounded-lg font-mono focus:ring-2 outline-none ${!isForegroundValid ? 'border-red-500 focus:ring-red-300' : 'border-slate-300 focus:ring-indigo-500 '}`}
              placeholder="#000000"
            />
            <input
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value.toUpperCase())}
              className="w-12 h-12 border-none rounded-lg cursor-pointer bg-transparent"
            />
          </div>
        </label>

        <label className="flex flex-col gap-3 text-lg font-semibold text-slate-700">
          Background Color
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value.toUpperCase())}
              className={`flex-1 p-2 border rounded-lg font-mono focus:ring-2 outline-none ${!isBackgroundValid ? 'border-red-500 focus:ring-red-300' : 'border-slate-300 focus:ring-indigo-500'}`}
              placeholder="#FFFFFF"
            />
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value.toUpperCase())}
              className="w-12 h-12 border-none rounded-lg cursor-pointer bg-transparent"
            />
          </div>
        </label>
        {!isForegroundValid || !isBackgroundValid ? (
          <span className="text-red-500 text-base">
            Please enter valid hex codes (e.g., #000000, #FFFFFF)
          </span>
        ) : null}
      </div>
      {/* Ratio Display */}
      <div className="mb-6 text-center">
        <p className="text-base uppercase tracking-widest text-slate-400 font-bold mb-1">
          Current Ratio
        </p>
        <p className="text-3xl font-black text-indigo-600">{contrastRatio}</p>
      </div>
      {/* Results Table */}
      <div className="contrast-results grid grid-cols-3 gap-y-8 gap-x-12 p-10 bg-slate-50 border border-slate-100 rounded-2xl w-full max-w-2xl items-center shadow-sm">
        {/* Header Row */}
        <div className="text-base font-bold text-slate-400 uppercase tracking-widest">
          Text Type
        </div>
        <div className="text-base font-bold text-slate-400 uppercase tracking-widest text-center">
          AA Level
        </div>
        <div className="text-base font-bold text-slate-400 uppercase tracking-widest text-center">
          AAA Level
        </div>

        {/* Normal Text Row */}
        <div className="text-base font-bold text-slate-800">Normal Text</div>
        <div
          className={`text-center py-3 rounded-xl font-black text-base ${
            contrastRatio === '—'
              ? 'text-slate-400 bg-slate-100'
              : aaNormalText(contrastRatio) === 'Pass'
                ? 'text-green-600 bg-green-100/50'
                : 'text-red-600 bg-red-100/50'
          }`}
        >
          {contrastRatio === '—' ? '—' : aaNormalText(contrastRatio)}
        </div>
        <div
          className={`text-center py-3 rounded-xl font-black text-base ${
            contrastRatio === '—'
              ? 'text-slate-400 bg-slate-100'
              : aaaNormalText(contrastRatio) === 'Pass'
                ? 'text-green-600 bg-green-100/50'
                : 'text-red-600 bg-red-100/50'
          }`}
        >
          {contrastRatio === '—' ? '—' : aaaNormalText(contrastRatio)}
        </div>

        {/* Large Text Row */}
        <div className="text-base font-bold text-slate-800">Large Text</div>
        <div
          className={`text-center py-3 rounded-xl font-black text-base ${
            contrastRatio === '—'
              ? 'text-slate-400 bg-slate-100'
              : aaLargeText(contrastRatio) === 'Pass'
                ? 'text-green-600 bg-green-100/50'
                : 'text-red-600 bg-red-100/50'
          }`}
        >
          {contrastRatio === '—' ? '—' : aaLargeText(contrastRatio)}
        </div>
        <div
          className={`text-center py-3 rounded-xl font-black text-base ${
            contrastRatio === '—'
              ? 'text-slate-400 bg-slate-100'
              : aaaLargeText(contrastRatio) === 'Pass'
                ? 'text-green-600 bg-green-100/50'
                : 'text-red-600 bg-red-100/50'
          }`}
        >
          {contrastRatio === '—' ? '—' : aaaLargeText(contrastRatio)}
        </div>
      </div>
      {suggestion && (
        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl w-full max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-4">
            💡 Suggested Fix
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm"
                style={{ backgroundColor: suggestion }}
              />
              <div>
                <p className="text-sm text-slate-500">Change foreground to</p>
                <p className="font-mono font-bold text-slate-800">{suggestion}</p>
                <p className="text-xs text-green-600 font-semibold mt-1">
                  New ratio:{' '}
                  {Number(
                    getContrastRatio(
                      normalizeHex(suggestion),
                      normalizeHex(backgroundColor)
                    ).toFixed(2)
                  )}{' '}
                  — Passes AA
                </p>
              </div>
            </div>
            <button
              onClick={() => setForegroundColor(suggestion)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
      <div className="mt-12 pt-8 border-t border-slate-100 w-full max-w-2xl text-center">
        <p className="text-[12px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-6">
          WCAG Reference Definitions
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-3 text-xs text-slate-600">
          <p>
            <span className="font-bold text-slate-700">Large Text:</span> ≥18pt (24px) or ≥14pt
            (approx. 18.67px) Bold
          </p>
          <p>
            <span className="font-bold text-slate-700">Normal Text:</span> Any size below Large Text
            thresholds
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContrastChecker;
