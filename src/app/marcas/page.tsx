'use client'

import Link from "next/link";
import { Header } from "@/components/Header";
import { useBrands } from "@/hooks/useBrands";
import { useState } from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function BrandsPage() {
  const { brands, isLoading, error } = useBrands();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = brands.filter(brand =>
    brand.Descricao?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  // Organiza as marcas por letra inicial
  const groupedBrands = filteredBrands.reduce((acc, brand) => {
    const firstLetter = brand.Descricao?.charAt(0).toUpperCase() || '';
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(brand);
    return acc;
  }, {} as Record<string, typeof brands>);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#f98e00]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Erro ao carregar marcas</h3>
            <p className="text-gray-600">Tente novamente em alguns instantes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />

      <main className="flex-1">
        {/* Hero Section Marcas */}
        <section className="relative py-16 overflow-hidden bg-white">
          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <div className="mb-8">
              <div className="bg-white shadow-md p-3 rounded-xl inline-flex items-center gap-2 text-sm border border-gray-200">
                <Link href="/" className="text-gray-600 hover:text-[#f98e00] transition-colors">Home</Link>
                <span className="text-gray-400">/</span>
                <span className="text-[#f98e00] font-medium">Marcas Parceiras</span>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f98e00] to-transparent"></div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#f98e00] via-[#0ba360] to-[#f98e00] bg-clip-text text-transparent whitespace-nowrap">
                  MARCAS PARCEIRAS
                </h1>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#0ba360] to-transparent"></div>
              </div>
              
              <p className="text-gray-700 text-lg mb-8">
                As melhores <span className="text-[#f98e00] font-semibold">marcas</span> disponíveis na Sorpack
              </p>
              
              {/* Barra de Busca */}
              <div className="max-w-md mx-auto">
                <div className="bg-white shadow-lg p-2 rounded-xl border border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar marca..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-white text-gray-900 placeholder-gray-500 border-none outline-none focus:ring-0"
                    />
                    <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de Marcas */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedBrands).map(([letter, letterBrands]) => (
              <div key={letter} className="bg-white shadow-lg rounded-2xl border border-gray-200 hover:border-[#f98e00] hover:shadow-xl transition-all duration-500">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xl">{letter}</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#f98e00]/50 to-transparent"></div>
                  </div>
                  
                  <div className="space-y-3">
                    {letterBrands.map((brand) => (
                      <Link
                        key={brand.Codigo}
                        href={`/marca/${encodeURIComponent(brand.Codigo || 0)}`}
                        className="group flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-[#f98e00] transition-all duration-300 border border-transparent hover:border-[#f98e00]/30"
                      >
                        <svg className="w-5 h-5 text-[#f98e00]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                        </svg>
                        <span className="font-medium">{brand.Descricao}</span>
                        <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-[#f98e00] transform group-hover:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z"/>
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white shadow-lg rounded-2xl p-12 max-w-md mx-auto border border-gray-200">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f98e00]/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#f98e00]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nenhuma marca encontrada</h3>
                <p className="text-gray-700 mb-2">
                  Não encontramos marcas para "{searchTerm}"
                </p>
                <p className="text-sm text-gray-600">
                  Tente uma busca diferente ou navegue por todas as marcas
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}