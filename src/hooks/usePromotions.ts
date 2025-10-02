'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useGetApiPromocaoEcommerce } from '@/api/generated/mCNSistemas';
import type { ProdutosEmPromocaoEcommerceDto } from '@/api/generated/mCNSistemas.schemas';

export function usePromotions() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();

  const {
    data: promotions,
    error,
    isLoading,
  } = useGetApiPromocaoEcommerce({ empresa: 1 }, {
    swr: {
      enabled: !isAuthLoading && !authError,
    }
  });

  return {
    promotions: promotions || [],
    isLoading,
    error: error ? 'Erro ao carregar promoções' : null,
  };
} 