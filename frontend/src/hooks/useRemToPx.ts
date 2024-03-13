import { useEffect, useState } from 'react';

export const usePxPerRem = () => {
  const [pxPerRem, setPxPerRem] = useState<number>(0);

  useEffect(() => {
    const fontSize = getComputedStyle(document.documentElement).fontSize;

    const px = parseInt(fontSize);
    if (Number.isNaN(px)) return;

    setPxPerRem(px);
  }, []);

  return pxPerRem;
};
