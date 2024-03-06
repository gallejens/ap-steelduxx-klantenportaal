type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const API_ENDPOINT: string = import.meta.env.VITE_API_ENDPOINT;
const IS_DEVELOPMENT = import.meta.env.MODE === 'development';

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
      credentials: IS_DEVELOPMENT ? 'include' : 'same-origin',
      body: data.body ? JSON.stringify(data.body) : undefined,
    });
    return await response.json();
  } catch (e: unknown) {
    return null;
  }
};

export type GenericAPIResponse<T = null> = {
  status: number;
  message: string;
  data: T;
};
