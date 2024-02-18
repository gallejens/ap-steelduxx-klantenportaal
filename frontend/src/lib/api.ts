type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const doApiAction = async <T>(data: {
  endpoint: string;
  method: Method;
  body?: unknown;
}): Promise<T> => {
  const response = await fetch(`http://localhost:8080/api${data.endpoint}`, {
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
