'use client';

import { useState } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FilterSidebarProps {
  brands: string[];
  selectedBrands: string[];
  onBrandChange: (brand: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  clearFilters: () => void;
}

export function FilterSidebar({
  brands,
  selectedBrands,
  onBrandChange,
  priceRange,
  onPriceRangeChange,
  clearFilters
}: FilterSidebarProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <>
      {/* Botão Mobile para abrir filtros */}
      <div className="md:hidden sticky top-0 z-20 bg-white p-4 shadow-sm">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
        >
          <FunnelIcon className="w-5 h-5" />
          Filtrar Produtos
        </button>
      </div>

      {/* Filtros Desktop */}
      <div className="hidden md:block w-64 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-black">
              <FunnelIcon className="w-5 h-5" />
              Filtros
            </h3>
          </div>

          {/* Preço */}
          <div className="mb-6">
            <h4 className="font-medium mb-3 text-black">Faixa de Preço</h4>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="5000"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>R$ {priceRange[0]}</span>
                <span>R$ {priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Marcas */}
          <div className="mb-6">
            <h4 className="font-medium mb-2 text-black">Marcas</h4>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 text-black hover:bg-gray-50 p-1 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => onBrandChange(brand)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Botão Limpar Filtros */}
          <button
            onClick={clearFilters}
            className="w-full py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Modal de Filtros Mobile */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
              {/* Preço */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Faixa de Preço</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>R$ {priceRange[0]}</span>
                    <span>R$ {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Marcas */}
              <div>
                <h3 className="font-medium mb-3">Marcas</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => onBrandChange(brand)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => {
                    clearFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full py-2 text-primary border border-primary rounded-lg"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-2 bg-primary text-white rounded-lg"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 