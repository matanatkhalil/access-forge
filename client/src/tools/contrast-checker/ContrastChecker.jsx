import { getContrastRatio, aaNormalText, aaLargeText, aaaNormalText, aaaLargeText } from './utils';
import { useState } from 'react';

const ContrastChecker = () => {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const contrastRatio = Number(getContrastRatio(foregroundColor, backgroundColor).toFixed(2));

  return (
    <div className="contrast-checker">
      <div className="color-inputs flex flex-col gap-4 mb-6">
        <label>
          Foreground Color:
          <input
            type="color"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
            className="ml-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={foregroundColor}
            className="ml-2 border border-gray-300 rounded"
            onChange={(e) => setForegroundColor(e.target.value)}
          />
        </label>
        <label>
          Background Color:
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="ml-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={backgroundColor}
            className="ml-2 border border-gray-300 rounded"
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </label>
      </div>
      <div className="contrast-ratio">
        <p className="contrast-ratio-value">Contrast Ratio: {contrastRatio}</p>
      </div>
      <div className="contrast-results grid grid-cols-3 gap-y-4 gap-x-8 p-6 bg-gray-50 rounded-lg">
        {/* Header Row */}
        <div className="font-semibold text-sm text-gray-500 tracking-wider">Text Type</div>
        <div className="font-semibold text-sm text-gray-500 tracking-wider">AA Level</div>
        <div className="font-semibold text-sm text-gray-500 tracking-wider">AAA Level</div>

        {/* Normal Text Row */}
        <div className="font-medium text-gray-800">Normal Text</div>
        <div
          className={`font-bold ${aaNormalText(contrastRatio) === 'Pass' ? 'text-green-600' : 'text-red-600'}`}
        >
          {aaNormalText(contrastRatio)}
        </div>
        <div
          className={`font-bold ${aaaNormalText(contrastRatio) === 'Pass' ? 'text-green-600' : 'text-red-600'}`}
        >
          {aaaNormalText(contrastRatio)}
        </div>

        {/* Large Text Row */}
        <div className="font-medium text-gray-800">Large Text</div>
        <div
          className={`font-bold ${aaLargeText(contrastRatio) === 'Pass' ? 'text-green-600' : 'text-red-600'}`}
        >
          {aaLargeText(contrastRatio)}
        </div>
        <div
          className={`font-bold ${aaaLargeText(contrastRatio) === 'Pass' ? 'text-green-600' : 'text-red-600'}`}
        >
          {aaaLargeText(contrastRatio)}
        </div>
      </div>
    </div>
  );
};

export default ContrastChecker;
