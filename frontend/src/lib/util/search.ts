export const search = <T>(array: T[], searchValue: string): T[] => {
  return array.filter(item => {
    if (Array.isArray(item)) {
      return search(item, searchValue);
    }
    if (typeof item === 'object') {
      return search(
        Object.values(item as Record<string, unknown>),
        searchValue
      );
    }
    const value = String(item);
    console.log('Checing ' + value);
    return value.toLowerCase().includes(searchValue.toLowerCase());
  });
};
