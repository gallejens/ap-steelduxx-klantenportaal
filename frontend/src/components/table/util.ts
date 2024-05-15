import { STORAGE_KEY_PREFIX } from './constants';
import type { NTable } from './types';

export const applyResizeHandlerDraggingStyles = (apply: boolean) => {
  document.body.style.cursor = apply ? 'ew-resize' : 'auto';
  document.body.style.userSelect = apply ? 'none' : 'auto';
};

export const buildColumnSizeStorageKey = (storageKey: string) => {
  return `${STORAGE_KEY_PREFIX}-${storageKey}`;
};

export const normalizeSearchValues = (
  searchValues: NTable.Props<''>['searchValue']
): string[] => {
  if (searchValues === null || searchValues === undefined) return [];

  if (Array.isArray(searchValues)) {
    return searchValues.filter(v => v !== '').map(v => v.toLowerCase());
  }

  if (searchValues === '') {
    return [];
  }

  return [searchValues.toLowerCase()];
};
