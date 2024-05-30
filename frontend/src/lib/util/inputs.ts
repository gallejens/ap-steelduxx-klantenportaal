export const convertRecordToSelectInputData = (record: Record<string, any>) => {
  return Object.entries(record).reduce<{ value: string; label: string }[]>(
    (acc, [key, value]) => {
      acc.push({ value: key, label: value });
      return acc;
    },
    []
  );
};
