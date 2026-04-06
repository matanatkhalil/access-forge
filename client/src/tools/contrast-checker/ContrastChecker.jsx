import {
  getContrastRatio,
  aaNormalText,
  aaLargeText,
  aaaNormalText,
  aaaLargeText,
  normalizeHex,
  isValidHex,
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
          className={`text-center py-3 rounded-xl font-black text-base ${aaNormalText(contrastRatio) === 'Pass' ? 'text-green-600 bg-green-100/50' : 'text-red-600 bg-red-100/50'}`}
        >
          {aaNormalText(contrastRatio)}
        </div>
        <div
          className={`text-center py-3 rounded-xl font-black text-base ${aaaNormalText(contrastRatio) === 'Pass' ? 'text-green-600 bg-green-100/50' : 'text-red-600 bg-red-100/50'}`}
        >
          {aaaNormalText(contrastRatio)}
        </div>

        {/* Large Text Row */}
        <div className="text-base font-bold text-slate-800">Large Text</div>
        <div
          className={`text-center py-3 rounded-xl font-black text-base ${aaLargeText(contrastRatio) === 'Pass' ? 'text-green-600 bg-green-100/50' : 'text-red-600 bg-red-100/50'}`}
        >
          {aaLargeText(contrastRatio)}
        </div>
        <div
          className={`text-center py-3 rounded-xl font-black text-base ${aaaLargeText(contrastRatio) === 'Pass' ? 'text-green-600 bg-green-100/50' : 'text-red-600 bg-red-100/50'}`}
        >
          {aaaLargeText(contrastRatio)}
        </div>
      </div>
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
