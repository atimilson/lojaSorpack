import { useGetApiEcommerceUsuario, usePostApiEcommerceUsuario } from '@/api/generated/mCNSistemas';
import { UsuarioEcommerceDto } from '@/api/generated/mCNSistemas.schemas';
import { useAuth } from '@/contexts/AuthContext';

export function useEcommerceUser() {
  const { usuario } = useAuth();


  const { data: userData, isLoading } = useGetApiEcommerceUsuario();

  const { trigger: createUser } = usePostApiEcommerceUsuario();

  const saveUser = async (data: UsuarioEcommerceDto) => {
    return createUser({  });
  };

  return {
    user: userData,
    isLoading,
    saveUser
  };
} 