import { doApiAction, type GenericAPIResponse } from '@/lib/api';

export const fetchHsCodeSuggestions = async (
  term: string
): Promise<Record<string, string>> => {
  if (term.length < 2 || term.length > 16) return {};
  if (term.includes(' ')) return {};

  const result = await doApiAction<GenericAPIResponse<Record<string, string>>>({
    method: 'GET',
    endpoint: `/hs-codes/${term}`,
  });

  return result?.data ?? {};
};
