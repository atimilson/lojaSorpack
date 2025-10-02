'use client'

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useGetApiProdutoEcommerce } from '@/api/generated/mCNSistemas';
import type { ProdutosEcommerceDto as Product } from '@/api/generated/mCNSistemas.schemas';
import { 
  ListBulletIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon,
  StarIcon,
  AdjustmentsHorizontalIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { toast } from "react-hot-toast";
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

type SortOption = 'relevancia' | 'menor' | 'maior' | 'nome' | 'mais_vendidos';

export default function BrandPage({ params }: { params: { slug: string } }) {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { addItem } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([params.slug]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortOrder, setSortOrder] = useState<'menor_preco' | 'maior_preco' | 'nome'>('menor_preco');

  const { data: products = [], error: apiError, isLoading } = useGetApiProdutoEcommerce({
    empresa: 0,
    marca: parseInt(params.slug)
  }, {
    swr: {
      enabled: !isAuthLoading && !authError
    }
  });

  // Extrair categorias únicas
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.Categoria)));
  }, [products]);

  // Extrair marcas únicas
  const brands = useMemo(() => {
    if (!products.length) return [];
    const brandSet = new Set(
      products.map((p) => p.Marca).filter((brand): brand is string => !!brand)
    );
    return Array.from(brandSet);
  }, [products]);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Aplicar filtro de preço
    filtered = filtered.filter((p) => {
      const price = p.PrecoPromocional || p.Preco;
      return price && price >= priceRange[0] && price <= priceRange[1];
    });

    // Ordenação
    switch (sortOrder) {
      case "menor_preco":
        filtered.sort((a, b) => {
          const priceA = a.PrecoPromocional || a.Preco || 0;
          const priceB = b.PrecoPromocional || b.Preco || 0;
          return priceA - priceB;
        });
        break;
      case "maior_preco":
        filtered.sort((a, b) => {
          const priceA = a.PrecoPromocional || a.Preco || 0;
          const priceB = b.PrecoPromocional || b.Preco || 0;
          return priceB - priceA;
        });
        break;
      case "nome":
        filtered.sort((a, b) => a.Descricao?.localeCompare(b.Descricao || '') || 0);
        break;
    }

    return filtered;
  }, [products, priceRange, sortOrder]);

  const handleCategoryChange = (categoria: string) => {
    // Implementation of handleCategoryChange
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands([brand]); // Mantém apenas uma marca selecionada
  };

  const clearFilters = () => {
    setPriceRange([0, 5000]);
  };

  // Adicione a função de adicionar ao carrinho
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
          <p className="text-sm text-gray-500">Quantidade: 1</p>
        </div>
      </div>
    );
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const brandName = products[0]?.Marca || 'Marca';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
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
              {/* Breadcrumb e Cabeçalho */}
              <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                  <nav className="text-sm text-gray-500 mb-4">
                    <ol className="flex items-center gap-2">
                      <li><Link href="/" className="hover:text-primary">Home</Link></li>
                      <span>/</span>
                      <li><Link href="/marcas" className="hover:text-primary">Marcas</Link></li>
                      <span>/</span>
                      <li className="text-gray-900 font-medium">{brandName}</li>
                    </ol>
                  </nav>
                  
                  <h1 className="text-2xl font-bold text-gray-900">{brandName}</h1>
                  <p className="text-gray-600 mt-2">
                    {products.length} produtos encontrados
                  </p>
                </div>
              </div>

              {/* Botão de filtros mobile */}
             
              {/* Cabeçalho da lista */}
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                    >
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Ordenar por:</span>
                    <select 
                      className="text-sm border rounded-lg px-2 py-1"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'menor_preco' | 'maior_preco' | 'nome')}
                    >
                      <option value="menor_preco">Menor Preço</option>
                      <option value="maior_preco">Maior Preço</option>
                      <option value="nome">Nome</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid/Lista de produtos */}
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  <div 
                    key={product.Produto}
                    className={`
                      bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300
                      ${viewMode === 'list' ? 'block' : ''}
                    `}
                  >
                    <Link
                      href={`/produto/${product.Produto}`}
                      className={`block ${viewMode === 'list' ? 'flex gap-6' : ''}`}
                    >
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
                            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{desconto}% OFF
                            </span>
                          ) : null;
                        })()}

                      </div>

                      <div className={`
                        p-4 flex flex-col
                        ${viewMode === 'list' ? 'flex-1' : ''}
                      `}>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                            {product.Descricao}
                          </h3>
                          
                          <div className="mb-4">
                            <PriceDisplay 
                              originalPrice={product.Preco || 0}
                              promotionalPrice={(product.PrecoPromocional ?? 0) > 0 ? product.PrecoPromocional : undefined}
                              size={viewMode === 'list' ? "medium" : "small"}
                            />
                          </div>

                          {viewMode === 'list' &&  (
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                              {product.DescEcommerce? product.DescEcommerce : product.Observacao}
                            </p>
                          )}
                        </div>

                        {/* Informações adicionais
                        <div className="space-y-2 text-sm text-gray-500 mb-4">
                          <p className="flex items-center gap-1">
                            <BuildingStorefrontIcon className="w-4 h-4" />
                            Marca: {product.Marca}
                          </p>
                          {product.Categoria && (
                            <p className="flex items-center gap-1">
                              <CubeIcon className="w-4 h-4" />
                              Categoria: {product.Categoria}
                            </p>
                          )}
                        </div> */}
                      </div>
                    </Link>

                    {/* Botão Adicionar ao Carrinho */}
                    <div className="px-4 pb-4">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`
                          w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 
                          transition-all duration-300 transform hover:scale-[1.02]
                          ${  (product.PrecoPromocional ?? 0) > 0
                              ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-primary hover:bg-primary-dark text-white"
                          }
                        `}
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">Nenhum produto encontrado com os filtros selecionados</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-primary hover:text-primary-dark font-medium"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 