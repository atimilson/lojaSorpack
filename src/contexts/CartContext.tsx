"use client"
import { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  Produto: number;
  Descricao: string;
  Quantidade: number;
  Preco: number;
  PrecoPromocional: number;
  Cor: string;
  Largua: number;
  Espessura: number;
  TotalM3: number;
  Comprimento: number;
  Peso: number;
  Volume: string;
  Imagens: { URL: string }[];
}


interface CartContextData {
  items: CartItem[];
  addItem: (product: any, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemsCount: number;
  selectedShipping: { valor: string; servico: string; prazo: string, codigo: string } | null;
  setSelectedShipping: (shipping: { valor: string; servico: string; prazo: string, codigo: string } | null) => void;
}


const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<{ valor: string; servico: string; prazo: string, codigo: string } | null>(null);

  // Carregar carrinho do localStorage quando inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Para produtos com preço zero, buscar os preços do localStorage real
        const fixedCart = parsedCart.map((item: CartItem) => {
          // Se o preço for zero ou nulo, tentar usar o outro preço disponível
          if (!item.Preco || item.Preco <= 0) {
            console.log(`Corrigindo item ${item.Descricao} com preço zero`);
            // Se o preço promocional for válido, usá-lo também como preço principal
            if (item.PrecoPromocional && item.PrecoPromocional > 0) {
              item.Preco = item.PrecoPromocional;
            }
          }
          return item;
        });
        setItems(fixedCart);
      } catch (e) {
        console.error('Erro ao processar carrinho salvo:', e);
        setItems([]);
      }
    }
  }, []);

  // Salvar carrinho no localStorage quando atualizar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: any, quantity: number) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.Produto === product.Produto);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.Produto === product.Produto
            ? { ...item, Quantidade: item.Quantidade + quantity }
            : item
        );
      }

      return [...currentItems, {
        Produto: product.Produto,
        Descricao: product.Descricao,
        Quantidade: quantity,
        Preco: typeof product.Preco === 'number' ? product.Preco : 0,
        PrecoPromocional: typeof product.PrecoPromocional === 'number' ? product.PrecoPromocional : 0,
        Cor: product.Cor,
        Largua: product.Largua,
        Espessura: product.Espessura,
        TotalM3: product.TotalM3,
        Comprimento: product.Comprimento,
        Peso: product.Peso,
        Volume: product.Volume,
        Imagens: product.Imagens
      }];
    });
  };

  const removeItem = (productId: number) => {
    setItems(currentItems => currentItems.filter(item => item.Produto !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.Produto === productId
          ? { ...item, Quantidade: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => {
    const price = item.PrecoPromocional > 0 ? item.PrecoPromocional : (item.Preco > 0 ? item.Preco : 0);
    // console.log(`Calculando total para ${item.Descricao}: Preco=${item.Preco}, PrecoPromocional=${item.PrecoPromocional}, PrecoFinal=${price}, Qtd=${item.Quantidade}, Subtotal=${price * item.Quantidade}`);
    return sum + (price * item.Quantidade);
  }, 0);

  const itemsCount = items.reduce((sum, item) => sum + item.Quantidade, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemsCount,
      selectedShipping,
      setSelectedShipping
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 