import Image from "next/image";
import Link from "next/link";
import { featuredProducts } from "@/mocks/products";
import { 
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  ShareIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Header } from "@/components/Header";

export default function FavoritosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm5 5c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="glass-card p-3 rounded-xl inline-flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-orange-400 transition-colors">Home</Link>
              <span className="text-gray-500">/</span>
              <span className="text-orange-400 font-medium">Meus Favoritos</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center automotive-glow engine-pulse">
                <HeartIconSolid className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient-automotive whitespace-nowrap">
                FAVORITOS
              </h1>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
            </div>
            
            <p className="text-gray-300 text-lg">
              Suas <span className="text-orange-400 font-semibold">peças automotivas</span> favoritas em um só lugar
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Favoritos</h1>
            <p className="text-gray-600 mt-1">12 produtos salvos</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <ShareIcon className="w-5 h-5" />
              <span>Compartilhar Lista</span>
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <BellIcon className="w-5 h-5" />
              <span>Ativar Alertas</span>
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg">
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg">
                <ListBulletIcon className="w-5 h-5" />
              </button>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Ordenar por:</span>
                <button className="flex items-center gap-1 text-sm text-gray-900 hover:text-primary">
                  Mais Recentes
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button className="text-sm text-red-500 hover:text-red-600">
              Limpar Lista
            </button>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="relative p-4">
                {/* Botão Remover */}
                <button className="absolute top-4 right-4 z-10 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <TrashIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>

                {/* Imagem */}
                <Link href={`/produto/${product.id}`}>
                  <div className="relative aspect-square mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized={true}
                      className="object-contain"
                    />
                  </div>
                </Link>

                {/* Informações */}
                <div className="space-y-2">
                  <Link href={`/produto/${product.id}`}>
                    <h3 className="text-gray-900 font-medium line-clamp-2 hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>

                  <div>
                    {product.oldPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        R$ {product.oldPrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xl font-bold text-primary">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      em até 10x de R$ {(product.price / 10).toFixed(2)}
                    </p>
                  </div>

                  {/* Alert */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 