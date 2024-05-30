import type { NTable } from './types';

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
