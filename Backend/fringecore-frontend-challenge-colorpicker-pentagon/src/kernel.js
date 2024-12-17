// ./kernel.js

export const kernelFunction = function (width, height, hue) {
  const i = this.thread.x;
  const y = Math.floor(i / (height * 4));
  const x = Math.floor(i / 4 - y * width);
  const channel = i % 4;
  const normalizedX = x / width;
  const normalizedY = y / height;

  const saturation = normalizedX;
  const value = 1 - normalizedY;

  const hPrime = hue * 6;
  const chroma = value * saturation;
  const xPrime = chroma * (1 - Math.abs((hPrime % 2) - 1));

  let r = 0,
    g = 0,
    b = 0;

  if (hPrime >= 0 && hPrime < 1) {
    r = chroma;
    g = xPrime;
    b = 0;
  } else if (hPrime >= 1 && hPrime < 2) {
    r = xPrime;
    g = chroma;
    b = 0;
  } else if (hPrime >= 2 && hPrime < 3) {
    r = 0;
    g = chroma;
    b = xPrime;
  } else if (hPrime >= 3 && hPrime < 4) {
    r = 0;
    g = xPrime;
    b = chroma;
  } else if (hPrime >= 4 && hPrime < 5) {
    r = xPrime;
    g = 0;
    b = chroma;
  } else if (hPrime >= 5 && hPrime < 6) {
    r = chroma;
    g = 0;
    b = xPrime;
  }

  const m = value - chroma;
  r += m;
  g += m;
  b += m;

  if (channel === 0) return Math.floor(r * 255);
  if (channel === 1) return Math.floor(g * 255);
  if (channel === 2) return Math.floor(b * 255);
  if (channel === 3) return 255;
};
