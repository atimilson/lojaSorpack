'use client'

import { useEffect, useState } from 'react';
import { useShipping } from '@/hooks/useShipping';
import InputMask from 'react-input-mask';
import { TruckIcon } from '@heroicons/react/24/outline';
import { CartItem } from '@/types/cart';

interface ShippingCalculatorProps {
  items: CartItem[];
  total: number;
  onSelectShipping: (shipping: { valor: string; servico: string; prazo: string; codigo: string } | null) => void;
  selectedShipping?: { valor: string; servico: string; prazo: string; codigo: string } | null;
}


export function ShippingCalculator({ items, total, onSelectShipping, selectedShipping }: ShippingCalculatorProps) {
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const { calculateShipping, isLoading, error } = useShipping();

  useEffect(() => {
    if (selectedShipping) {
      handleCalculate();
    }
  }, [items]);

  useEffect(() => {
    if(cep.length === 0) {
       onSelectShipping(null);
    }
  }, [cep]);

  const handleCalculate = async () => {
    if (cep.length < 8) return;


    const options = await calculateShipping({
      sCepDestino: cep.replace(/\D/g, ''),
      items,
      total
    });

    setShippingOptions(options);
    if(selectedShipping) {
      options.map((item, index) => {
        if(item.Servico === selectedShipping.servico) {
          onSelectShipping({
            codigo: item.Codigo,
            valor: item.Valor,
            servico: item.Servico,
            prazo: item.PrazoEntrega
          });

        }

    });
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <TruckIcon className="w-6 h-6 text-primary" />
        <div>
          <h2 className="font-medium text-gray-900">Calcular Frete</h2>
          {!selectedShipping && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="animate-pulse">●</span>
              Selecione aqui o frete para continuar
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <InputMask
          mask="99999-999"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Digite seu CEP"
        />
        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Calculando...
            </>
          ) : (
            <>
              <TruckIcon className="w-4 h-4" />
              Calcular
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {shippingOptions.map((option, index) => (
        <div 
          key={index} 
          className={`p-4 border rounded-lg cursor-pointer transition-colors hover:border-primary ${
            selectedShipping?.servico === option.Servico 
              ? 'border-primary bg-primary/5 ring-2 ring-primary' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectShipping({
            codigo: option.Codigo,
            valor: option.Valor,
            servico: option.Servico,
            prazo: option.PrazoEntrega
          })}

        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedShipping?.servico === option.Servico 
                  ? 'border-primary' 
                  : 'border-gray-300'
              }`}>
                {selectedShipping?.servico === option.Servico && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {option.Servico === 'Correios' 
                    ? (option.Codigo === '04510' ? 'PAC' : 'SEDEX')
                    : option.Codigo}
                </p>
                <p className="text-sm text-gray-600">
                  Prazo: {option.PrazoEntrega} dias úteis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-bold text-primary">
                R$ {option.Valor}
              </p>
              {!selectedShipping && (
                <div className="flex items-center gap-1 text-sm text-red-500 animate-pulse font-bold">
                  <TruckIcon className="w-6 h-6" />
                  <span>Clique para selecionar</span>
                </div>
              )}


            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 