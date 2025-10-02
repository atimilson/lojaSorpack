"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import {
  ListBulletIcon,
  Squares2X2Icon,
  FunnelIcon,
  CubeIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useGetApiProdutoEcommercePaginado, getApiProdutoEcommercePaginado } from '@/api/generated/mCNSistemas';
import type { ProdutosEcommerceDto as Product } from '@/api/generated/mCNSistemas.schemas';
import toast from "react-hot-toast";
import { FilterSidebar } from '@/components/FilterSidebar';
import { PriceDisplay } from "@/components/PriceDisplay";

// Função para calcular o percentual de desconto de forma segura
const calcularPercentualDesconto = (precoNormal: number | undefined | null, precoPromocional: number | undefined | null): number | null => {
  // Validar os valores
  if (!precoNormal || !precoPromocional || precoNormal <= 0 || precoPromocional <= 0 || precoPromocional >= precoNormal) {
    return null;
  }
  
  // Calcular o desconto
  const desconto = ((precoNormal - precoPromocional) / precoNormal) * 100;
  
  // Limitar o desconto a 99% para evitar valores extremos
  return Math.min(Math.round(desconto), 99);
};

export default function ProdutosPage() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { addItem } = useCart();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<string>("menor_preco");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerPage = 30;
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data: apiResponse, error: apiError, isLoading } = useGetApiProdutoEcommercePaginado({
    empresa: 0,
    pagina: 1,
    limite: itemsPerPage,
  }, {
    swr: {
      enabled: !isAuthLoading && !authError
    }
  });

  const totalItems = (apiResponse as any)?.totalRegistros || 0;
  const totalPages = (apiResponse as any)?.totalPaginas || 0;

  // Carregar produtos iniciais
  useEffect(() => {
    const products = (apiResponse as any)?.dados || [];
    setAllProducts(products);
    setCurrentPage(1);
    setHasMore(totalPages > 1);
  }, [apiResponse, totalPages]);

  // Função para carregar mais produtos
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || currentPage >= totalPages) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getApiProdutoEcommercePaginado({
        empresa: 0,
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
  }, [isLoadingMore, hasMore, currentPage, totalPages, itemsPerPage]);

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

  // Extrair marcas únicas
  const brands = useMemo(() => {
    if (!allProducts.length) return [];
    const brandSet = new Set(
      allProducts.map((p) => p.Marca).filter((brand): brand is string => !!brand)
    );
    return Array.from(brandSet);
  }, [allProducts]);

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Aplicar filtros de marca
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(
        (p) => p.Marca && selectedBrands.includes(p.Marca)
      );
    }

    // Aplicar filtro de preço
    filtered = filtered.filter((p) => {
      const price = p.Preco;
      return price && price >= priceRange[0] && price <= priceRange[1];
    });

    // Ordenação
    switch (sortOrder) {
      case "menor_preco":
        filtered.sort((a, b) => (a.Preco || 0) - (b.Preco || 0));
        break;
      case "maior_preco":
        filtered.sort((a, b) => (b.Preco || 0) - (a.Preco || 0));

        break;
      case "nome":
        filtered.sort((a, b) => a.Descricao?.localeCompare(b.Descricao || '') || 0);
        break;
    }

    return filtered;
  }, [allProducts, selectedBrands, priceRange, sortOrder]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 5000]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
            <p className="text-gray-700 text-lg">Carregando catálogo de produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />

      <main className="flex-1">
        

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtros */}
            <FilterSidebar
              brands={brands}
              selectedBrands={selectedBrands}
              onBrandChange={handleBrandChange}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              clearFilters={clearFilters}
            />

            {/* Lista de Produtos */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  {/* Controles de visualização */}
                  <div className="bg-white shadow-md p-2 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          viewMode === "grid" 
                            ? "bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white shadow-lg" 
                            : "text-gray-600 hover:text-[#f98e00] hover:bg-gray-100"
                        }`}
                      >
                        <Squares2X2Icon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          viewMode === "list" 
                            ? "bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white shadow-lg" 
                            : "text-gray-600 hover:text-[#f98e00] hover:bg-gray-100"
                        }`}
                      >
                        <ListBulletIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow-md p-3 rounded-xl border border-gray-200">
                    <span className="text-gray-700 text-sm">
                      <span className="text-[#f98e00] font-bold">{(apiResponse as any)?.totalRegistros}</span> produtos encontrados
                    </span>
                  </div>
                </div>
                
                <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="p-3 bg-white text-gray-900 border-none outline-none cursor-pointer hover:text-[#f98e00] transition-colors"
                  >
                    <option value="menor_preco" className="bg-white">Menor Preço</option>
                    <option value="maior_preco" className="bg-white">Maior Preço</option>
                    <option value="nome" className="bg-white">Nome A-Z</option>
                  </select>
                </div>
              </div>

              {/* Grid de Produtos */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-6"
                }
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product.Produto}
                    className="bg-white shadow-lg rounded-2xl border border-gray-200 hover:border-[#f98e00] hover:shadow-xl product-card group overflow-hidden transition-all duration-500"
                  >
                    <div
                      className={`p-6 ${
                        viewMode === "list" ? "flex gap-6" : ""
                      }`}
                    >
                      <Link href={`/produto/${product.Produto}`}>
                        <div
                          className={`
                          relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-50
                          ${viewMode === "list" ? "w-48 mb-0 flex-shrink-0" : ""}
                        `}
                        >
                          <Image
                            src={product.Imagens?.[0]?.URL || "/placeholder.jpg"}
                            alt={product.Descricao || ''}
                            fill
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                            unoptimized={true}
                          />
                          
                          {/* Badge de desconto */}
                          {(() => {
                            const desconto = calcularPercentualDesconto(product.Preco, product.PrecoPromocional);
                            return desconto !== null ? (
                              <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                -{desconto}% OFF
                              </div>
                            ) : null;
                          })()}
                          
                          {/* Badge de marca */}
                          {product.Marca && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              {product.Marca}
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className={viewMode === "list" ? "flex-1" : ""}>
                        <Link href={`/produto/${product.Produto}`}>
                          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#f98e00] transition-colors">
                            {product.Descricao}
                          </h3>

                          <div className="mb-4">
                            <PriceDisplay 
                              originalPrice={product.Preco || 0}
                              promotionalPrice={(product.PrecoPromocional ?? 0) > 0 ? product.PrecoPromocional : undefined}
                              size={viewMode === "list" ? "medium" : "small"}
                            />
                          </div>

                          {viewMode === "list" && (product.DescEcommerce || product.Descricao) && (
                            <p className="mt-4 text-sm text-gray-600 line-clamp-3 leading-relaxed">
                              {product.DescEcommerce || product.Descricao}
                            </p>
                          )}
                        </Link>

                        {/* Botão Adicionar ao Carrinho */}
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`w-full mt-4 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg
                            ${
                               (product.PrecoPromocional ?? 0) > 0
                                ? "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white"
                                : "bg-gradient-to-r from-[#f98e00] to-[#e67700] hover:from-[#ffa726] hover:to-[#f98e00] text-white"
                            }`}
                        >
                          <ShoppingCartIcon className="w-5 h-5" />
                          Adicionar ao Carrinho
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-white shadow-lg rounded-2xl p-12 max-w-md mx-auto border border-gray-200">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f98e00]/10 flex items-center justify-center">
                      <FunnelIcon className="w-10 h-10 text-[#f98e00]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Nenhum produto encontrado</h3>
                    <p className="text-gray-700 mb-6">
                      Não encontramos produtos com os filtros selecionados
                    </p>
                    <button
                      onClick={() => {
                        setSelectedBrands([]);
                        setPriceRange([0, 5000]);
                      }}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <FunnelIcon className="w-4 h-4" />
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}

              {/* Loading indicator para scroll infinito */}
              {filteredProducts.length > 0 && (
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
          </div>
        </div>
      </main>
    </div>
  );
}
