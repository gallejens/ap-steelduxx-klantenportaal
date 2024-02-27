type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const API_ENDPOINT: string = import.meta.env.VITE_API_ENDPOINT;

export const doApiAction = async <T>(data: {
  endpoint: string;
  method: Method;
  body?: unknown;
}): Promise<T> => {
  const response = await fetch(`${API_ENDPOINT}${data.endpoint}`, {
    method: data.method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: data.body ? JSON.stringify(data.body) : undefined,
  });
  if (response.status === 204) return {} as T;
  return response.json();
};

