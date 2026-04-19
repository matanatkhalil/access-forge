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

export const getSuggestedColor = (fg, bg) => {
  const background = normalizeHex(bg);

  const blackRatio = getContrastRatio('#000000', background);
  const whiteRatio = getContrastRatio('#FFFFFF', background);
  const safeFallback = blackRatio >= whiteRatio ? '#000000' : '#FFFFFF';

  /* if the background gives better contrast with black, 
  it is lighter; if it gives better contrast with white, it is darker */
  const isLightBackground = blackRatio > whiteRatio;

  const cleanHex = normalizeHex(fg).slice(1);
  let r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  let g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  let b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // when color is grayscale (black, white, or gray)
  } else {
    const d = max - min;
    // If d is large, the color is very vibrant. If d is small, the color is close to gray
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  const hslToHex = (h, s, l) => {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // binary search to get best contrast
  let low = isLightBackground ? 0 : l;
  let high = isLightBackground ? l : 1;
  let best = null;

  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    const candidate = hslToHex(h, s, mid);
    const ratio = getContrastRatio(candidate, background);

    if (ratio >= 4.5) {
      best = candidate;
      if (isLightBackground) high = mid;
      else low = mid;
    } else {
      if (isLightBackground) low = mid;
      else high = mid;
    }
  }

  return best ?? safeFallback;
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
