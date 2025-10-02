'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useGetApiProdutoEcommerceNovos } from '@/api/generated/mCNSistemas';
import type { ProdutosEcommerceDto } from '@/api/generated/mCNSistemas.schemas';

export function useNewProducts() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();

  const {
    data: products,
    error,
    isLoading,
  } = useGetApiProdutoEcommerceNovos({empresa: 1}, {
    swr: {
      enabled: !isAuthLoading && !authError,
    }
  });

  return {
    products: products || [],
    isLoading,
    error: error ? 'Erro ao carregar produtos' : null,
  };
} 