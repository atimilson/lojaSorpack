'use client'

import Image from "next/image";
import Link from "next/link";
import { useBrands } from "@/hooks/useBrands";
import { useSearch } from "@/hooks/useSearch";
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  Bars3Icon,
  ChevronDownIcon,
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon,
  FolderIcon,
  TagIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  XMarkIcon,
  CubeIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from 'next/navigation';
import { useDebounce } from "@/hooks/useDebounce";
import { useCart } from "@/contexts/CartContext";
import { useCategorie } from '@/hooks/useCategorie';
import { useGetApiEmpresa } from '@/api/generated/mCNSistemas';
import type { EmpresaDto as Empresa } from '@/api/generated/mCNSistemas.schemas';
import { useAuth } from "@/contexts/AuthContext";
import LogoSorpak from '../../public/logoSorpack.png';

export function Header() {
  const { isLoading: isAuthLoading, error: authError, token, isAuthenticated, authenticate } = useAuth();
  const router = useRouter();
  const { brands, isLoading: isBrandsLoading } = useBrands();
  const { itemsCount } = useCart();
  const [searchBrand, setSearchBrand] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { searchResults, isLoading: isSearchLoading, searchProducts } = useSearch();
  const debouncedSearch = useDebounce(searchQuery, 3000);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalDropdownRef = useRef<HTMLDivElement>(null);
  const { categories, isLoading: isCategoriesLoading } = useCategorie();
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchMobileOpen, setIsSearchMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [shouldAutoOpen, setShouldAutoOpen] = useState(true);

  // const { data: empresa = [] } = useGetApiEmpresa({
  //   empresa: 1
  // }, {
  //   swr: {
  //     enabled: !isAuthLoading && !authError
  //   }
  // });

  useEffect(() => {
    if (token === null && !isAuthenticated) {
      authenticate();
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredBrands = brands.filter(brand => 
    brand.Descricao?.toLowerCase().includes(searchBrand.toLowerCase()) || false
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

  // Filtrar categorias baseado na busca
  const filteredCategories = categories.filter(category =>
    category.Descricao?.toLowerCase().includes(searchCategory.toLowerCase()) || false
  );

  // Agrupar categorias por letra inicial (ordem alfabética)
  const groupedCategories = useMemo(() => {
    return filteredCategories.reduce((acc, category) => {
      const firstLetter = category.Descricao?.charAt(0).toUpperCase() || '';
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(category);
      return acc;
    }, {} as Record<string, typeof categories>);
  }, [filteredCategories]);

  useEffect(() => {
    if (debouncedSearch && shouldAutoOpen) {
      searchProducts(debouncedSearch);
      setIsSearchOpen(true);
    } else if (!debouncedSearch) {
      setIsSearchOpen(false);
      setShouldAutoOpen(true); // Reset flag when search is cleared
    }
  }, [debouncedSearch, searchProducts, shouldAutoOpen]);

  // Fechar resultados ao clicar fora e reposicionar dropdown

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isInsideSearch = searchRef.current?.contains(target);
      const isInsidePortalDropdown = portalDropdownRef.current?.contains(target);
      
      if (!isInsideSearch && !isInsidePortalDropdown) {
        setIsSearchOpen(false);
        setShouldAutoOpen(false); // Prevent auto reopening
      }
    }

    function handleResize() {
      // Force re-render to update dropdown position
      setDropdownKey(prev => prev + 1);
    }

    function handleScroll() {
      // Close dropdown on scroll to avoid positioning issues
      if (isSearchOpen) {
        setIsSearchOpen(false);
        setShouldAutoOpen(false); // Prevent auto reopening
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSearchOpen]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    // Fechar dropdown ao pressionar Esc
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isDropdownOpen]);

  // Fechar dropdown de categorias ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }

    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setShouldAutoOpen(false);
    }
  }

  function getDropdownPosition() {
    if (!searchRef.current) return {};
    
    const rect = searchRef.current.getBoundingClientRect();
    return {
      position: 'fixed' as const,
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 99999
    };
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Faixa superior - Informações de entrega/CEP */}
      <div className="bg-white border-b border-gray-200 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
            </div>
            <div className="flex items-center gap-4 text-gray-700">
              <Link href="/central-ajuda" className="hover:text-[#f98e00] transition-colors duration-300 font-medium">Central de Ajuda</Link>
              <Link href="/acompanhe-pedido" className="hover:text-[#f98e00] transition-colors duration-300 font-medium">Acompanhe seu Pedido</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Linha principal - Logo, Busca e Ações */}
      <div className="bg-white shadow-md border-b border-gray-200 max-sm:hidden sm:hidden md:block">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="shine-effect">
              <Image
                src={LogoSorpak}
                alt="Sorpack Embalagens - O Atacadão das Embalagens"
                width={200}
                height={50}
                priority
                unoptimized={true}
              />
            </Link>

            {/* Barra de busca com dropdown de resultados */}
            <div className="flex-1 max-w-3xl relative" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="flex">
                  <div className="flex-1 relative">
                    <input 
                      type="search"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShouldAutoOpen(true); // Re-enable auto opening when typing
                      }}
                      placeholder="O que você procura?"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] text-gray-900 placeholder-gray-500 bg-white rounded-l-lg transition-all duration-300"
                    />
                    {isSearchLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                      </div>
                    )}
                  </div>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#f98e00] to-[#e67700] hover:from-[#ffa726] hover:to-[#f98e00] text-white rounded-r-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>

            </div>

            {/* Ações do usuário */}
            <div className="flex items-center gap-6">
              <Link href="/minha-conta" className="flex flex-col items-center group">
                <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center group-hover:bg-[#f98e00]/10 group-hover:border-[#f98e00] transition-all duration-300">
                  <UserIcon className="w-6 h-6 text-gray-700 group-hover:text-[#f98e00]" />
                </div>
                <span className="text-xs text-gray-700 group-hover:text-[#f98e00] transition-colors font-medium mt-1">Minha Conta</span>
              </Link>
              {/* <Link href="/favoritos" className="flex flex-col items-center">
                <HeartIcon className="w-6 h-6 text-gray-700" />
                <span className="text-xs text-gray-700">Favoritos</span>
              </Link> */}
              <Link href="/carrinho" className="flex flex-col items-center relative group">
                <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center group-hover:bg-[#f98e00]/10 group-hover:border-[#f98e00] transition-all duration-300">
                  <ShoppingCartIcon className="w-6 h-6 text-gray-700 group-hover:text-[#f98e00]" />
                  {itemsCount > 0 && (
                    <span className="absolute -top-0 -right-0.5 bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                      {itemsCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-700 group-hover:text-[#f98e00] transition-colors font-medium mt-1">Carrinho</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Linha de navegação - Marcas e Links */}
      <nav className="bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white max-sm:hidden sm:hidden md:block shadow-md relative z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Menu de Categorias */}
              <div className="relative" ref={categoryDropdownRef}>
                <button 
                  className="flex items-center gap-2 py-4 hover:text-[#f98e00] transition-colors duration-300 font-medium"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                >
                  <TagIcon className="w-6 h-6" />
                  <span className="font-semibold">Categorias</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {/* Dropdown de Categorias */}
                {isCategoryDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 w-screen max-w-4xl bg-white shadow-2xl rounded-b-lg flex flex-col dropdown-menu border border-gray-200"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                  >
                    {/* Barra de pesquisa fixa no topo */}
                    <div className="sticky top-0 bg-white p-4 border-b border-gray-200 z-10">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar categoria..."
                          value={searchCategory}
                          onChange={(e) => setSearchCategory(e.target.value)}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] bg-white text-gray-900 placeholder-gray-500 transition-all duration-300"
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Lista de categorias com scroll */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="grid grid-cols-3 gap-6 p-6">
                        {Object.entries(groupedCategories).map(([letter, letterCategories]) => (
                          letterCategories.length > 0 && (
                            <div key={letter} className="space-y-3">
                              <h3 className="font-bold text-[#f98e00] text-lg flex items-center gap-2">
                                <span className="w-8 h-8 bg-[#f98e00]/10 rounded-lg flex items-center justify-center text-[#f98e00] border border-[#f98e00]/30">
                                  {letter}
                                </span>
                              </h3>
                              <div className="space-y-1">
                                {letterCategories
                                  .sort((a, b) => a.Descricao?.localeCompare(b.Descricao || '') || 0)
                                  .map((category) => (
                                    <Link
                                      key={category.Codigo}
                                      href={`/categoria/${encodeURIComponent(category.Codigo || 0)}`}
                                      className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm transition-colors group"
                                      onClick={() => setIsCategoryDropdownOpen(false)}
                                    >

                                      <div className="flex items-center justify-between">
                                        <span className="group-hover:text-[#f98e00] transition-colors">
                                          {category.Descricao}
                                        </span>
                                        <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-[#f98e00] transition-colors" />
                                      </div>
                                    </Link>
                                  ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Footer fixo */}
                    <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 text-center">
                      <Link
                        href="/categorias"
                        className="text-gray-700 hover:text-[#f98e00] font-semibold inline-flex items-center gap-2 transition-colors duration-300"
                        onClick={() => setIsCategoryDropdownOpen(false)}
                      >
                        Ver todas as categorias
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Menu de marcas com dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center gap-2 py-4 hover:text-[#f98e00] transition-colors duration-300 font-medium"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Bars3Icon className="w-6 h-6" />
                  <span className="font-semibold">Marcas</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                {/* Dropdown menu melhorado */}
                {isDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 w-screen max-w-4xl bg-white shadow-2xl rounded-b-lg flex flex-col dropdown-menu border border-gray-200"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                  >
                    {/* Barra de pesquisa fixa no topo */}
                    <div className="sticky top-0 bg-white p-4 border-b border-gray-200 z-10">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar marca..."
                          value={searchBrand}
                          onChange={(e) => setSearchBrand(e.target.value)}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f98e00] text-gray-900 bg-white placeholder-gray-500 transition-all duration-300"
                        />
                        <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    {/* Área de scroll */}
                    <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                      {isBrandsLoading ? (
                        <div className="p-4 text-gray-600">Carregando...</div>
                      ) : (
                        <div className="grid grid-cols-3 gap-6 p-6">
                          {Object.entries(groupedBrands).map(([letter, letterBrands]) => (
                            <div key={letter} className="space-y-2">
                              <h3 className="font-bold text-[#f98e00] text-lg">{letter}</h3>
                              <div className="space-y-1">
                                {letterBrands.map((brand) => (
                                  <Link
                                    key={brand.Codigo || ''}
                                    href={`/marca/${encodeURIComponent(brand.Codigo || 0)}`}
                                    className="block px-2 py-1 rounded hover:bg-gray-100 text-gray-700 hover:text-[#f98e00] text-sm transition-colors duration-200"
                                    onClick={() => setIsDropdownOpen(false)}

                                  >
                                    {brand.Descricao}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer do dropdown fixo na parte inferior */}
                    <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 text-center mt-auto">
                      <Link
                        href="/marcas"
                        className="text-gray-700 hover:text-[#f98e00] font-medium transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Ver todas as marcas →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                <Link href="/promocoes" className="flex items-center gap-2 py-4 hover:text-[#f98e00] transition-colors duration-300 group">
                  <span className="font-semibold relative">Promoções</span>
                </Link>
                <Link href="/lancamentos" className="flex items-center gap-2 py-4 hover:text-[#f98e00] transition-colors duration-300 group">
                  <span className="font-semibold relative">Lançamentos</span>
                </Link>
              </div>
            </div>

            {/* Links secundários */}
            <div className="flex items-center gap-6">
              <Link href="/venda-filiais" className="flex items-center gap-2 hover:text-[#f98e00] transition-colors duration-300 group">
                <BuildingStorefrontIcon className="w-6 h-6" />
                <span className="relative font-medium">Nossas Lojas</span>
              </Link>
              {/* <Link href="/fale-conosco" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                <span>Fale Conosco</span>
              </Link> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="bg-white shadow-md md:hidden border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
            <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#f98e00]/10 transition-all duration-300 text-gray-700 hover:text-[#f98e00] border border-gray-300 hover:border-[#f98e00]"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <Link href="/" className="flex-shrink-0 shine-effect">
            <Image src={`/logoSorpack.png`} alt="Logo" width={120} height={40} unoptimized={true}/>
          </Link>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSearchMobileOpen(!isSearchMobileOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#f98e00]/10 transition-all duration-300 text-gray-700 hover:text-[#f98e00] border border-gray-300 hover:border-[#f98e00]"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
            <Link href="/minha-conta" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#f98e00]/10 transition-all duration-300 text-gray-700 hover:text-[#f98e00] border border-gray-300 hover:border-[#f98e00]">
              <UserIcon className="w-6 h-6" />
            </Link>
            <Link href="/carrinho" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#f98e00]/10 transition-all duration-300 text-gray-700 hover:text-[#f98e00] border border-gray-300 hover:border-[#f98e00] relative">
              <ShoppingCartIcon className="w-6 h-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-lg font-semibold">
                  {itemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Barra de Pesquisa Mobile */}
        {isSearchMobileOpen && (
          <div className="px-4 py-3 border-t border-gray-200 animate-fadeIn bg-gray-50">
            <form onSubmit={handleSearch} className="flex flex-col gap-2">
              <div className="relative">
                <input 
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="O que você procura?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f98e00] text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white"
                />
                {isSearchLoading && (
                  <div className="absolute right-14 top-1/2 -translate-y-1/2">
                    <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                )}
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white hover:from-[#ffa726] hover:to-[#f98e00] transition-all duration-300 shadow-lg"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            {/* Resultados da pesquisa mobile */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[60vh] overflow-y-auto dropdown-menu z-[9999] relative">
                {searchResults.map((product) => (
                  <Link
                    key={product.Produto}
                    href={`/produto/${product.Produto}`}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-200 last:border-0 transition-all duration-300"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setIsSearchMobileOpen(false);
                    }}
                  >
                    <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={product.Imagens?.[0]?.URL || '/placeholder.jpg'}
                        alt={product.Descricao || ''}
                        fill
                        className="object-contain"
                        unoptimized={true}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.Descricao}
                      </h4>
                      <p className="text-sm font-bold text-[#f98e00] mt-1">
                        R$ {product.Preco?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menu Mobile Lateral */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 border-r border-gray-200">
            <div className="h-full flex flex-col">
              {/* Cabeçalho do menu */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <Image src={`/logoSorpack.png`} alt="Logo" width={100} height={30} unoptimized={true}/>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-500 transition-all duration-300 shadow-sm border border-gray-300 hover:border-red-400"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de links principais */}
              <nav className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                <div className="px-3 py-4">
                  <div className="space-y-1">
                    <Link 
                      href="/minha-conta" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f98e00]/10 text-gray-700 hover:text-[#f98e00] transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#f98e00] border border-gray-300">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Minha Conta</span>
                    </Link>
                    <Link 
                      href="/carrinho" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f98e00]/10 text-gray-700 hover:text-[#f98e00] transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#f98e00] border border-gray-300">
                          <ShoppingCartIcon className={itemsCount > 0 ? "w-4 h-4" : "w-5 h-5"} />
                        </div>
                        {itemsCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white text-xs min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full font-semibold">
                            {itemsCount}
                          </span>
                        )}
                      </div>
                      <span className="font-medium">Carrinho</span>
                    </Link>
                  </div>
                </div>

                {/* Categorias */}
                <div className="px-3 pb-2">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Navegue
                  </h3>
                  <div className="mt-2 space-y-1">
                    <Link 
                      href="/produtos" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f98e00]/10 text-gray-700 hover:text-[#f98e00] transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center text-white">
                        <CubeIcon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Produtos</span>
                    </Link>
                    <Link 
                      href="/categorias" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f98e00]/10 text-gray-700 hover:text-[#f98e00] transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center text-white">
                        <TagIcon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Categorias</span>
                    </Link>
                    <Link 
                      href="/marcas" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f98e00]/10 text-gray-700 hover:text-[#f98e00] transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center text-white">
                        <BuildingStorefrontIcon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Marcas</span>
                    </Link>
                    <Link 
                      href="/promocoes" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#0ba360]/10 text-gray-700 hover:text-[#0ba360] transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0ba360] to-[#098c51] flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium">Promoções</span>
                    </Link>
                    <Link 
                      href="/lancamentos" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#0ba360]/10 text-gray-700 hover:text-[#0ba360] transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0ba360] to-[#098c51] flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M9.375 3a1.875 1.875 0 000 3.75h1.875v4.5H3.375A1.875 1.875 0 011.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0112 2.753a3.375 3.375 0 015.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 10-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3z" />
                          <path d="M11.25 12.75H3v6.75a2.25 2.25 0 002.25 2.25h6v-9zM12.75 12.75v9h6.75a2.25 2.25 0 002.25-2.25v-6.75h-9z" />
                        </svg>
                      </div>
                      <span className="font-medium">Lançamentos</span>
                    </Link>
                  </div>
                </div>
              </nav>

              {/* Rodapé do menu com links de contato */}
              {/* <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Link 
                  href="/fale-conosco" 
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-secondary text-white hover:shadow-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span className="font-medium">Fale Conosco</span>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Dropdown Portal */}
      {mounted && isSearchOpen && searchResults.length > 0 && createPortal(
        <div 
          ref={portalDropdownRef}
          key={dropdownKey}
          className="bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[70vh] overflow-y-auto dropdown-menu"
          style={getDropdownPosition()}
        >
          {searchResults.map((product) => (
            <div
              key={product.Produto}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-200 last:border-0 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setIsSearchOpen(false);
                setShouldAutoOpen(false); // Prevent auto reopening
                router.push(`/produto/${product.Produto}`);
              }}
            >
              <div className="relative w-16 h-16">
                <Image
                  src={product.Imagens?.[0]?.URL || '/placeholder.jpg'}
                  alt={product.Descricao || ''}
                  fill
                  className="object-contain"
                  unoptimized={true}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                  {product.Descricao}
                </h4>
                <p className="text-sm font-bold text-[#f98e00] mt-1">
                  R$ {product.Preco?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </header>
  );
}