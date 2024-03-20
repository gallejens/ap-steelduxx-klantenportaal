export function dateConverter(_unixTime: number) {
  const unixTime = new Date(_unixTime);

  const day = String(unixTime.getUTCDate()).padStart(2, '0');
  const month = String(unixTime.getUTCMonth() + 1).padStart(2, '0');
  const year = String(unixTime.getUTCFullYear());
  const hour = String(unixTime.getUTCHours()).padStart(2, '0');
  const minute = String(unixTime.getUTCMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hour}:${minute}`;
}
