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
      'Access-Control-Allow-Origin': '*',
    },
    body: data.body ? JSON.stringify(data.body) : undefined,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  if (response.status === 204) return {} as T;
  return response.json();
};
