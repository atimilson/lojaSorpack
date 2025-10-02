import { useGetApiEcommerceUsuarioEndereco, usePostApiEcommerceUsuarioEndereco, useDeleteApiEcommerceUsuarioEndereco, usePutApiEcommerceUsuarioEndereco } from '@/api/generated/mCNSistemas';
import { UsuarioEcommerceEnderecoIncluirDto, UsuarioEcommerceEnderecoDto } from '@/api/generated/mCNSistemas.schemas';
import { useAuth } from '@/contexts/AuthContext';
import { deleteApiEcommerceUsuarioEndereco } from '@/api/generated/mCNSistemas';
import axios from 'axios';
import axiosInstance from '@/api/axios-instance';

export function useEcommerceAddress() {

  const { data:UsuarioEcommerceEnderecoDto = [], isLoading, mutate } = useGetApiEcommerceUsuarioEndereco({
  });


  const addresses = Array.isArray(UsuarioEcommerceEnderecoDto) ? UsuarioEcommerceEnderecoDto : [];


  const { trigger: createAddress } = usePostApiEcommerceUsuarioEndereco();
  const { trigger: updateAddress } = usePutApiEcommerceUsuarioEndereco();

  const addAddress = async (data: UsuarioEcommerceEnderecoIncluirDto) => {
    try {
      // Usar o axiosInstance diretamente ao invés do hook gerado
      await axiosInstance.post('/api/ecommerce/usuario/endereco', data);
      mutate();
    } catch (error) {
      // Se o erro contiver "Cadastrado", é um falso erro (resposta em texto)
      if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === 'string' && 
          error.response.data.includes('Cadastrado')) {
        console.log("Endereço cadastrado com sucesso");
        mutate();
      } else {
        throw error;
      }
    }
  };


  const alterarAddress = async (data: UsuarioEcommerceEnderecoDto) => {
    try {
      await axiosInstance.put('/api/ecommerce/usuario/endereco', data);
      mutate();
    } catch (error) {
      // Se o erro contiver "Alterado", é um falso erro (resposta em texto)
      if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === 'string' && 
          error.response.data.includes('Alterado')) {
        console.log("Endereço alterado com sucesso");
        mutate();
      } else {
        throw error;
      }
    }
  };

  const removeAddress = async (id: number) => {
    try {
      console.log(id);
      // Chamamos diretamente a função da API ao invés de usar o hook
      await deleteApiEcommerceUsuarioEndereco({
        id: id.toString()
      });
      
      mutate();
      return true;
    } catch (err) {
      console.error("Erro ao excluir endereço:", err);
      
      // Se o erro contiver "Exclusão", é um falso erro (resposta em texto)
      if (err instanceof Error && err.message.includes("Exclusão")) {
        console.log("Endereço excluído com sucesso");
        mutate();
        return true;
      }
      
      throw err;
    }
  };

  return {
    addresses,
    isLoading,
    addAddress,
    alterarAddress,
    removeAddress

  };
} 