export const hexToRgb = (hex) => {
  if (hex.slice(0, 1) === '#') {
    hex = hex.slice(1);
  }
  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

  if (r > 0.03928) {
    r = ((r + 0.055) / 1.055) ** 2.4;
  } else {
    r = r / 12.92;
  }
  if (g > 0.03928) {
    g = ((g + 0.055) / 1.055) ** 2.4;
  } else {
    g = g / 12.92;
  }
  if (b > 0.03928) {
    b = ((b + 0.055) / 1.055) ** 2.4;
  } else {
    b = b / 12.92;
  }

  return { r, g, b };
};

// L = 0.2126 * R + 0.7152 * G + 0.0722 * B

export const getLuminance = (color) => {
  const { r, g, b } = hexToRgb(color);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
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

export const normalizeHex = (hex) => {
  if (!hex) return '#000000'; // Default to black if input is empty or undefined
  let normalized = hex.startsWith('#') ? hex : `#${hex}`;

  if (normalized.length === 4) {
    normalized = `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
  }
  return normalized;
};
