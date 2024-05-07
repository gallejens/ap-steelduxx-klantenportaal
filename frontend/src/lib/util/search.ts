export const search = <T>(array: T[], searchValue: string): T[] => {
  return array.filter(item => findSearchValue(item, searchValue));
};

const findSearchValue = (value: any, searchValue: string): boolean => {
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
