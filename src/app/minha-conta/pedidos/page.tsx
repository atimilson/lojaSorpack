'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
  UserIcon, 
  MapPinIcon, 
  ShoppingBagIcon, 
  DocumentTextIcon,
  TruckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import { format } from 'date-fns';
import { Header } from '@/components/Header';

interface PedidoItem {
  Item: number;
  Produto: number;
  Descricao: string;
  Quantidade: number;
  Unidade: string;
  ValorUnitario: number;
  IdListaCasamento: number;
}

interface PedidoPagamento {
  QtdeParcela: number;
  Valor: number;
  CodCartao: number;
  BandeiraCartao: string;
  NrAutorizacao: string;
  NSU: string;
  TXID: string;
  endToEndID: string;
}

interface Pedido {
  Pedido: number;
  Contrato: number;
  Empresa: number;
  Ativo: boolean;
  Baixado: boolean;
  DataEmissao: string;
  DataAprovacao: string;
  DataAlteracao: string;
  ValorProdutos: number;
  ValorDesconto: number;
  ValorFrete: number;
  OutrasDespesas: number;
  ValorPedido: number;
  ClienteNome: string;
  CPF: string;
  CNPJ: string;
  IE: string;
  EnderecoNome: string;
  Endereco: string;
  EnderecoNumero: string;
  Complemento: string;
  Bairro: string;
  CEP: string;
  Cidade: string;
  UF: string;
  Fone: string;
  DataPrevEntrega: string;
  TipoFrete: number;
  CodTransportador: number;
  NomeTransportador: string;
  Itens: PedidoItem[];
  Pagamento: PedidoPagamento[];
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPedido, setExpandedPedido] = useState<number | null>(null);
  const { usuario } = useAuth();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setIsLoading(true);
        
        // Obter data atual e data de 6 meses atrás
        const dataFim = new Date();
        const dataInicio = new Date();
        dataInicio.setMonth(dataInicio.getMonth() - 6);
        
        // Formatar datas para YYYY-MM-DD
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        const token = localStorage.getItem('token');
        const email = usuario || '';
        
        const response = await fetch(
          `https://pedidoexterno.mcnsistemas.net.br/api/pedidoecommerce/listar?empresa=0&usuario=${encodeURIComponent(email)}&data_inicio=${formatDate(dataInicio)}&data_fim=${formatDate(dataFim)}`,
          {
            headers: {
              'accept': 'application/json',
              'Authorization': `${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Erro ao buscar pedidos');
        }
        
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (usuario) {
      fetchPedidos();
    }
  }, [usuario]);
  
  const togglePedido = (pedidoId: number) => {
    if (expandedPedido === pedidoId) {
      setExpandedPedido(null);
    } else {
      setExpandedPedido(pedidoId);
    }
  };
  
  const formatarData = (dataString: string) => {
    if (!dataString) return '';
    
    try {
      const data = new Date(dataString);
      return format(data, 'dd/MM/yyyy');
    } catch (error) {
      return dataString;
    }
  };
  
  const getStatusPedido = (pedido: Pedido) => {
    if (pedido.Baixado) {
      return { label: 'Entregue', color: 'bg-green-100 text-green-700' };
    } else if (pedido.DataAprovacao) {
      return { label: 'Em Transporte', color: 'bg-blue-100 text-blue-700' };
    } else {
      return { label: 'Processando', color: 'bg-yellow-100 text-yellow-700' };
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <Header />
      
      {/* Hero Section com Gradiente */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Meus Pedidos</h1>
          <nav className="text-sm text-white/80">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li>/</li>
              <li><Link href="/minha-conta/usuario" className="hover:text-white">Minha Conta</Link></li>
              <li>/</li>
              <li className="font-medium">Pedidos</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Filtros e Estatísticas */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Histórico de Pedidos
              </h2>
              
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Últimos 6 meses
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <ArrowPathIcon className="w-4 h-4" />
                  Atualizar
                </button>
              </div>
            </div>
            
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Total de Pedidos</p>
                    <p className="text-xl font-bold text-blue-800">{pedidos.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Entregues</p>
                    <p className="text-xl font-bold text-green-800">
                      {pedidos.filter(p => p.Baixado).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <TruckIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-700">Em Transporte</p>
                    <p className="text-xl font-bold text-yellow-800">
                      {pedidos.filter(p => p.DataAprovacao && !p.Baixado).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700">Valor Total</p>
                    <p className="text-xl font-bold text-purple-800">
                      R$ {pedidos.reduce((total, p) => total + p.ValorPedido, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {pedidos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhum pedido encontrado</h2>
              <p className="text-gray-600 mb-6">
                Você ainda não realizou nenhum pedido nos últimos 6 meses.
              </p>
              <Link 
                href="/produtos" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Explorar produtos
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {pedidos.map((pedido) => {
                const status = getStatusPedido(pedido);
                const isExpanded = expandedPedido === pedido.Pedido;
                
                return (
                  <div key={pedido.Pedido} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300">
                    <div 
                      className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => togglePedido(pedido.Pedido)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-lg font-bold text-gray-900">Pedido #{pedido.Pedido}</h2>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{formatarData(pedido.DataEmissao)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCardIcon className="w-4 h-4" />
                              <span>R$ {pedido.ValorPedido.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DocumentTextIcon className="w-4 h-4" />
                              <span>{pedido.Itens?.length || 0} {pedido.Itens?.length === 1 ? 'item' : 'itens'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDownIcon className="w-6 h-6 text-primary" />
                          ) : (
                            <ChevronRightIcon className="w-6 h-6 text-primary" />
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-6">
                        {/* Timeline do Pedido - Horizontal em desktop */}
                        <div className="hidden md:block mb-8">
                          <div className="relative">
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
                            <div className="flex justify-between relative">
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full ${pedido.DataEmissao ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center z-10`}>
                                  <DocumentTextIcon className="w-5 h-5 text-white" />
                                </div>
                                <p className="mt-2 text-sm font-medium">Confirmado</p>
                                <p className="text-xs text-gray-500">{formatarData(pedido.DataEmissao)}</p>
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full ${pedido.DataAprovacao ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center z-10`}>
                                  <ClockIcon className="w-5 h-5 text-white" />
                                </div>
                                <p className="mt-2 text-sm font-medium">Aprovado</p>
                                <p className="text-xs text-gray-500">{pedido.DataAprovacao ? formatarData(pedido.DataAprovacao) : '-'}</p>
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full ${pedido.DataAprovacao ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center z-10`}>
                                  <TruckIcon className="w-5 h-5 text-white" />
                                </div>
                                <p className="mt-2 text-sm font-medium">Em Transporte</p>
                                <p className="text-xs text-gray-500">{pedido.DataAprovacao ? formatarData(pedido.DataAprovacao) : '-'}</p>
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full ${pedido.Baixado ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center z-10`}>
                                  <CheckCircleIcon className="w-5 h-5 text-white" />
                                </div>
                                <p className="mt-2 text-sm font-medium">Entregue</p>
                                <p className="text-xs text-gray-500">{pedido.Baixado ? formatarData(pedido.DataAlteracao) : '-'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Timeline do Pedido - Vertical em mobile */}
                        <div className="md:hidden relative mb-8">
                          <div className="absolute left-4 top-0 h-full w-px bg-gray-200"></div>
                          
                          <div className="space-y-6">
                            {pedido.Baixado && (
                              <div className="relative flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center z-10">
                                  <CheckCircleIcon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900">Entregue</h3>
                                  <p className="text-sm text-gray-600">Pedido entregue com sucesso</p>
                                  <p className="text-xs text-gray-500 mt-1">{formatarData(pedido.DataAlteracao)}</p>
                                </div>
                              </div>
                            )}

                            {pedido.DataAprovacao && (
                              <div className="relative flex gap-4">
                                <div className={`w-8 h-8 rounded-full ${pedido.Baixado ? 'bg-green-500' : 'bg-primary'} flex items-center justify-center z-10`}>
                                  <TruckIcon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900">Em Transporte</h3>
                                  <p className="text-sm text-gray-600">Pedido saiu para entrega</p>
                                  <p className="text-xs text-gray-500 mt-1">{formatarData(pedido.DataAprovacao)}</p>
                                </div>
                              </div>
                            )}

                            <div className="relative flex gap-4">
                              <div className={`w-8 h-8 rounded-full ${pedido.DataAprovacao ? 'bg-green-500' : 'bg-primary'} flex items-center justify-center z-10`}>
                                <DocumentTextIcon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">Pedido Confirmado</h3>
                                <p className="text-sm text-gray-600">Pagamento aprovado</p>
                                <p className="text-xs text-gray-500 mt-1">{formatarData(pedido.DataEmissao)}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Detalhes do Pedido */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Produtos */}
                          <div className="md:col-span-2">
                            <div className="bg-gray-50 rounded-xl p-6">
                              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <ShoppingBagIcon className="w-5 h-5 text-primary" />
                                Produtos
                              </h3>
                              
                              <div className="space-y-4">
                                {pedido.Itens?.map((item) => (
                                  <div key={item.Item} className="flex gap-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                      <span className="text-gray-500 text-xs">{item.Produto}</span>
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-gray-900 font-medium">{item.Descricao}</h4>
                                      <div className="flex justify-between items-end mt-1">
                                        <p className="text-sm text-gray-600">
                                          {item.Quantidade} {item.Unidade} x R$ {item.ValorUnitario.toFixed(2)}
                                        </p>
                                        <p className="font-medium text-primary">
                                          R$ {(item.ValorUnitario * item.Quantidade).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Resumo de valores */}
                              <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Subtotal</span>
                                  <span>R$ {pedido.ValorProdutos.toFixed(2)}</span>
                                </div>
                                
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Frete</span>
                                  <span>R$ {pedido.ValorFrete.toFixed(2)}</span>
                                </div>
                                
                                {pedido.ValorDesconto > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Desconto</span>
                                    <span className="text-green-600">-R$ {pedido.ValorDesconto.toFixed(2)}</span>
                                  </div>
                                )}
                                
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                                  <span>Total</span>
                                  <span className="text-primary">
                                    R$ {pedido.ValorPedido.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Informações Adicionais */}
                          <div className="space-y-6">
                            {/* Endereço de entrega */}
                            <div className="bg-gray-50 rounded-xl p-6">
                              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-primary" />
                                Endereço de Entrega
                              </h3>
                              <div>
                                <p className="font-medium">{pedido.EnderecoNome || pedido.ClienteNome}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {pedido.Endereco}, {pedido.EnderecoNumero}
                                  {pedido.Complemento && ` - ${pedido.Complemento}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {pedido.Bairro} - {pedido.Cidade}/{pedido.UF}
                                </p>
                                <p className="text-sm text-gray-600">CEP: {pedido.CEP}</p>
                              </div>
                            </div>

                            {/* Pagamento */}
                            {pedido.Pagamento && pedido.Pagamento.length > 0 && (
                              <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <CreditCardIcon className="w-5 h-5 text-primary" />
                                  Pagamento
                                </h3>
                                <div>
                                  <p className="font-medium">
                                    {pedido.Pagamento[0].BandeiraCartao}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {pedido.Pagamento[0].QtdeParcela}x de R$ {(pedido.Pagamento[0].Valor / pedido.Pagamento[0].QtdeParcela).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-2">
                                    Autorização: {pedido.Pagamento[0].NrAutorizacao}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Ações */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
                            <DocumentTextIcon className="w-4 h-4" />
                            Ver Nota Fiscal
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <TruckIcon className="w-4 h-4" />
                            Rastrear Entrega
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ReceiptRefundIcon className="w-4 h-4" />
                            Solicitar Devolução
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 