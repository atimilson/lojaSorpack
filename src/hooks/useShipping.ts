import { useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import { CartItem } from '@/types/cart';

interface ShippingProps {
  sCepDestino: string;
  nVlPeso: string;
  nVlComprimento?: string;
  nVlAltura?: string;
  nVlLargura?: string;
}

interface SSWShippingResult {
  prazo: string;
  valor: string;
  servico: string;
}

export function useShipping() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const calculateSSWShipping = async (cepDestino: string, peso: string, volume: string, altura: string, largura: string, comprimento: string, quantidade: string, total: number): Promise<SSWShippingResult[]> => {
    try {
      const response = await fetch('/api/shipping/ssw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cepDestino, peso, volume, altura, largura, comprimento, quantidade, total })

      });

      const { data } = await response.json();
      const parser = new XMLParser();
      const result = parser.parse(data);
      
      // Extrair o XML interno da resposta SOAP
      const xmlCotacao = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:cotarResponse'].return;
      // Fazer parse do XML interno
      const cotacaoResult = parser.parse(xmlCotacao);
      
      console.log('cotacaoResult ',cotacaoResult);
      console.log('cotacaoResult.cotacao ',cotacaoResult.cotacao);
      if (cotacaoResult.cotacao) {
        const { prazo : prazo, totalFrete, erro, mensagem } = cotacaoResult.cotacao;
        
        if (erro === 0) {
          return [{
            prazo: prazo.toString(),
            valor: totalFrete.toString(),
            servico: 'SSW'
          }];
        } else {
          console.error('Erro SSW:', mensagem);
          return [];
        }
      }

      return [];
    } catch (err) {
      console.error('Erro SSW:', err);
      return [];
    }
  };

  const calculateTotalWeight = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      return total + (Number(item.Peso || 0) * (item.quantity || 0));
    }, 0);
  };

  const calculateTotalVolume = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      return total + ((Number(item.Volume) || 0) * (item.quantity || 0));
    }, 0);
  };

  const calculateMaxDimensions = (items: CartItem[]) => {
    let maxHeight = 0;
    let maxWidth = 0;
    let maxLength = 0;
    let maxQuantity = 0;

    items.forEach(item => {
      console.log('item ',item);
      maxQuantity += Number(item.quantity || item.Quantidade || 0);
      maxHeight = Math.max(maxHeight, Number(item.Comprimento || 0));
      maxWidth = Math.max(maxWidth, Number(item.Espessura || 0));
      maxLength = Math.max(maxLength, Number(item.Largura || 0));
    });

    maxHeight === 0 ? maxHeight = 0.01 : maxHeight;
    maxWidth === 0 ? maxWidth = 0.01 : maxWidth;
    maxLength === 0 ? maxLength = 0.01 : maxLength;



    return { altura: maxHeight, largura: maxWidth, comprimento: maxLength, quantidade: maxQuantity };

  };

  const calculateShipping = async ({
    sCepDestino,
    items,
    total,
  }: {


    sCepDestino: string;
    items: CartItem[];
    total: number;
  }) => {
    setIsLoading(true);
    setError(null);



    try {
      let totalWeight = calculateTotalWeight(items);
      let totalVolume = calculateTotalVolume(items);
      const { altura, largura, comprimento, quantidade } = calculateMaxDimensions(items);
      totalWeight === 0 ? totalWeight = 0.01 : totalWeight;
      totalVolume === 0 ? totalVolume = 0.01 : totalVolume;
      console.log('totalWeight ',totalWeight);
      console.log('totalVolume ',totalVolume);
      console.log('altura ',altura);
      console.log('largura ',largura);
      console.log('comprimento ',comprimento);
      console.log('quantidade ',quantidade);


      const sswResult = await calculateSSWShipping(
        sCepDestino, 
        totalWeight.toString(),
        totalVolume.toString(),
        altura.toString(),
        largura.toString(),
        comprimento.toString(),
        quantidade.toString(),
        total

      );

      return [
        ...sswResult.map(ssw => ({
          Codigo: 'Carvalima',
          Valor: ssw.valor,
          PrazoEntrega: ssw.prazo,
          Servico: ssw.servico
        }))
      ];

    } catch (err) {
      setError('Erro ao calcular frete');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    calculateShipping,
    isLoading,
    error
  };
} 