'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useGetApiProdutoEcommerce } from '@/api/generated/mCNSistemas';
import type { ProdutosEcommerceDto as Product } from '@/api/generated/mCNSistemas.schemas';
import { toast } from "react-hot-toast";
import {
  ListBulletIcon,
  Squares2X2Icon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ShoppingCartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { Metadata } from 'next';
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

// Tipagem para os parâmetros da página
type CategoryPageParams = {
  slug: string;
}


type SortOption = 'relevancia' | 'menor' | 'maior' | 'nome';

// Página de categoria
export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOption>('relevancia');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data: productsData = [], error: apiError, isLoading: apiLoading } = useGetApiProdutoEcommerce({
    empresa: 0,
    grupo: parseInt(params.slug)
  }, {
    swr: {
      enabled: !isAuthLoading && !authError
    }
  });


  useEffect(() => {
    if (productsData) {
      setProducts(productsData);
      
      // Calcular faixas de preço dinâmicas baseadas nos produtos
      const prices = productsData.map(p => p.PrecoPromocional || p.Preco || 0);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const range = maxPrice - minPrice;
      

      const priceRanges = [
        { min: minPrice, max: minPrice + range * 0.25, label: `Até R$ ${(minPrice + range * 0.25).toFixed(2)}` },
        { min: minPrice + range * 0.25, max: minPrice + range * 0.5, label: `R$ ${(minPrice + range * 0.25).toFixed(2)} a R$ ${(minPrice + range * 0.5).toFixed(2)}` },
        { min: minPrice + range * 0.5, max: minPrice + range * 0.75, label: `R$ ${(minPrice + range * 0.5).toFixed(2)} a R$ ${(minPrice + range * 0.75).toFixed(2)}` },
        { min: minPrice + range * 0.75, max: maxPrice, label: `Acima de R$ ${(minPrice + range * 0.75).toFixed(2)}` }
      ];
    }
  }, [productsData]);

  // Filtrar e ordenar produtos
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Aplicar filtros de marca
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.Marca || ''));
    }

    // Aplicar filtro de preço
    result = result.filter(p => {
      const price = p.PrecoPromocional || p.Preco || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Aplicar ordenação
    switch (sortOrder) {
      case 'menor':
        result.sort((a, b) => (a.PrecoPromocional || a.Preco || 0) - (b.PrecoPromocional || b.Preco || 0));
        break;
      case 'maior':
        result.sort((a, b) => (b.PrecoPromocional || b.Preco || 0) - (a.PrecoPromocional || a.Preco || 0));
        break;
      case 'nome':
        result.sort((a, b) => a.Descricao?.localeCompare(b.Descricao || '') || 0);

        break;
    }

    return result;
  }, [products, selectedBrands, priceRange, sortOrder]);

  // Extrair marcas únicas
  const brands = useMemo(() => {
    return Array.from(new Set(products
      .map(p => p.Marca)
      .filter((brand): brand is string => !!brand)
    ));
  }, [products]);

  const handleBrandChange = (marca: string) => {
    setSelectedBrands(prev => 
      prev.includes(marca)
        ? prev.filter(m => m !== marca)
        : [...prev, marca]
    );
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 5000]);
    setSortOrder('relevancia');
  };

  // Adicionar ao carrinho
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 relative w-12 h-12">
          <Image
            src={product.Imagens?.[0]?.URL || "/placeholder.jpg"}
            alt={product.Descricao || ''}
            fill
            unoptimized={true}
            className="object-contain"

          />
        </div>
        <div>
          <p className="font-medium">Produto adicionado ao carrinho!</p>
          <p className="text-sm text-gray-500 line-clamp-1">{product.Descricao}</p>
        </div>
      </div>
    );
  };

  if (apiLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#f98e00]"></div>
        </div>
      </div>
    );
  }

  const categoryName = products[0]?.Categoria || 'Categoria';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      {/* Hero Section Automotivo */}
      <section className="relative py-16 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm5 5c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="bg-white shadow-md p-3 rounded-xl inline-flex items-center gap-2 text-sm border border-gray-200">
              <Link href="/" className="text-gray-600 hover:text-[#f98e00] transition-colors">Home</Link>
              <span className="text-gray-400">/</span>
              <Link href="/categorias" className="text-gray-600 hover:text-[#f98e00] transition-colors">Categorias</Link>
              <span className="text-gray-400">/</span>
              <span className="text-[#f98e00] font-medium">{categoryName}</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center automotive-glow engine-pulse">
                <CubeIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient-automotive whitespace-nowrap">
                {categoryName?.toUpperCase()}
              </h1>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
            </div>
            
            <p className="text-gray-300 text-lg">
              <span className="text-orange-400 font-bold">{filteredAndSortedProducts.length}</span> peças automotivas especializadas
            </p>
            
            <div className="mt-6 inline-flex items-center gap-2 bg-white shadow-lg p-3 rounded-xl border border-gray-200">
              <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-gray-300 text-sm">
                <span className="text-orange-400 font-semibold">Sorpack Embalagens</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">
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
            {/* Controles de visualização */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {filteredAndSortedProducts.length} produtos
                  </span>
                </div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOption)}
                  className="text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="relevancia">Mais Relevantes</option>
                  <option value="menor">Menor Preço</option>
                  <option value="maior">Maior Preço</option>
                  <option value="nome">Nome</option>
                </select>
              </div>
            </div>

            {/* Grid/Lista de Produtos */}
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
            }>
              {filteredAndSortedProducts.map((product) => (
                <div
                  key={product.Produto}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${
                    viewMode === 'list' ? 'flex gap-6' : ''
                  }`}
                >
                  <Link href={`/produto/${product.Produto}`} className="block">
                    <div className={`
                      relative group
                      ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}
                    `}>
                      <Image
                        src={product.Imagens?.[0]?.URL || "/placeholder.jpg"}
                        alt={product.Descricao || ''}
                        fill
                        unoptimized={true}
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"

                      />
                      {(() => {
                        const desconto = calcularPercentualDesconto(product.Preco, product.PrecoPromocional);
                        return desconto !== null ? (
                          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            -{desconto}% OFF
                          </span>
                        ) : null;
                      })()}

                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                        {product.Descricao}
                      </h3>
                      <div className="mb-3">
                        <PriceDisplay 
                          originalPrice={product.Preco || 0}
                          promotionalPrice={(product.PrecoPromocional ?? 0) > 0 ? product.PrecoPromocional : undefined}
                          size="medium"
                        />
                      </div>

                    </div>
                  </Link>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    Adicionar ao Carrinho
                  </button>
                </div>
              ))}
            </div>

            {/* Estado vazio */}
            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 mb-4">
                  Nenhum produto encontrado
                </p>
                <button
                  onClick={clearFilters}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}