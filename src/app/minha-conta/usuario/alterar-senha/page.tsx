'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { customInstance } from '@/api/mutator/custom-instance';
import { useAuth } from '@/contexts/AuthContext';
import { FetchEventResult } from 'next/dist/server/web/types';
import { FetchServerResponseResult } from 'next/dist/client/components/router-reducer/fetch-server-response';
import axiosInstance from '@/api/axios-instance';

// Schema de validação
const changePasswordSchema = z.object({
  novaSenha: z.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .max(50, 'A senha não pode ter mais de 50 caracteres'),
  confirmarSenha: z.string()
}).refine(data => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type FormData = z.infer<typeof changePasswordSchema>;

export default function AlterarSenhaPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      novaSenha: '',
      confirmarSenha: ''
    }
  });

  // Enviar o formulário
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      // Usando a instância do axios
      await axiosInstance.put('/api/ecommerce/usuario/alterarsenha', {
        SenhaNova: data.novaSenha
      });
      
      toast.success('Senha alterada com sucesso!');
      reset();
      
      // Redirecionar para a página de perfil após alguns segundos
      setTimeout(() => {
        router.push('/minha-conta/usuario');
      }, 2000);
      
    } catch (error: any) {
      // Agora o erro já vem formatado do interceptor
      toast.error(error.message || 'Erro ao alterar senha. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirecionar se não estiver autenticado
  if (!isAuthenticated) {
    return null; // Ou mostrar uma mensagem e redirecionar
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Cabeçalho com link de voltar */}
            <div className="mb-6">
              <Link href="/minha-conta/usuario" className="inline-flex items-center text-primary hover:text-primary-dark">
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Voltar para Minha Conta
              </Link>
            </div>
            
            {/* Card do formulário */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <KeyIcon className="w-6 h-6 text-primary mr-2" />
                  Alterar Senha
                </h1>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Nova Senha */}
                  <div>
                    <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 mb-1">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="novaSenha"
                        {...register("novaSenha")}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.novaSenha ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-primary focus:border-primary`}
                        placeholder="Digite sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.novaSenha && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.novaSenha.message}
                      </p>
                    )}
                  </div>
                  
                  {/* Confirmar Senha */}
                  <div>
                    <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmarSenha"
                        {...register("confirmarSenha")}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.confirmarSenha ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-primary focus:border-primary`}
                        placeholder="Confirme sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmarSenha && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmarSenha.message}
                      </p>
                    )}
                  </div>
                  
                  {/* Dicas de segurança */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Dicas para uma senha segura:</h3>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                      <li>Use pelo menos 6 caracteres</li>
                      <li>Combine letras maiúsculas e minúsculas</li>
                      <li>Inclua números e símbolos</li>
                      <li>Evite informações pessoais ou senhas óbvias</li>
                    </ul>
                  </div>
                  
                  {/* Botão de envio */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Alterando senha...
                        </>
                      ) : (
                        'Alterar Senha'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 