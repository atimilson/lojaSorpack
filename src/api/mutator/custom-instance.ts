import { useAuth } from '@/contexts/AuthContext';

const BASE_URL = 'https://pedidoexterno.mcnsistemas.net.br';

type CustomConfig = {
  url: string;
  method: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
};

export const customInstance = <T>(config: CustomConfig): Promise<T> => {
  const token = localStorage.getItem('token');
  const queryParams = config.params 
    ? `?${new URLSearchParams(config.params).toString()}`
    : '';

  return fetch(`${BASE_URL}${config.url}${queryParams}`, {
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': token }),
      ...(config.headers || {})
    },
    body: config.data ? JSON.stringify(config.data) : undefined,
    next: {
      revalidate: 21600 // 6 horas em segundos
    }
  }).then((response) => response.json());
};