import { useEffect, useRef } from 'react';

export const useVerticalScrolling = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const handleScrollEvent = (e: WheelEvent) => {
      if (e.deltaY === 0 || ref.current === null) return;
      e.preventDefault();

      ref.current.scrollLeft += e.deltaY;
    };

    ref.current.addEventListener('wheel', handleScrollEvent);

    return () => {
      ref.current?.removeEventListener('wheel', handleScrollEvent);
    };
  }, [ref.current]);

  return { ref };
};
