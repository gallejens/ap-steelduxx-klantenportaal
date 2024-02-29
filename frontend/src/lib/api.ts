type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const API_ENDPOINT: string = import.meta.env.VITE_API_ENDPOINT;

export const doApiAction = async <T>(data: {
  endpoint: string;
  method: Method;
  body?: unknown;
}): Promise<T | null> => {
  try {
    const response = await fetch(`${API_ENDPOINT}${data.endpoint}`, {
      method: data.method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: data.body ? JSON.stringify(data.body) : undefined,
    });
    console.log(response);
    return await response.json();
  } catch (e: unknown) {
    return null;
  }
};
