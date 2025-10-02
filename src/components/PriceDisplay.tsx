"use client";

import { useAuth } from "@/contexts/AuthContext";

interface PriceDisplayProps {
  originalPrice?: number;
  promotionalPrice?: number;
  showDiscount?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}

export function PriceDisplay({
  originalPrice = 0,
  promotionalPrice,
  showDiscount = true,
  size = "medium",
  className = "",
}: PriceDisplayProps) {
  const { showPrices } = useAuth();
  
  // console.log(`PriceDisplay recebeu: originalPrice=${originalPrice}, promotionalPrice=${promotionalPrice}`);
  
  // Validar preços
  const validOriginalPrice = originalPrice && originalPrice > 0 ? originalPrice : 0;
  const validPromotionalPrice = promotionalPrice && promotionalPrice > 0 ? promotionalPrice : undefined;
  
  // console.log(`PriceDisplay validou: validOriginalPrice=${validOriginalPrice}, validPromotionalPrice=${validPromotionalPrice}`);
  
  if (!showPrices) {
    return (
      <div className={`${className} flex flex-col`}>
        <p className="text-gray-600 font-medium">
          Preço sob consulta
        </p>
        <p className="text-xs text-gray-500">
          Entre em contato para verificar o preço
        </p>
      </div>
    );
  }
  
  const hasPromotion = validPromotionalPrice !== undefined && validPromotionalPrice > 0 && validPromotionalPrice < validOriginalPrice;
  const displayPrice = hasPromotion ? validPromotionalPrice : validOriginalPrice;
  
  const textSizes = {
    small: {
      original: "text-xs",
      promotional: "text-base font-bold",
      discount: "text-xs",
    },
    medium: {
      original: "text-sm",
      promotional: "text-xl font-bold",
      discount: "text-xs",
    },
    large: {
      original: "text-base",
      promotional: "text-2xl font-bold",
      discount: "text-sm",
    },
  };
  
  const calcDiscount = () => {
    if (!hasPromotion || validOriginalPrice <= 0) return 0;
    return Math.round(((validOriginalPrice - validPromotionalPrice!) / validOriginalPrice) * 100);
  };
  
  const discountPercentage = calcDiscount();
  
  return (
    <div className={`${className} space-y-1`}>
      {hasPromotion && (
        <div className="flex items-center gap-2">
          <p className={`${textSizes[size].original} text-gray-500 line-through`}>
            De: R$ {validOriginalPrice.toFixed(2)}
          </p>
          {showDiscount && discountPercentage > 0 && (
            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">
              -{discountPercentage}%
            </span>
          )}
        </div>
      )}
      
      <p className={`${hasPromotion ? 'text-red-600' : 'text-primary'} ${textSizes[size].promotional}`}>
        {hasPromotion ? 'Por: ' : ''}R$ {displayPrice.toFixed(2)}
      </p>
      
      {/* Você pode adicionar mais informações como parcelamento se necessário */}
    </div>
  );
} 