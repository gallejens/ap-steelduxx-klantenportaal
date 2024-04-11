import type { RGB, RGBA } from '@/types/util';

export const rgbToCss = (rgb: RGB): string => {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

export const rgbaToCss = (rgba: RGBA): string => {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
};
