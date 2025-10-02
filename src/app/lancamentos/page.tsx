"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-hot-toast";
import {
  ListBulletIcon,
  Squares2X2Icon,
  FunnelIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ShoppingCartIcon,
  AdjustmentsHorizontalIcon,
  FireIcon,
  SparklesIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useGetApiProdutoEcommerceNovos } from "@/api/generated/mCNSistemas";
import type { ProdutosEcommerceDto as Product } from "@/api/generated/mCNSistemas.schemas";
import { FilterSidebar } from "@/components/FilterSidebar";
import { PriceDisplay } from "@/components/PriceDisplay";

export default function LancamentosPage() {
  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortOrder, setSortOrder] = useState<"menor_preco" | "maior_preco" | "nome">("menor_preco");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Hooks
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { addItem } = useCart();

  const {
    data: productsData = [],
    error: apiError,
    isLoading: apiLoading,
  } = useGetApiProdutoEcommerceNovos(
    {
      empresa: 0,
    },
    {
      swr: {
        enabled: !isAuthLoading && !authError,
      },
    }
  );

  useEffect(() => {
    if (productsData && productsData.length > 0) {
      setProducts(productsData);
    }
    setIsLoading(false);
  }, [productsData]);

  // Extrair marcas e categorias únicas
  const brands = useMemo(() => {
    return Array.from(new Set(products
      .map(p => p.Marca)
      .filter((brand): brand is string => !!brand)
    )).sort();
  }, [products]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.Categoria))).sort();
  }, [products]);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Aplicar filtros de marca
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.Marca || ''));
    }

    // Aplicar filtro de preço
    filtered = filtered.filter(p => {
      const price = p.PrecoPromocional || p.Preco || 0;
      return price >= priceRange[0] && price <= priceRange[1];
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
  }, [products, selectedBrands, priceRange, sortOrder]);

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

  // Adicionar ao carrinho
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
            alt={product.Descricao || ""}
            fill
            unoptimized={true}
            className="object-contain"
          />
        </div>
        <div>
          <p className="font-medium">Produto adicionado ao carrinho!</p>
          <p className="text-sm text-gray-500 line-clamp-1">
            {product.Descricao}
          </p>
        </div>
      </div>
    );
  };

  const calcDiscount = (product: Product) => {
    const validOriginalPrice = product.Preco || 0;
    const validPromotionalPrice = product.PrecoPromocional || 0;   
    return Math.round(((validOriginalPrice - validPromotionalPrice) / validOriginalPrice) * 100);
  };

  // Renderização do card do produto
  const ProductCard = (product: Product) => (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300">
      <Link
        href={`/produto/${product.Produto}`}
        className={`block ${viewMode === "list" ? "flex gap-6" : ""}`}
      >
        <div
          className={`
          relative group
          ${viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-square"}
        `}
        >
          <Image
            src={product.Imagens?.[0]?.URL || "/placeholder.jpg"}
            alt={product.Descricao || ""}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          {(product.PrecoPromocional ?? 0) > 0 && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {calcDiscount(product)}
              % OFF
            </span>
          )}
        </div>

        <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {product.Descricao}
          </h3>

          <div className="mb-4">
            <PriceDisplay 
              originalPrice={product.Preco || 0}
              promotionalPrice={product.PrecoPromocional && product.PrecoPromocional > 0 ? product.PrecoPromocional : undefined}
              size={viewMode === "list" ? "medium" : "small"}
            />
          </div>

          {viewMode === "list" && product.DescEcommerce && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {product.DescEcommerce}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <BuildingStorefrontIcon className="w-4 h-4" />
              {product.Marca}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <CubeIcon className="w-4 h-4" />
              {product.Categoria}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <button
          onClick={(e) => handleAddToCart(e, product)}
          className={`
            w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 
            transition-all duration-300 transform hover:scale-[1.02]
            ${
              product.PrecoPromocional && product.PrecoPromocional > 0
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
  );

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#f98e00]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />

      <main className="flex-1">
        {/* Hero Section Lançamentos */}
        <section className="relative py-16 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm5 5c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#0ba360] to-[#098c51] flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#0ba360] to-transparent"></div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#0ba360] via-[#f98e00] to-[#0ba360] bg-clip-text text-transparent whitespace-nowrap">
                  LANÇAMENTOS
                </h1>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f98e00] to-transparent"></div>
              </div>
              
              <p className="text-gray-700 text-lg mb-6">
                Os mais recentes <span className="text-[#0ba360] font-semibold">produtos</span> da Sorpack Embalagens
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white shadow-lg p-3 rounded-xl flex items-center gap-2 border border-gray-200">
                  <SparklesIcon className="w-5 h-5 text-[#0ba360]" />
                  <span className="text-gray-700 text-sm font-medium">Novidades</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Substituir os filtros existentes pelo FilterSidebar */}
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
              {/* Controles de Visualização */}
              <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                      {filteredProducts.length} produtos encontrados
                    </span>
                  </div>
                  <select
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as typeof sortOrder)
                    }
                    className="p-2 border rounded-lg text-sm bg-white hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option value="menor_preco">Menor Preço</option>
                    <option value="maior_preco">Maior Preço</option>
                    <option value="nome">Nome</option>
                  </select>
                </div>
              </div>

              {/* Grid de Produtos */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.Produto} {...product} />
                ))}
              </div>

              {/* Estado Vazio */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="mb-4">
                    <CubeIcon className="w-12 h-12 mx-auto text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">
                    Nenhum produto encontrado com os filtros selecionados
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
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
