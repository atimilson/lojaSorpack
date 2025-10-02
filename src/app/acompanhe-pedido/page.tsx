import Image from "next/image";
import Link from "next/link";
import { 
  TruckIcon, 
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Header } from "@/components/Header";

export default function AcompanhePedidoPage() {
  return (
    <div className="flex-1 bg-gray-50">
      <Header />
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="text-primary hover:text-primary-dark">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Acompanhe seu Pedido</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Busca de Pedido */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Acompanhe seu Pedido</h1>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Digite o número do pedido"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  Buscar Pedido
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Você também pode acessar seus pedidos fazendo <Link href="/minha-conta" className="text-primary hover:text-primary-dark">login na sua conta</Link></p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Pedido 1 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-bold text-gray-900">Pedido #123456</h2>
                    <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                      Em Transporte
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Realizado em 15/03/2024</p>
                </div>
                
                <button className="text-primary hover:text-primary-dark">
                  <ChevronDownIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Timeline do Pedido */}
            <div className="p-6">
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-px bg-gray-200"></div>
                
                <div className="space-y-6">
                  {/* Etapa Atual */}
                  <div className="relative flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <TruckIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Em Transporte</h3>
                      <p className="text-sm text-gray-600">Pedido saiu para entrega - São Paulo/SP</p>
                      <p className="text-xs text-gray-500 mt-1">Hoje às 09:45</p>
                    </div>
                  </div>

                  {/* Etapas Anteriores */}
                  <div className="relative flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Pedido Separado</h3>
                      <p className="text-sm text-gray-600">Produtos separados no centro de distribuição</p>
                      <p className="text-xs text-gray-500 mt-1">14/03/2024 às 16:30</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <DocumentTextIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Pedido Confirmado</h3>
                      <p className="text-sm text-gray-600">Pagamento aprovado</p>
                      <p className="text-xs text-gray-500 mt-1">13/03/2024 às 10:15</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalhes do Pedido */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-medium text-gray-900 mb-4">Produtos do Pedido</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src="/produto1.jpg"
                        alt="Produto 1"
                        unoptimized={true}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900">Furadeira de Impacto Bosch GSB 13 RE 650W</h4>
                      <p className="text-sm text-gray-600">Quantidade: 1</p>
                      <p className="text-sm font-medium text-primary">R$ 399,90</p>
                    </div>
                  </div>
                </div>

                {/* Ações do Pedido */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <DocumentTextIcon className="w-4 h-4" />
                    Ver Nota Fiscal
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <MapPinIcon className="w-4 h-4" />
                    Rastrear Entrega
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    Suporte
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Outros Pedidos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-bold text-gray-900">Pedido #123455</h2>
                  <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                    Entregue
                  </span>
                </div>
                <p className="text-sm text-gray-600">Realizado em 10/03/2024</p>
              </div>
              
              <button className="text-primary hover:text-primary-dark">
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Ajuda */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Precisa de Ajuda?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/central-ajuda" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary group">
                <DocumentTextIcon className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                <div>
                  <h3 className="font-medium text-gray-900">Central de Ajuda</h3>
                  <p className="text-sm text-gray-600">Encontre respostas para suas dúvidas</p>
                </div>
              </Link>
              <Link href="/fale-conosco" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary group">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                <div>
                  <h3 className="font-medium text-gray-900">Fale Conosco</h3>
                  <p className="text-sm text-gray-600">Entre em contato com nosso suporte</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 