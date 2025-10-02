'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
  UserIcon, 
  MapPinIcon, 
  ShoppingBagIcon, 
  HeartIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
  PencilSquareIcon,
  KeyIcon,
  BellIcon,
  CreditCardIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  CheckBadgeIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useEcommerceUser } from '@/hooks/useEcommerceUser';
import { useEcommerceAddress } from '@/hooks/useEcommerceAddress';
import Loading from '@/components/Loading';
import { UsuarioEcommerceEnderecoDto, UsuarioEcommerceEnderecoIncluirDto } from '@/api/generated/mCNSistemas.schemas';
import { AddressModal } from '@/components/AddressModal';
import { useGetApiEcommerceUsuarioEndereco } from '@/api/generated/mCNSistemas';
import { BiEditAlt } from 'react-icons/bi';
import { Header } from '@/components/Header';
import axiosInstance from '@/api/axios-instance';
import { Switch } from "@/components/ui/switch";

// Schema de validação
const userFormSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  dataNascimento: z.string(),
  genero: z.enum(['M', 'F', 'O']),
  receberNoticias: z.boolean()
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function UserAccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<UsuarioEcommerceEnderecoDto | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { logout, usuario, showPrices, setShowPrices } = useAuth();
  const router = useRouter();
  const { user, isLoading: userLoading, saveUser } = useEcommerceUser();
  const { addresses, isLoading: addressLoading, addAddress, removeAddress, alterarAddress } = useEcommerceAddress();
  const { mutate: getAddresses } = useGetApiEcommerceUsuarioEndereco();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema)
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      await saveUser({
        Nome: data.nome,
        Email: data.email,
        CPFouCNPJ: data.cpf,
        Fone: data.telefone,
        DataNascimento: data.dataNascimento
      });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      console.error(error);
    }
  };

  const handleAddressSubmit = async (data: UsuarioEcommerceEnderecoIncluirDto) => {
    try {
      if (selectedAddress) {
        // Editar endereço existente - converter para UsuarioEcommerceEnderecoDto
        await alterarAddress({
          ...data,
          Id: selectedAddress.Id
        } as UsuarioEcommerceEnderecoDto);
        toast.success('Endereço atualizado com sucesso!');
      } else {
        // Adicionar novo endereço
        await addAddress(data);
        toast.success('Endereço adicionado com sucesso!');
      }
      
      setShowAddAddress(false);
      setSelectedAddress(null);
      getAddresses();
    } catch (error) {
      toast.error('Erro ao salvar endereço');
      console.error(error);
    }
  };

  const handleEditAddress = (address: UsuarioEcommerceEnderecoDto) => {
    setSelectedAddress(address);    
    setShowAddAddress(true);
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await removeAddress(addressId);
        toast.success('Endereço removido com sucesso!');
        getAddresses();
      } catch (error) {
        toast.error('Erro ao remover endereço');
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const verificarAdmin = async () => {
      if (user?.Email) {
        try {
          const response = await axiosInstance.get(`/api/ecommerce/administrador?empresa=1&email=${user.Email}`);
          // Se a requisição retornar com sucesso (status 200), define o usuário como administrador
          if (response) {
            setIsAdmin(true);
          }
        } catch (error) {
          // Se ocorrer um erro na requisição, não é administrador
          console.log("Não é administrador");
          setIsAdmin(false);
        }
      }
    };

    verificarAdmin();
  }, [user?.Email]);

  if (userLoading || addressLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      
      {/* Hero Section com Gradiente */}
      <div className="bg-gradient-to-r from-[#f98e00] to-[#e67700] text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Minha Conta</h1>
          <nav className="text-sm text-white/80">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li>/</li>
              <li className="font-medium">Minha Conta</li>
            </ol>
          </nav>
        </div>
      </div>
      
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Perfil do Usuário */}
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{user?.Nome || usuario}</h2>
                        <p className="text-sm text-gray-600">{user?.Email || ''}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-primary">
                      <CheckBadgeIcon className="w-4 h-4 mr-1" />
                      Cliente desde {new Date().getFullYear()}
                    </div>
                  </div>
                  
                  {/* Menu de Navegação */}
                  <nav className="p-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === 'profile' 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>Meu Perfil</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === 'addresses' 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MapPinIcon className="w-5 h-5" />
                      <span>Meus Endereços</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === 'orders' 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <ShoppingBagIcon className="w-5 h-5" />
                      <span>Meus Pedidos</span>
                    </button>
                    
                    {/* <button
                      onClick={() => setActiveTab('favorites')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === 'favorites' 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <HeartIcon className="w-5 h-5" />
                      <span>Favoritos</span>
                    </button> */}
                    
                    {isAdmin && (
                      <Link 
                        href="/admin/dashboard" 
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100 mt-2"
                      >
                        <ShieldCheckIcon className="w-5 h-5 text-primary" />
                        <span>Painel Administrador</span>
                      </Link>
                    )}
                    
                    <hr className="my-2 border-gray-200" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Sair</span>
                    </button>
                  </nav>
                </div>
                
                {/* Suporte */}
                <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Precisa de ajuda?</h3>
                  <Link 
                    href="/fale-conosco" 
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <CogIcon className="w-5 h-5" />
                    <span>Central de Suporte</span>
                  </Link>
                </div>
              </div>
              
              {/* Conteúdo Principal */}
              <div className="md:col-span-3">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  {activeTab === 'profile' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Meu Perfil</h2>
                        {/* <button className="text-primary hover:text-primary-dark">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button> */}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Informações Pessoais */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-primary" />
                            Informações Pessoais
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Nome Completo</p>
                              <p className="font-medium text-gray-900">{user?.Nome || 'Não informado'}</p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">E-mail</p>
                              <p className="font-medium text-gray-900">{user?.Email || 'Não informado'}</p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">CPF</p>
                              <p className="font-medium text-gray-900">{user?.CPFouCNPJ || 'Não informado'}</p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Telefone</p>
                              <p className="font-medium text-gray-900">{user?.Fone || 'Não informado'}</p>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            {/* <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
                              <PencilSquareIcon className="w-4 h-4" />
                              Editar Informações
                            </button> */}
                          </div>
                        </div>
                        
                        {/* Segurança e Preferências */}
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <KeyIcon className="w-5 h-5 text-primary" />
                            Segurança e Preferências
                          </h3>
                          
                          <div className="space-y-4">
                            {/* Preferência de visualização de preços */}
                            {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-medium text-gray-900">Visualização de preços</h4>
                                <p className="text-sm text-gray-600">
                                  {showPrices 
                                    ? "Preços dos produtos são visíveis" 
                                    : "Preços substituídos por 'Preço sob consulta'"}
                                </p>
                              </div>
                              <Switch
                                checked={showPrices}
                                onChange={setShowPrices}
                                className={`${
                                  showPrices ? 'bg-primary' : 'bg-gray-300'
                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                              >
                                <span
                                  className={`${
                                    showPrices ? 'translate-x-6' : 'translate-x-1'
                                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                              </Switch>
                            </div> */}
                            
                            {/* Link para alteração de senha */}
                            <Link 
                              href="/minha-conta/usuario/alterar-senha" 
                              className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors block"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <KeyIcon className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <h4 className="font-medium text-gray-900">Alterar Senha</h4>
                                    <p className="text-sm text-gray-600">Atualize sua senha de acesso</p>
                                  </div>
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                              </div>
                            </Link>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'addresses' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Meus Endereços</h2>
                        {addresses?.length === 0 && (
                          <button 
                            onClick={() => {
                              setSelectedAddress(null);
                              setShowAddAddress(true);
                            }}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                          >
                            <PlusCircleIcon className="w-4 h-4" />
                            Adicionar Endereço
                          </button>
                        )}
                      </div>
                      
                      {addresses?.length === 0 ? (
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPinIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum endereço cadastrado</h3>
                          <p className="text-gray-600 mb-6">Adicione um endereço para facilitar suas compras</p>
                          <button 
                            onClick={() => {
                              setSelectedAddress(null);
                              setShowAddAddress(true);
                            }}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                          >
                            Adicionar Endereço
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {addresses?.map((address: UsuarioEcommerceEnderecoDto) => (
                            <div key={address.Id} className="p-5 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                  <div className="mt-1">
                                    <MapPinIcon className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-900">{address.Nome}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {address.Endereco}, {address.Numero}
                                      {address.Complemento && ` - ${address.Complemento}`}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {address.Bairro} - {address.Cidade}/{address.UF}
                                    </p>
                                    <p className="text-sm text-gray-600">CEP: {address.CEP}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditAddress(address)}
                                    className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                                    title="Editar"
                                  >
                                    <PencilSquareIcon className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAddress(address.Id!)}
                                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                    title="Excluir"
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Meus Pedidos</h2>
                        <Link 
                          href="/minha-conta/pedidos" 
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                        >
                          <ShoppingBagIcon className="w-4 h-4" />
                          Ver todos os pedidos
                        </Link>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShoppingBagIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Acompanhe seus pedidos</h3>
                        <p className="text-gray-600 mb-6">Veja o status, rastreie entregas e acesse notas fiscais</p>
                        <Link 
                          href="/minha-conta/pedidos" 
                          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-block"
                        >
                          Ver meus pedidos
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeTab === 'favorites' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Produtos Favoritos</h2>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <HeartIcon className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Sua lista de favoritos está vazia</h3>
                        <p className="text-gray-600 mb-6">Adicione produtos à sua lista de favoritos para acompanhar preços e promoções</p>
                        <Link 
                          href="/produtos" 
                          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-block"
                        >
                          Explorar produtos
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={showAddAddress}
        onClose={() => {
          setShowAddAddress(false);
          setSelectedAddress(null);
        }}
        onSubmit={handleAddressSubmit}
        address={selectedAddress}
      />
    </>
  );
} 