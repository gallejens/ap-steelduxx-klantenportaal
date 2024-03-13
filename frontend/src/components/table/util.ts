import { STORAGE_KEY_PREFIX } from './constants';

export const applyResizeHandlerDraggingStyles = (apply: boolean) => {
  document.body.style.cursor = apply ? 'ew-resize' : 'auto';
  document.body.style.userSelect = apply ? 'none' : 'auto';
};

export const buildColumnSizeStorageKey = (storageKey: string) => {
  return `${STORAGE_KEY_PREFIX}-${storageKey}`;
};
