export const normalizeHex = (hex) => {
  if (!hex || hex === '#') return '#000000'; // Default to black if input is empty or undefined
  let normalized = hex.startsWith('#') ? hex : `#${hex}`;

  if (normalized.length === 4) {
    normalized = `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
  }
  return normalized;
};

export const hexToRgb = (hex) => {
  const cleanHex = normalizeHex(hex).slice(1);
  let r = parseInt(cleanHex.slice(0, 2), 16);
  let g = parseInt(cleanHex.slice(2, 4), 16);
  let b = parseInt(cleanHex.slice(4, 6), 16);

  let rs = r / 255;
  let gs = g / 255;
  let bs = b / 255;

  if (rs > 0.03928) {
    rs = ((rs + 0.055) / 1.055) ** 2.4;
  } else {
    rs = rs / 12.92;
  }
  if (gs > 0.03928) {
    gs = ((gs + 0.055) / 1.055) ** 2.4;
  } else {
    gs = gs / 12.92;
  }
  if (bs > 0.03928) {
    bs = ((bs + 0.055) / 1.055) ** 2.4;
  } else {
    bs = bs / 12.92;
  }

  return { rs, gs, bs };
};

// L = 0.2126 * R + 0.7152 * G + 0.0722 * B

export const getLuminance = (color) => {
  const { rs, gs, bs } = hexToRgb(color);
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// contrast ratio = (L1 + 0.05) / (L2 + 0.05) (L1 is the luminance of the lighter color and L2 is the luminance of the darker color)

export const getContrastRatio = (color1, color2) => {
  const L1 = getLuminance(color1);
  const L2 = getLuminance(color2);
  if (L1 > L2) {
    return (L1 + 0.05) / (L2 + 0.05);
  } else {
    return (L2 + 0.05) / (L1 + 0.05);
  }
};

const checkStatus = (ratio, threshold) => {
  return ratio >= threshold ? 'Pass' : 'Fail';
};

export const aaNormalText = (ratio) => checkStatus(ratio, 4.5);
export const aaLargeText = (ratio) => checkStatus(ratio, 3);
export const aaaNormalText = (ratio) => checkStatus(ratio, 7);
export const aaaLargeText = (ratio) => checkStatus(ratio, 4.5);

export const isValidHex = (hex) => {
  const hexRegex = /^#?([0-9A-F]{3}){1,2}$/i;
  return hexRegex.test(hex);
};
