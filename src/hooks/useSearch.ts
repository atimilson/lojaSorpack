'use client'

import { useGetApiProdutoEcommerce, getApiProdutoEcommerce, useGetApiProdutoEcommercePaginado, getApiProdutoEcommercePaginado } from '@/api/generated/mCNSistemas';
import type { ProdutosEcommerceDto } from '@/api/generated/mCNSistemas.schemas';

interface UseSearchReturn {
  searchResults: ProdutosEcommerceDto[];
  isLoading: boolean;
  error: string | null;
  searchProducts: (query: string) => void;
}

export const useSearch = (): UseSearchReturn => {
  const {
    data: searchResults = {dados: []},
    error,
    isLoading,
    mutate
  } = useGetApiProdutoEcommercePaginado({ empresa: 0, busca: '', pagina: 1, limite: 10 }, {
    swr: {
      revalidateOnFocus: false,
      keepPreviousData: true
    }
  });

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    try {
      const newData = await getApiProdutoEcommercePaginado({ empresa: 0, busca: query, pagina: 1, limite: 10});
      mutate(newData);
    } catch (err) {
      console.error('Erro na busca:', err);
    }
  };

  return {
    searchResults: Array.isArray(searchResults) ? searchResults : (searchResults?.dados || []),
    isLoading,
    error: error ? 'Erro ao realizar a busca' : null,
    searchProducts
  };
}; 