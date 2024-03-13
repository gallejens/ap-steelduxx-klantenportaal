import { useEffect, useState } from 'react';

export const useRemToPx = (rem: string) => {
  const [px, setPx] = useState<number>(0);

  useEffect(() => {
    const fontSize = getComputedStyle(document.documentElement).fontSize;

    const fontSizePx = parseFloat(fontSize);
    if (Number.isNaN(fontSizePx)) return;

    const remValue = parseFloat(rem);
    if (Number.isNaN(remValue)) return;

    setPx(fontSizePx * remValue);
  }, [rem]);

  return px;
};
