function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let processedHex = hex.startsWith("#") ? hex.slice(1) : hex;

  if (processedHex.length === 3) {
    processedHex = processedHex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (processedHex.length !== 6) {
    return null;
  }

  const num = parseInt(processedHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

const { min, max, round } = Math;

function hueToRgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return { r: round(r * 255), g: round(g * 255), b: round(b * 255) };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const vmax = max(r, g, b),
    vmin = min(r, g, b);
  let h = 0,
    s,
    l = (vmax + vmin) / 2;

  if (vmax === vmin) {
    return { h: 0, s: 0, l }; // achromatic
  }

  const d = vmax - vmin;
  s = l > 0.5 ? d / (2 - vmax - vmin) : d / (vmax + vmin);
  if (vmax === r) h = (g - b) / d + (g < b ? 6 : 0);
  if (vmax === g) h = (b - r) / d + 2;
  if (vmax === b) h = (r - g) / d + 4;
  h /= 6;

  return { h, s, l };
}

export function mutifyHexColor(
  hex: string,
  saturationFactor: number = 0.5,
  lightnessFactor: number = 0.5
): string {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    throw new Error("Invalid hex color");
  }

  const { r, g, b } = rgb;
  const { h, s, l } = rgbToHsl(r, g, b);

  // Adjust saturation and lightness
  const mutedS = s * saturationFactor;
  const mutedL = l * lightnessFactor;

  const { r: mutedR, g: mutedG, b: mutedB } = hslToRgb(h, mutedS, mutedL);

  return rgbToHex(mutedR, mutedG, mutedB);
}

export function lightenHexColor(hex: string, lightness: number): string {
  const { r, g, b } = hexToRgb(hex) as { r: number; g: number; b: number };
  let { h, s, l } = rgbToHsl(r, g, b);
  l = Math.min(1, l + lightness); // Increase lightness
  const { r: newR, g: newG, b: newB } = hslToRgb(h, s, l);
  return rgbToHex(newR, newG, newB);
}
