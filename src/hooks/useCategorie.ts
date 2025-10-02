'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useGetApiEcommerceProdutoCategoria, useGetApiEcommerceProdutoGrupo } from '@/api/generated/mCNSistemas';
import type { ProdutoCategoriaDto, ProdutoGrupoDto } from '@/api/generated/mCNSistemas.schemas';

export function useCategorie() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  
  const {
    data: categories,
    error,
    isLoading,
  } = useGetApiEcommerceProdutoGrupo({
    swr: {
      enabled: !isAuthLoading,
    },

  });

  const sortedCategories = categories?.sort((a: ProdutoGrupoDto, b: ProdutoGrupoDto) => 
    a.Descricao?.localeCompare(b.Descricao?b.Descricao:'', 'pt-BR', { sensitivity: 'base' }) || 0
  ) || [];


  return {
    categories: sortedCategories,
    isLoading,
    error: error ? 'Erro ao carregar categorias' : null,
  };
} 