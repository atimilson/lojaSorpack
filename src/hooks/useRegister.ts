'use client'

import { useState } from 'react';
import type { UsuarioEcommerceDto } from '@/api/generated/mCNSistemas.schemas';
import { toast } from 'react-hot-toast';

export const useRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const register = async (data: UsuarioEcommerceDto) => {
    // Evita múltiplas requisições simultâneas
    if (isSubmitting || isLoading) {
      console.log('Cadastro já em andamento. Aguarde.');
      return false;
    }

    try {
      setIsSubmitting(true);
      setIsLoading(true);
      setError(null);
      
      // Usar fetch diretamente ao invés do SWR
      const token = localStorage.getItem('token');
      const response = await fetch('https://pedidoexterno.mcnsistemas.net.br/api/ecommerce/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(data)
      });
      
      // Verificar o status HTTP
      if (response.status >= 200 && response.status < 300) {
        // Sucesso - status 2xx
        toast.success("Cadastro realizado com sucesso!");
        return true;
      } else {
        // Tenta ler a resposta como texto
        const responseText = await response.text();
        
        // Se a mensagem contém "sucesso", consideramos que deu certo apesar do status
        if (responseText.toLowerCase().includes("sucesso")) {
          toast.success("Cadastro realizado com sucesso!");
          return true;
        }
        
        // Caso contrário, é um erro real
        throw new Error(responseText || `Erro ${response.status}: ${response.statusText}`);
      }
      
    } catch (err) {
      console.error("Erro no cadastro:", err);
      
      // Se o erro contiver "sucesso", consideramos que deu certo apesar do erro
      if (err instanceof Error && err.message.toLowerCase().includes("sucesso")) {
        toast.success("Cadastro realizado com sucesso!");
        return true;
      }
      
      // Erro real
      const mensagemErro = err instanceof Error ? err.message : 'Erro ao realizar cadastro. Tente novamente.';

      setError(mensagemErro);
      toast.error(JSON.parse(mensagemErro).error);
      return false;
      
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return { register, isLoading: isLoading || isSubmitting, error };
}; 