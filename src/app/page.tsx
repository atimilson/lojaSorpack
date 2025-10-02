"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePromotions } from "@/hooks/usePromotions";
import Image from "next/image";
import { Header } from "@/components/Header";
import { BannerCarousel } from "@/components/BannerCarousel";
import { useSocialMedia } from "@/hooks/useSocialMedia";
import Link from "next/link";
import { useGetApiProdutoEcommercePaginado } from '@/api/generated/mCNSistemas';
import { ProdutosEcommerceDto } from "@/api/generated/mCNSistemas.schemas";
import {
  ArrowRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  CubeIcon,
  SparklesIcon,
  CheckBadgeIcon,
  BoltIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
} from "react-icons/fa";

export default function Home() {
  const { isAuthenticated, authenticate } = useAuth();
  const { promotions = [], isLoading: isPromotionsLoading } = usePromotions();
  const { getSocialMediaUrl } = useSocialMedia();
  const [products, setProducts] = useState<ProdutosEcommerceDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Tracking mouse para efeitos parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Buscar produtos
  const { data: authenticatedProducts = { dados: [] }, isLoading: isAuthLoading } = useGetApiProdutoEcommercePaginado({
    empresa: 0,
    pagina: 1,
    limite: 8,
  });

  const { data: promotionalProducts = { dados: [] } } = useGetApiProdutoEcommercePaginado({
    empresa: 0,
    pagina: 1,
    limite: 6,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      const fetchProducts = async () => {
        try {
          const credentials = btoa('lu813em9u3l510a:wf4g5ru813em9u3l510a');
          const response = await fetch(
            'https://pedidoexterno.mcnsistemas.net.br/api/produto/ecommerce/paginado?empresa=0&pagina=1&limite=8',
            {
              headers: { 'Authorization': `Basic ${credentials}` },
              next: { revalidate: 3600 }
            }
          );
          const data = await response.json();
          setProducts(data.dados || []);
        } catch (error) {
          console.error('Erro ao carregar produtos:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isAuthenticated]);

  const displayProducts = authenticatedProducts.dados || products;

  console.log(displayProducts,authenticatedProducts.dados,products );

  // Categorias principais
  const categories = [
    {
      id: 1,
      name: "Embalagens Descartáveis",
      description: "Copos, pratos, talheres e muito mais",
      icon: "📦",
      color: "from-[#f98e00] to-[#e67700]",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop",
      products: "2.500+"
    },
    {
      id: 2,
      name: "Sacolas & Embalagens",
      description: "Sacolas plásticas e de papel",
      icon: "🛍️",
      color: "from-[#0ba360] to-[#098c51]",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=400&fit=crop",
      products: "1.800+"
    },
    {
      id: 3,
      name: "Produtos Alimentícios",
      description: "Para revenda e food service",
      icon: "🍽️",
      color: "from-[#f98e00] to-[#0ba360]",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
      products: "3.200+"
    },
    {
      id: 4,
      name: "Higiene & Limpeza",
      description: "Produtos profissionais",
      icon: "🧹",
      color: "from-[#0ba360] to-[#f98e00]",
      image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop",
      products: "1.500+"
    },
  ];

  const benefits = [
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: "Entrega Rápida",
      description: "Frete grátis acima de R$ 200 para Cuiabá e VG",
      color: "from-[#f98e00] to-[#e67700]"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Compra 100% Segura",
      description: "Proteção em todas as transações",
      color: "from-[#0ba360] to-[#098c51]"
    },
    {
      icon: <CubeIcon className="w-8 h-8" />,
      title: "Estoque Sempre Cheio",
      description: "Mais de 10.000 produtos disponíveis",
      color: "from-[#f98e00] to-[#0ba360]"
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "Qualidade Garantida",
      description: "Produtos selecionados e certificados",
      color: "from-[#0ba360] to-[#f98e00]"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />

      <main className="overflow-hidden">
        {/* Banner Carousel */}
        <BannerCarousel />
 {/* Produtos em Destaque - Layout Assimétrico */}
 <section className="py-24 relative bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0ba360]/10 border-2 border-[#0ba360] mb-4">
                  <BoltIcon className="w-5 h-5 text-[#0ba360]" />
                  <span className="text-sm font-semibold text-[#0ba360]">Mais Vendidos</span>
                      </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900">
                  Produtos em Destaque
                </h2>
                    </div>
                      <Link 
                        href="/produtos"
                className="px-6 py-3 rounded-full border-2 border-[#f98e00] text-[#f98e00] font-semibold hover:bg-[#f98e00] hover:text-white transition-all duration-300 flex items-center gap-2"
                      >
                Ver Todos
                <ArrowRightIcon className="w-5 h-5" />
                      </Link>
                </div>
                
            {/* Grid de produtos */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {(Array.isArray(displayProducts) ? displayProducts.slice(0, 8) : []).map((product : ProdutosEcommerceDto, index) => (
                      <Link 
                  key={product.Produto || index}
                  href={`/produto/${product.Produto}`}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200 hover:border-[#f98e00] hover:shadow-2xl transition-all duration-500 hover:scale-105 p-6"
                >
                  {/* Imagem do produto */}
                  <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-gray-50">
                    {product.Imagens?.[0]?.URL && (
                    <Image
                        src={product.Imagens[0].URL}
                        alt={product.Descricao || 'Produto'}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    )}
                    </div>
                    
                  {/* Informações */}
                  <h3 className="text-gray-900 font-semibold mb-2 line-clamp-2 group-hover:text-[#f98e00] transition-colors">
                    {product.Descricao}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black bg-gradient-to-r from-[#f98e00] to-[#0ba360] bg-clip-text text-transparent">
                        R$ {product.Preco?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRightIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              </Link>
              ))}
            </div>
          </div>
        </section>
        {/* Hero Section - Design Moderno e Compacto */}
        <section className="relative py-20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-[#f98e00]/5">
          {/* Background com gradiente animado */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f98e00]/5 via-transparent to-[#0ba360]/5" />
          
          {/* Elementos decorativos flutuantes */}
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#f98e00]/10 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
          />
          <div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-[#0ba360]/10 to-transparent rounded-full blur-3xl animate-pulse delay-300"
            style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Grid com 2 colunas: Texto à esquerda, Stats à direita */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Coluna Esquerda - Conteúdo Principal */}
                <div className="space-y-6 text-center lg:text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#f98e00] shadow-lg">
                    <SparklesIcon className="w-5 h-5 text-[#f98e00]" />
                    <span className="text-sm font-semibold text-gray-900">O Atacadão das Embalagens</span>
                      </div>
                      
                  {/* Título Principal */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                    <span className="block bg-gradient-to-r from-[#f98e00] via-[#0ba360] to-[#f98e00] bg-clip-text text-transparent">
                      Embalagens
                    </span>
                    <span className="block text-gray-900 mt-2">
                      Para Seu Negócio
                    </span>
                  </h1>

                  {/* Descrição */}
                  <p className="text-lg md:text-xl text-gray-700 max-w-xl leading-relaxed">
                    Mais de <span className="text-[#f98e00] font-bold">10.000 produtos</span> em estoque com{' '}
                    <span className="text-[#0ba360] font-bold">os melhores preços</span> do mercado
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 pt-4">
                      <Link 
                      href="/produtos"
                      className="group relative px-8 py-4 bg-gradient-to-r from-[#f98e00] to-[#e67700] rounded-full text-white font-bold text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#f98e00]/50"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Ver Catálogo Completo
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#ffa726] to-[#f98e00] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      <Link 
                      href="/promocoes"
                      className="px-8 py-4 rounded-full border-2 border-[#0ba360] text-[#0ba360] font-bold text-base hover:bg-[#0ba360] hover:text-white transition-all duration-300"
                      >
                      Ver Promoções
                      </Link>
                    </div>
            </div>

                {/* Coluna Direita - Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "10K+", label: "Produtos em Estoque", icon: "📦" },
                    { value: "200+", label: "Marcas Parceiras", icon: "🏭" },
                    { value: "3", label: "Lojas Físicas", icon: "🏪" },
                    { value: "15+", label: "Anos no Mercado", icon: "⭐" },
                  ].map((stat, index) => (
                    <div 
                      key={index} 
                      className="group p-6 rounded-2xl bg-white shadow-lg border border-gray-200 hover:border-[#f98e00] transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <div className="text-4xl mb-3">{stat.icon}</div>
                      <div className="text-3xl font-black bg-gradient-to-r from-[#f98e00] to-[#0ba360] bg-clip-text text-transparent mb-1">
                        {stat.value}
            </div>
                      <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

              {/* Destaques Rápidos - Abaixo do Hero */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:border-[#f98e00] transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center flex-shrink-0">
                    <TruckIcon className="w-6 h-6 text-white" />
                </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Frete Grátis*</h3>
                    <p className="text-xs text-gray-600">Acima de R$ 200 para Cuiabá e VG</p>
            </div>
          </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:border-[#0ba360] transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0ba360] to-[#098c51] flex items-center justify-center flex-shrink-0">
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
          </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Compra Segura</h3>
                    <p className="text-xs text-gray-600">Proteção em todas as transações</p>
                </div>
              </div>
              
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:border-[#f98e00] transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#f98e00] to-[#0ba360] flex items-center justify-center flex-shrink-0">
                    <CubeIcon className="w-6 h-6 text-white" />
            </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Estoque Garantido</h3>
                    <p className="text-xs text-gray-600">Produtos sempre disponíveis</p>
                      </div>
                    </div>
                          </div>
                          </div>
                          </div>
        </section>
        

        {/* Categorias - Grid Moderno */}
        <section className="py-24 relative bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f98e00]/10 border-2 border-[#f98e00]">
                <TagIcon className="w-5 h-5 text-[#f98e00]" />
                <span className="text-sm font-semibold text-[#f98e00]">Nossas Categorias</span>
                </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900">
                Encontre o Que Você Precisa
                </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Navegue por nossas principais categorias de produtos
              </p>
                        </div>
                        
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                        <Link 
                  key={category.id}
                          href="/produtos"
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-lg border border-gray-200 hover:border-[#f98e00] hover:shadow-2xl transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Imagem de fundo */}
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    </div>
                    
                  {/* Gradiente overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  {/* Conteúdo */}
                  <div className="relative p-8 min-h-[280px] flex flex-col">
                    {/* Ícone */}
                    <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      {category.icon}
                </div>
                
                    {/* Título e descrição */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#f98e00] transition-colors">
                      {category.name}
                        </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      {category.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm font-semibold text-[#0ba360]">
                        {category.products} itens
                      </span>
                      <ArrowRightIcon className="w-5 h-5 text-gray-500 group-hover:text-[#f98e00] group-hover:translate-x-2 transition-all" />
                      </div>
                    </div>
                      </Link>
              ))}
                    </div>
                  </div>
        </section>

       

        {/* Benefícios - Cards Modernos */}
        <section className="py-24 relative bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f98e00]/10 border-2 border-[#f98e00] mb-4">
                <CheckBadgeIcon className="w-5 h-5 text-[#f98e00]" />
                <span className="text-sm font-semibold text-[#f98e00]">Vantagens</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Por Que Escolher a Sorpack?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Somos o atacadão das embalagens com os melhores preços e qualidade garantida
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-white shadow-lg border border-gray-200 hover:border-[#f98e00] hover:shadow-2xl transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Ícone com gradiente */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${benefit.color} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">
                      {benefit.icon}
                  </div>
              </div>
              
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#f98e00] transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>

                  {/* Efeito hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Moderno */}
        <footer className="relative border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Logo e descrição */}
              <div className="md:col-span-2">
                <Image
                  src="/logoSorpack.png"
                  alt="Sorpack"
                  width={180}
                  height={60}
                  className="mb-4"
                  unoptimized
                />
                <p className="text-gray-600 mb-6 max-w-md">
                  O Atacadão das Embalagens. Mais de 10.000 produtos para o seu negócio com os melhores preços do mercado.
                </p>
                <div className="flex gap-3">
                {getSocialMediaUrl("FACEBOOK") && (
                    <a href={getSocialMediaUrl("FACEBOOK")} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#f98e00] flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-300 hover:border-[#f98e00]">
                      <FaFacebook className="w-5 h-5 text-gray-600 hover:text-white transition-colors" />
                    </a>
                )}
                {getSocialMediaUrl("INSTAGRAM") && (
                    <a href={getSocialMediaUrl("INSTAGRAM")} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#f98e00] flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-300 hover:border-[#f98e00]">
                      <FaInstagram className="w-5 h-5 text-gray-600 hover:text-white transition-colors" />
                    </a>
                  )}
                  {getSocialMediaUrl("WHATSAAP") && (
                    <a href={`https://wa.me/${getSocialMediaUrl("WHATSAAP")}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#0ba360] flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-300 hover:border-[#0ba360]">
                      <FaWhatsapp className="w-5 h-5 text-gray-600 hover:text-white transition-colors" />
                    </a>
                  )}
                      </div>
            </div>

              {/* Links rápidos */}
              <div>
                <h3 className="text-gray-900 font-bold mb-4">Links Rápidos</h3>
                <ul className="space-y-2">
                  <li><Link href="/produtos" className="text-gray-600 hover:text-[#f98e00] transition-colors">Produtos</Link></li>
                  <li><Link href="/categorias" className="text-gray-600 hover:text-[#f98e00] transition-colors">Categorias</Link></li>
                  <li><Link href="/promocoes" className="text-gray-600 hover:text-[#f98e00] transition-colors">Promoções</Link></li>
                  <li><Link href="/marcas" className="text-gray-600 hover:text-[#f98e00] transition-colors">Marcas</Link></li>
              </ul>
            </div>

            {/* Contato */}
                  <div>
                <h3 className="text-gray-900 font-bold mb-4">Contato</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>Cuiabá - MT</li>
                  <li>Segunda a Sexta</li>
                  <li>07:30 às 17:45</li>
                  <li className="pt-2">
                    <a href="mailto:sorpack@sorpack.com.br" className="hover:text-[#f98e00] transition-colors">
                      sorpack@sorpack.com.br
                    </a>
                </li>
              </ul>
            </div>
        </div>

        {/* Copyright */}
            <div className="pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Sorpack Embalagens. Todos os direitos reservados.
              </p>
              
          </div>
          
        </div>
        <div className="container mx-auto px-4 py-6 relative">
            {/* MCN Sistemas */}
            <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-400">
              <span className="text-center font-extrabold text-yellow-400">
                Desenvolvido e Hospedado por:
              </span>
              <p>
                <a
                  href="https://www.mcnsistemas.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/adaptive-icon.png"
                    alt="MCN Sistemas"
                    width={120}
                    height={20}
                    className="object-contain"
                    unoptimized
                  />
                </a>
              </p>
            </div>
          </div>

      </footer>
      </main>
    </div>
  );
}
