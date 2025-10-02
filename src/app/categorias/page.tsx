'use client'

import Link from "next/link";
import { Header } from "@/components/Header";
import { useCategorie } from "@/hooks/useCategorie";
import { useState } from "react";
import { MagnifyingGlassIcon, TagIcon } from '@heroicons/react/24/outline';

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategorie();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.Descricao?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  // Organiza as categorias por letra inicial
  const groupedCategories = filteredCategories.reduce((acc, category) => {
    const firstLetter = category.Descricao?.charAt(0).toUpperCase() || '';
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(category);
    return acc;
  }, {} as Record<string, typeof categories>);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
            <p className="text-gray-700 text-lg">Carregando categorias...</p>
          </div>
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
              <TagIcon className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Erro ao carregar categorias</h3>
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
        {/* Banner Principal */}
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
                <Link href="/" className="text-gray-600 hover:text-[#f98e00] transition-colors">
                  Home
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-[#f98e00] font-medium">Categorias</span>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center shadow-lg">
                  <TagIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f98e00] to-transparent"></div>
                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#f98e00] via-[#0ba360] to-[#f98e00] bg-clip-text text-transparent whitespace-nowrap">
                  CATEGORIAS
                </h1>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#0ba360] to-transparent"></div>
              </div>
              
              <p className="text-gray-700 max-w-3xl mx-auto text-xl leading-relaxed mb-8">
                Explore nossa variedade de <span className="text-[#f98e00] font-semibold">embalagens e produtos</span> organizados por categoria
              </p>
              
              {/* Barra de Busca */}
              <div className="max-w-md mx-auto">
                <div className="bg-white shadow-lg p-2 rounded-xl border border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar categoria..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-white text-gray-900 placeholder-gray-500 border-none outline-none focus:ring-0"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center">
                        <MagnifyingGlassIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de Categorias */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(groupedCategories).map(([letter, letterCategories]) => (
              <div key={letter} className="bg-white shadow-lg rounded-2xl border border-gray-200 hover:border-[#f98e00] hover:shadow-xl transition-all duration-500">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {letter}
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#f98e00]/50 to-transparent"></div>
                  </h2>
                  
                  <div className="space-y-2">
                    {letterCategories
                      .sort((a, b) => a.Descricao?.localeCompare(b.Descricao || '') || 0)
                      .map((category) => (
                      <Link
                        key={category.Codigo}
                        href={`/categoria/${encodeURIComponent(category.Codigo || 0)}`}
                        className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-[#f98e00] transition-all duration-300 group/item relative overflow-hidden"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#f98e00]/10 flex items-center justify-center group-hover/item:bg-[#f98e00]/20 transition-all duration-300 relative z-10">
                          <TagIcon className="w-4 h-4 text-[#f98e00] transition-colors" />
                        </div>
                        
                        <span className="font-medium group-hover/item:text-[#f98e00] transition-colors relative z-10">
                          {category.Descricao}
                        </span>
                        
                        <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 relative z-10">
                          <svg className="w-4 h-4 text-[#f98e00]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white shadow-lg rounded-2xl p-12 max-w-md mx-auto border border-gray-200">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f98e00]/10 flex items-center justify-center">
                  <TagIcon className="w-10 h-10 text-[#f98e00]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nenhuma categoria encontrada</h3>
                <p className="text-gray-700 mb-2">
                  Não encontramos categorias para "{searchTerm}"
                </p>
                <p className="text-sm text-gray-600">
                  Tente usar termos diferentes ou navegue pelas categorias disponíveis
                </p>
                <div className="mt-6">
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-3 bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
                  >
                    <TagIcon className="w-4 h-4" />
                    Ver Todas as Categorias
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
