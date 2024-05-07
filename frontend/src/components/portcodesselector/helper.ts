import { doApiAction } from '@/lib/api';
import type { Portcode } from './types';

export const fetchPostcodes = async () => {
  const portcodes = await doApiAction<Portcode[]>({
    method: 'GET',
    endpoint: '/portcodes/',
  });

  if (!portcodes) throw new Error('Failed to fetch portcodes');

  const existingPostcodes = new Set<string>();
  const data: { value: string; label: string }[] = [];

  for (const portcode of portcodes ?? []) {
    if (existingPostcodes.has(portcode.port_code)) continue;

    existingPostcodes.add(portcode.port_code);
    data.push({
      value: portcode.port_code,
      label: `${portcode.port_code} - ${portcode.port_name} (${portcode.country})`,
    });
  }

  return data;
};
