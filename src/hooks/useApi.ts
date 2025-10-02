import { useAuth } from '@/contexts/AuthContext';
import { customInstance } from '@/api/mutator/custom-instance';

export function useApi() {
  const { token } = useAuth();

  const fetcher = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    if (!token) {
      throw new Error('Token não disponível');
    }

    return customInstance<T>({
      url: endpoint,
      method: options.method || 'GET',
      data: options.body,
    });
  };

  return { fetcher };
} 