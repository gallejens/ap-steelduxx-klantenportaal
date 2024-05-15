export const search = <T>(array: T[], searchValue: string | string[]): T[] => {
  const searchValues = Array.isArray(searchValue) ? searchValue : [searchValue];

  let filtered = [...array];
  for (const value of searchValues) {
    filtered = filtered.filter(item => findSearchValue(item, value));
  }

  return filtered;
};

const findSearchValue = (value: any, searchValue: string): boolean => {
  if (!value) return false;

  if (Array.isArray(value)) {
    return value.some(item => findSearchValue(item, searchValue));
  }

  if (typeof value === 'object') {
    return findSearchValue(
      Object.values(value as Record<string, unknown>),
      searchValue
    );
  }

  return String(value).toLowerCase().includes(searchValue.toLowerCase());
};
