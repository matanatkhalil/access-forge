import { getContrastRatio, aaNormalText, aaLargeText, aaaNormalText, aaaLargeText } from './utils';
import { useState } from 'react';

const ContrastChecker = () => {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const contrastRatio = Number(getContrastRatio(foregroundColor, backgroundColor).toFixed(2));

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
              onChange={(e) => setForegroundColor(e.target.value)}
              className="flex-1 p-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="#000000"
            />
            <input
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
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
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 p-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="#FFFFFF"
            />
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-12 h-12 border-none rounded-lg cursor-pointer bg-transparent"
            />
          </div>
        </label>
      </div>

      {/* Ratio Display */}
      <div className="mb-10 text-center">
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
          className={`text-center py-3 rounded-xl font-black text-lg ${aaNormalText(contrastRatio) === 'Pass' ? 'text-green-600 bg-green-100/50' : 'text-red-600 bg-red-100/50'}`}
        >
          {aaNormalText(contrastRatio)}
        </div>
        <div
          className={`text-center py-3 rounded-xl font-black text-lg ${aaaNormalText(contrastRatio) === 'Pass' ? 'text-green-600 bg-green-100/50' : 'text-red-600 bg-red-100/50'}`}
        >
          {aaaNormalText(contrastRatio)}
        </div>

        {/* Large Text Row */}
        <div className="text-base font-bold text-slate-800">Large Text</div>
        <div
          className={`text-center py-3 rounded-xl font-black text-lg ${aaLargeText(contrastRatio) === 'Pass' ? 'text-green-600 bg-green-100/50' : 'text-red-600 bg-red-100/50'}`}
        >
          {aaLargeText(contrastRatio)}
        </div>
        <div
          className={`text-center py-3 rounded-xl font-black text-lg ${aaaLargeText(contrastRatio) === 'Pass' ? 'text-green-600 bg-green-100/50' : 'text-red-600 bg-red-100/50'}`}
        >
          {aaaLargeText(contrastRatio)}
        </div>
      </div>
    </div>
  );
};

export default ContrastChecker;
