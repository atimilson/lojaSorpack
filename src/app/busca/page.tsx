'use client';

import { useState, Suspense, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from "@/components/Header";
import { Product } from "@/types/product";
import { useCart } from '@/contexts/CartContext';
import Image from "next/image";
import Link from "next/link";
import { 
  ListBulletIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useGetApiProdutoEcommerce, useGetApiProdutoEcommercePaginado, getApiProdutoEcommercePaginado } from '@/api/generated/mCNSistemas';
import { PriceDisplay } from "@/components/PriceDisplay";
import axiosInstance from '@/api/axios-instance';
import { ProdutosEcommerceDto } from '@/api/generated/mCNSistemas.schemas';
import toast from "react-hot-toast";

// Componente de Loading
function LoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="text-center">
        <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg">Procurando produtos...</p>
      </div>
    </div>
  );
}

// Componente principal de busca
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProdutosEcommerceDto[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerPage = 20;
  const { addItem } = useCart();
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data: apiResponse, error, isLoading } = useGetApiProdutoEcommercePaginado({
    empresa: 0,
    busca: query,    
    pagina: 1,
    limite: itemsPerPage,
  });

  const totalItems = (apiResponse as any)?.totalRegistros || 0;
  const totalPages = (apiResponse as any)?.totalPaginas || 0;

  // Reset quando a busca mudar
  useEffect(() => {
    const products = (apiResponse as any)?.dados || [];
    setAllProducts(products);
    setCurrentPage(1);
    setHasMore(totalPages > 1);
  }, [query, apiResponse, totalPages]);

  // Função para carregar mais produtos
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || currentPage >= totalPages) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getApiProdutoEcommercePaginado({
        empresa: 0,
        busca: query,
        pagina: nextPage,
        limite: itemsPerPage,
      });

      const newProducts = (response as any)?.dados || [];
      
      if (newProducts.length > 0) {
        setAllProducts(prev => [...prev, ...newProducts]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < totalPages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao carregar mais produtos:', error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentPage, totalPages, query, itemsPerPage]);

  // Intersection Observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, isLoadingMore]);
  // let products: ProdutosEcommerceDto[] = [];

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     console.log('token',localStorage.getItem('token'));
  //     setIsLoading(true);
  //     await axiosInstance.get(`api/produto/ecommerce`,{
  //       params: {
  //         empresa: 1,
  //         busca: query,    
  //     },
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `${localStorage.getItem('token')}`
  //     }
  //   }).then((response) => {
  //     console.log('response',response.data);
  //     setProducts(response.data);
  //     setIsLoading(false);
  //   }).catch((error) => {
  //     console.error('Erro ao buscar produtos:', error);
  //     setIsLoading(false);
  //   }).finally(() => {
  //     setIsLoading(false);
  //   });
  //   }
  //   if (query.trim().length > 0) {
  //     fetchProducts();
  //   }
  // },[query]);


  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 relative w-12 h-12">
          <Image
            src={product.Imagens?.[0]?.URL || "/placeholder.jpg"}
            alt={product.Descricao || ''}
            fill
            className="object-contain"
            unoptimized={true}
          />
        </div>
        <div>
          <p className="font-medium">Produto adicionado ao carrinho!</p>
          <p className="text-sm text-gray-500 line-clamp-1">
            {product.Descricao}
          </p>
          <p className="text-sm text-gray-500">Quantidade: {1}</p>
        </div>
      </div>
    );
  };

  // if (error) {
  //   return (
  //     <div className="flex-1 flex items-center justify-center text-red-500">
  //       {error.toString()}
  //     </div>
  //   );
  // }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      {/* Background decorativo automotivo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm5 5c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Cabeçalho da Busca */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center shadow-lg">
              <MagnifyingGlassIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#f98e00] via-[#0ba360] to-[#f98e00] bg-clip-text text-transparent">Resultados da Busca</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[#f98e00] to-[#e67700] rounded-full mt-1"></div>
            </div>
          </div>
          <div className="bg-white shadow-lg p-4 rounded-xl border border-gray-200">
            <p className="text-gray-700 text-lg">
              <span className="text-[#f98e00] font-bold">{totalItems}</span> {totalItems === 1 ? 'produto encontrado' : 'produtos encontrados'} para 
              <span className="text-gray-900 font-semibold ml-1">"{query}"</span>
              {allProducts.length < totalItems && (
                <span className="text-gray-600 text-sm ml-2">
                  (exibindo {allProducts.length} de {totalItems})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Controles de Visualização */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white shadow-md p-2 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white shadow-lg' 
                    : 'text-gray-600 hover:text-[#f98e00] hover:bg-gray-100'
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white shadow-lg' 
                    : 'text-gray-600 hover:text-[#f98e00] hover:bg-gray-100'
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="bg-white shadow-lg p-3 rounded-xl border border-gray-200">
            <p className="text-gray-700 text-sm">
              <span className="text-[#f98e00]">Sorpack Embalagens</span> - Embalagens e Produtos
            </p>
          </div>
        </div>

        {/* Grid de Produtos */}
        {allProducts?.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-6"
          }>
            {allProducts?.map((product) => (
              <div
                key={product.Produto}
                className="bg-white shadow-lg rounded-2xl border border-gray-200 hover:border-[#f98e00] hover:shadow-xl product-card group overflow-hidden transition-all duration-500"
              >
                <div className={`p-6 ${viewMode === 'list' ? 'flex gap-6' : ''}`}>
                  <Link href={`/produto/${product.Produto}`}>
                    <div className={`
                      relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-50
                      ${viewMode === 'list' ? 'w-48 mb-0 flex-shrink-0' : ''}
                    `}>
                      <Image
                        src={product.Imagens?.[0]?.URL || '/placeholder.jpg'}
                        alt={product.Descricao || ''}
                        fill
                        unoptimized={true}
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Badge de marca se existir */}
                      {product.Marca && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                          {product.Marca}
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <Link href={`/produto/${product.Produto}`}>
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#f98e00] transition-colors">
                        {product.Descricao}
                      </h3>
                      
                      <div className="mb-4">
                        <PriceDisplay 
                          originalPrice={product.Preco || 0}
                          promotionalPrice={product.PrecoPromocional && product.PrecoPromocional > 0 ? product.PrecoPromocional : undefined}
                          size={viewMode === "list" ? "medium" : "small"}
                        />
                      </div>

                      {viewMode === 'list' && product.DescEcommerce && (
                        <p className="mt-4 text-sm text-gray-600 line-clamp-3 leading-relaxed">
                          {product.DescEcommerce}
                        </p>
                      )}
                    </Link>

                    {/* Botão Adicionar ao Carrinho */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-[#f98e00] to-[#e67700] hover:from-[#ffa726] hover:to-[#f98e00] text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white shadow-lg rounded-2xl p-12 max-w-md mx-auto border border-gray-200">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f98e00]/10 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-10 h-10 text-[#f98e00]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Nenhum produto encontrado</h3>
              <p className="text-gray-700 mb-2">
                Não encontramos produtos para "{query}"
              </p>
              <p className="text-sm text-gray-600">
                Tente usar palavras-chave diferentes ou consulte nossos especialistas
              </p>
              <div className="mt-6">
                <Link 
                  href="/produtos"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Ver Todas as Peças
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator para scroll infinito */}
        {allProducts?.length > 0 && (
          <div ref={observerTarget} className="mt-12 flex justify-center items-center py-8">
            {isLoadingMore && (
              <div className="bg-white shadow-lg p-6 rounded-xl flex items-center gap-4 border border-gray-200">
                <ArrowPathIcon className="w-6 h-6 text-[#f98e00] animate-spin" />
                <span className="text-gray-700">Carregando mais produtos...</span>
              </div>
            )}
            {!hasMore && allProducts.length > 0 && (
              <div className="bg-white shadow-lg p-4 rounded-xl border border-gray-200">
                <p className="text-gray-700 text-center">
                  ✓ Todos os <span className="text-[#f98e00] font-bold">{totalItems}</span> produtos foram carregados
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Componente página principal
export default function BuscaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      <Suspense fallback={<LoadingState />}>
        <SearchContent />
      </Suspense>
    </div>
  );
} 