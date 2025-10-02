'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Header } from '@/components/Header';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function EsqueciSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Buscar o email da URL quando a página carregar
  useEffect(() => {
    // No client-side, acesse os parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, informe seu e-mail');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://pedidoexterno.mcnsistemas.net.br/api/ecommerce/usuario/recuperar?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Erro ao solicitar recuperação de senha');
      }
      
      setSuccess(true);
      toast.success('E-mail de recuperação enviado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Não foi possível enviar o e-mail de recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <Link href="/minha-conta" className="inline-flex items-center text-primary hover:text-primary-dark mb-6">
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Voltar para login
            </Link>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar senha</h1>
            <p className="text-gray-600 mb-6">
              Informe seu e-mail cadastrado para receber instruções de recuperação de senha.
            </p>
            
            {success ? (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                <h2 className="text-green-800 font-medium mb-2">E-mail enviado com sucesso!</h2>
                <p className="text-green-700 text-sm">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  Se não encontrar o e-mail, verifique também sua pasta de spam.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                      placeholder="Seu email"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Enviando..." : "Recuperar senha"}
                </button>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Lembrou sua senha? <Link href="/minha-conta" className="text-primary hover:underline">Faça login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 