"use client";

import { Header } from "@/components/Header";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      <div className="flex-1 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm5 5c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="max-w-3xl mx-auto px-4 py-16 relative z-10">
          <div className="glass-card text-center overflow-hidden relative">
            {/* Efeito de sucesso */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10"></div>
            
            <div className="relative p-12">
              {/* Ícone de sucesso animado */}
              <div className="w-24 h-24 mx-auto mb-8 relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center automotive-glow animate-pulse">
                  <CheckCircleIcon className="w-14 h-14 text-white" />
                </div>
                {/* Efeito de ondas */}
                <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-2 border-green-400/20 animate-ping animation-delay-200"></div>
              </div>
              
              <h1 className="text-4xl font-bold text-gradient-automotive mb-4">
                PEDIDO CONFIRMADO!
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto mb-6 rounded-full"></div>
              
              <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                Sua solicitação de <span className="text-orange-400 font-semibold">peças automotivas</span> foi recebida com sucesso!
              </p>
              
              <p className="text-gray-400 mb-8">
                Nossa equipe especializada da <span className="text-orange-400 font-semibold">Sorpack Embalagens</span> entrará em contato em breve.
              </p>

              {/* Estatísticas/Informações */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-4">
                  <div className="text-2xl font-bold text-green-400">✓</div>
                  <p className="text-gray-300 text-sm mt-1">Pedido Recebido</p>
                </div>
                <div className="glass-card p-4">
                  <div className="text-2xl font-bold text-orange-400">📞</div>
                  <p className="text-gray-300 text-sm mt-1">Contato em Breve</p>
                </div>
                <div className="glass-card p-4">
                  <div className="text-2xl font-bold text-blue-400">🚛</div>
                  <p className="text-gray-300 text-sm mt-1">Entrega Rápida</p>
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  href="/minha-conta/pedidos"
                  className="btn-primary w-full inline-flex items-center justify-center gap-3 text-lg py-4"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Acompanhar Pedido
                </Link>
                
                <Link 
                  href="/"
                  className="btn-secondary w-full inline-flex items-center justify-center gap-3 text-lg py-4"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 