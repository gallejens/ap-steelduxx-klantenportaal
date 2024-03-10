export function dateConverter(_unixTime: number) {
  const unixTime = new Date(_unixTime);

  const day = String(unixTime.getUTCDate()).padStart(2, '0');
  const month = String(unixTime.getUTCMonth() + 1).padStart(2, '0');
  const year = String(unixTime.getUTCFullYear());

  return `${day}/${month}/${year}`;
}
