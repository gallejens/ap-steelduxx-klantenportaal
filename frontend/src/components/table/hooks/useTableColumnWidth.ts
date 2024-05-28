import { useEffect, useRef, useState } from 'react';

const applyResizeHandlerDraggingStyles = (apply: boolean) => {
  document.body.style.cursor = apply ? 'ew-resize' : 'auto';
  document.body.style.userSelect = apply ? 'none' : 'auto';
};

const buildColumnSizeStorageKey = (storageKey: string) => {
  return `column-sizes-${storageKey}`;
};

export const useTableColumnWidth = <T extends string>({
  storageKey,
  lastColumnKey,
}: {
  storageKey: string;
  lastColumnKey: T;
}) => {
  const columnRefs = useRef<Partial<Record<T, HTMLDivElement | null>>>({});
  const [resizingColumnKey, setResizingColumnKey] = useState<T | null>(null);

  // Load all column sizes from storage
  useEffect(() => {
    const savedSizesJSON = localStorage.getItem(
      buildColumnSizeStorageKey(storageKey)
    );
    if (!savedSizesJSON) return;

    const savedSizes: Record<string, string> = JSON.parse(savedSizesJSON);

    for (const [key, ref] of Object.entries(columnRefs.current) as [
      T,
      HTMLDivElement | null,
    ][]) {
      if (ref === null) continue;
      const savedSize = savedSizes[key];
      if (!savedSize) continue;
      ref.style.width = savedSize;
    }
  }, []);

  useEffect(() => {
    if (resizingColumnKey === null || columnRefs.current === null) return;

    const columnRef = columnRefs.current[resizingColumnKey];
    const lastColumnRef = columnRefs.current[lastColumnKey];
    if (!columnRef || !lastColumnRef) return;

    const mouseUpHandler = () => {
      setResizingColumnKey(null);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      const originalWidth = columnRef.getBoundingClientRect().width;
      const newWidth = originalWidth + e.movementX;
      columnRef.style.width = `${newWidth}px`;
    };

    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('mousemove', mouseMoveHandler);

    return () => {
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);

      applyResizeHandlerDraggingStyles(false);

      // save column sizes to storage
      const sizes: Record<string, string> = {};
      for (const [key, ref] of Object.entries(columnRefs.current) as [
        T,
        HTMLDivElement | null,
      ][]) {
        if (ref === null) continue;
        sizes[key] = ref.style.width;
      }

      localStorage.setItem(
        buildColumnSizeStorageKey(storageKey),
        JSON.stringify(sizes)
      );
    };
  }, [resizingColumnKey]);

  const startResizingColumn = (columnKey: T) => {
    setResizingColumnKey(columnKey);
    applyResizeHandlerDraggingStyles(true);
  };

  return {
    columnRefs,
    startResizingColumn,
  };
};
