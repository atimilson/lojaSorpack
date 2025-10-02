'use client'

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { ArrowRightIcon, ShoppingCartIcon, TagIcon } from '@heroicons/react/24/outline';
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { ProdutosEcommerceDto, ProdutosEmPromocaoEcommerceDto } from "@/api/generated/mCNSistemas.schemas";
import { PriceDisplay } from './PriceDisplay';

interface ProductCarouselProps {
  title: string;
  products: (ProdutosEcommerceDto | ProdutosEmPromocaoEcommerceDto)[];
  viewAllLink: string;
  isPromotion?: boolean;
}

export function ProductCarousel({ title, products, viewAllLink, isPromotion }: ProductCarouselProps) {
  const { addItem } = useCart();

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProdutosEcommerceDto
  ) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 relative w-12 h-12">
          <Image
            src={product.Imagens?.[0]?.URL || '/placeholder.jpg'}

            alt={product.Descricao || ''}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <p className="font-medium">Produto adicionado ao carrinho!</p>
          <p className="text-sm text-gray-500 line-clamp-1">{product.Descricao}</p>
          <p className="text-sm text-gray-500">Quantidade: {1}</p>
        </div>
      </div>
    );
  };

  const isEcommerceProduct = (product: ProdutosEcommerceDto | ProdutosEmPromocaoEcommerceDto): product is ProdutosEcommerceDto => {
    return 'Preco' in product;
  };

  const getOriginalPrice = (product: ProdutosEcommerceDto | ProdutosEmPromocaoEcommerceDto) => {
    return isEcommerceProduct(product) ? product.Preco : product.PrecoNormal;
  };

  const calculateDiscount = (product: ProdutosEcommerceDto | ProdutosEmPromocaoEcommerceDto) => {
    const originalPrice = getOriginalPrice(product);
    if (!originalPrice || !product.PrecoPromocional || originalPrice <= product.PrecoPromocional) return 0;
    return Math.round(((originalPrice - product.PrecoPromocional) / originalPrice) * 100);
  };


  return (
    <section className={`py-8 ${isPromotion ? 'bg-red-50/30 backdrop-blur-sm glass-section' : 'glass-section-neutral'}`}>
      <div className="container mx-auto px-4">
        {title !== "" && (
          <div className="flex items-center gap-3 mb-6">
            {isPromotion && <TagIcon className="w-8 h-8 text-red-500" />}
            <h2 className={`text-2xl font-bold ${isPromotion ? 'text-red-600' : ''}`}>{title}</h2>
            <Link
              href={viewAllLink}
              className={`inline-flex items-center gap-1 px-3 py-1 text-md font-medium 
                ${isPromotion 
                  ? 'text-red-600 hover:text-white bg-transparent hover:bg-red-600 border border-red-600' 
                  : 'text-primary hover:text-white bg-transparent hover:bg-primary border border-primary'} 
                rounded-full transition-all duration-200 group`}
            >
              Ver todos
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.Produto}
              className={`bg-white/90 backdrop-blur-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4 relative group glass-card
                ${  (product.PrecoPromocional ?? 0) > 0 ? 'border-2 border-red-200/60 glass-card-promo' : 'border border-gray-200/30'}`}
            >
              {/* Badge de desconto */}
              {
                  (product.PrecoPromocional ?? 0) > 0 &&  (
                <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-lg text-white px-2 py-1 rounded-full text-sm font-bold z-10 glass-badge shadow-lg">
                  -{calculateDiscount(product)}%
                </div>
              )}

              <Link href={`/produto/${product.Produto}`}>
                <div className="relative h-48 mb-4 group-hover:scale-105 transition-transform duration-300 rounded-lg overflow-hidden">
                  {/* Fundo com degradê radial suave */}
                  <div className="absolute inset-0 bg-gradient-radial from-white via-gray-50/30 to-gray-100/50"></div>
                  
                  {/* Imagem do produto com máscara de degradê */}
                  <div className="relative w-full h-full p-3">
                    <div className="relative w-full h-full">
                      <Image
                        src={product?.Imagens?.[0]?.URL || '/placeholder-product.jpg'}
                        alt={product.Descricao || ''}
                        fill
                        unoptimized={true}
                        className="object-contain"
                        style={{
                          maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
                          WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">{product.Marca}</p>
                  <h3 className="font-medium text-gray-50 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.Descricao}
                  </h3>

                  <PriceDisplay
                    originalPrice={getOriginalPrice(product) || 0}
                    promotionalPrice={product.PrecoPromocional}
                    size="medium"
                  />
                </div>
              </Link>

              {/* Botão Adicionar ao Carrinho */}
              <button
                onClick={(e) => handleAddToCart(e, product as ProdutosEcommerceDto)}
                className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-lg glass-button-solid
                  ${  (product.PrecoPromocional ?? 0) > 0 
                    ? 'bg-red-600/90 hover:bg-red-700/95 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-primary/90 hover:bg-primary-dark/95 text-white shadow-lg hover:shadow-xl'}`}
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}