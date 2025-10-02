'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useGetApiEcommerceProdutoMarca } from '@/api/generated/mCNSistemas';
import type { ProdutoMarcaDto } from '@/api/generated/mCNSistemas.schemas';
import { useEffect } from 'react';
import { ZodNull } from 'zod';

export function useBrands() {
  const { isLoading: isAuthLoading, error: authError, token, isAuthenticated, authenticate } = useAuth();
  

  const {
    data: brands,
    error,
    isLoading: isApiLoading,
  } = useGetApiEcommerceProdutoMarca({
    swr: {
      enabled: !!token, // Só executa quando tem token
    },
  });

  const sortedBrands = brands?.sort((a: ProdutoMarcaDto, b: ProdutoMarcaDto) => 
    a.Descricao?.localeCompare(b.Descricao?b.Descricao:'', 'pt-BR', { sensitivity: 'base' }) || 0
  ) || [];


  return {
    brands: sortedBrands,
    isLoading: isApiLoading,
    error: error ? 'Erro ao carregar marcas' : null,
  };
} 