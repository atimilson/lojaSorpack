'use client';

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import toast from 'react-hot-toast';
import { ProdutosEmPromocaoEcommerceDto } from "@/api/generated/mCNSistemas.schemas";
import {  useGetApiPromocaoEcommerce } from '@/api/generated/mCNSistemas';
import { FilterSidebar } from '@/components/FilterSidebar';
import { useState, useMemo } from 'react';
import { Product } from "@/types/product";
import { FireIcon, ListBulletIcon, ShoppingCartIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
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

export default function PromocoesPage() {
  const { data: products = [], isLoading: productsLoading } = useGetApiPromocaoEcommerce({
    empresa: 0
  });
  const { addItem } = useCart();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'menor_preco' | 'maior_preco' | 'nome'>('menor_preco');

  // Extrair marcas únicas
  const brands = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return Array.from(new Set(products
      .map(p => p.Marca)
      .filter((brand): brand is string => typeof brand === 'string')
    )).sort();
  }, [products]);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    let filtered = [...products];

    // Aplicar filtros de marca
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.Marca || ''));
    }

    // Aplicar filtro de preço
    filtered = filtered.filter(p => {
      const price = p.PrecoPromocional || p.PrecoNormal || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Ordenação
    switch (sortOrder) {
      case "menor_preco":
        filtered.sort((a, b) => {
          const priceA = a.PrecoPromocional || a.PrecoNormal || 0;
          const priceB = b.PrecoPromocional || b.PrecoNormal || 0;
          return priceA - priceB;
        });

        break;
      case "maior_preco":
        filtered.sort((a, b) => {
          const priceA = a.PrecoPromocional || a.PrecoNormal || 0;
          const priceB = b.PrecoPromocional || b.PrecoNormal || 0;
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

  if (productsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />

      <main className="flex-1">
        {/* Hero Section Promoções */}
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center shadow-lg">
                  <FireIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-red-500 via-[#f98e00] to-red-500 bg-clip-text text-transparent whitespace-nowrap">
                  OFERTAS IMPERDÍVEIS
                </h1>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f98e00] to-transparent"></div>
              </div>
              
              <p className="text-gray-700 text-lg mb-6">
                <span className="text-red-500 font-bold">{filteredProducts.length}</span> produtos em <span className="text-red-500 font-semibold">promoção</span>
              </p>
              
              <div className="inline-flex items-center gap-2 bg-white shadow-lg p-3 rounded-xl border border-gray-200">
                <FireIcon className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 text-sm">
                  <span className="text-red-500 font-semibold">Sorpack Embalagens</span> - Aproveite Agora
                </span>
              </div>
            </div>
          </div>
        </section>

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
              {/* Controles de Visualização */}
              <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-red-500 to-red-700 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'list' 
                        ? 'bg-gradient-to-r from-red-500 to-red-700 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                      {filteredProducts.length} produtos encontrados
                    </span>
                  </div>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'menor_preco' | 'maior_preco' | 'nome')}
                    className="p-2 border rounded-lg text-sm bg-white hover:border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  >
                    <option value="menor_preco">Menor Preço</option>
                    <option value="maior_preco">Maior Preço</option>
                    <option value="nome">Nome</option>
                  </select>
                </div>
              </div>

              {/* Grid de Produtos */}
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  <div
                    key={product.Produto}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <Link href={`/produto/${product.Produto}`}>
                      <div className="p-4">
                        <div className="relative aspect-square mb-4 group-hover:scale-105 transition-transform duration-300">
                          <Image
                            src={product.Imagens?.[0]?.URL || '/placeholder.jpg'}
                            alt={product.Descricao || 'Produto'}
                            fill
                            unoptimized={true}
                            className="object-contain"
                          />
                          {(() => {
                            const desconto = calcularPercentualDesconto(product.PrecoNormal, product.PrecoPromocional);
                            return desconto !== null ? (
                              <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
                                -{desconto}%
                              </div>
                            ) : null;
                          })()}
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">{product.Marca}</p>
                          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                            {product.Descricao}
                          </h3>
                          
                          <div className="space-y-1">
                            <PriceDisplay 
                              originalPrice={product.PrecoNormal || 0}
                              promotionalPrice={product.PrecoPromocional}
                              size="medium"
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Botão Adicionar ao Carrinho */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addItem(product, 1);
                        toast.success(
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 relative w-12 h-12">
                              <Image
                                src={product.Imagens?.[0]?.URL || '/placeholder.jpg'}
                                alt={product.Descricao || 'Produto'}
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
                      }}
                      className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center gap-2 transition-colors group-hover:bg-red-700"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                ))}
              </div>

              {/* Mensagem de Nenhum Produto */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                  <p className="text-gray-500 mb-4">Nenhum produto encontrado com os filtros selecionados</p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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