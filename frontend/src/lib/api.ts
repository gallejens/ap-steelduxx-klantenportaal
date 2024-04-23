import axios, { type AxiosError } from 'axios';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const NO_RETRY_HEADER = 'x-no-retry';
const BASE_URL: string = import.meta.env.VITE_API_ENDPOINT;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  // no need to do anything in these cases so we return the original response
  if (
    error.response?.status !== 403 ||
    error.config === undefined ||
    error.config.headers[NO_RETRY_HEADER]
  ) {
    return error.response;
  }

  // we add the NO_RETRY_HEADER to the request to ensure we dont get into an infinite loop
  error.config.headers[NO_RETRY_HEADER] = 'true'; // headers need to be stringvalue

  const result = await api<GenericAPIResponse>({
    method: 'POST',
    url: '/auth/refresh',
  });

  // if refresh succeeds (200/OK), we try the original request again because now we have valid accesstoken
  // if refresh failed (401/UNAUTHORIZED), no need to try again as result will be same so we return original response
  if (result.status === 200) {
    return await api(error.config);
  } else {
    return error.response;
  }
});

export const doApiAction = async <T = GenericAPIResponse>(data: {
  endpoint: string;
  method: Method;
  body?: unknown;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}): Promise<T | undefined> => {
  try {
    const response = await api<T>({
      url: data.endpoint,
      method: data.method,
      data: data.body,
      params: data.params,
      headers: data.headers,
    });
    return response.data;
  } catch (e: unknown) {
    console.error('API Error', e);
  }
};

export type GenericAPIResponse<T = null> = {
  status: number;
  message: string;
  data: T;
};
