"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useRegister";
import { useLogin } from "@/hooks/useLogin";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  IdentificationIcon,
  CalendarIcon,
  EyeIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import InputMask from 'react-input-mask';
import { toast } from "react-hot-toast";
import { customInstance } from "@/api/mutator/custom-instance";
// import axios from "axios";
// Adicione essa interface para tipar a resposta da API
interface ClienteResponse {
  Contrato: number;
  Cliente: number;
  RazaoSocial: string;
  Fantasia: string;
  TipoPessoa: string;
  CPF: string;
  CNPJ: string;
  IE: string;
  Endereco: string;
  Complemento: string;
  Numero: string;
  CEP: string;
  NomeBairro: string;
  NomeCidade: string;
  UF: string;
  Fone1: string;
  Fone2: string;
  Fone3: string;
  Fone4: string;
  Email: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { register, isLoading, error } = useRegister();
  const { isAuthenticated } = useAuth();
  
  // Estados separados para cada campo
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [ie, setIe] = useState("");
  const [fone, setFone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("F");
  const [camposDesabilitados, setCamposDesabilitados] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState<'valid' | 'invalid' | 'none'>('none');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // useEffect para mostrar toast de erro quando há scroll na página
  useEffect(() => {
    if (error) {
      // Verifica se a página tem scroll
      const hasVerticalScroll = document.documentElement.scrollHeight > window.innerHeight;
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
      
      if (hasVerticalScroll || hasHorizontalScroll) {
        try {
          const jsonError = JSON.parse(error);
          
          if (jsonError && jsonError.error) {
            if (jsonError.error.includes("usuário ja possuí cadastro")) {
              toast.error("Este usuário já possui uma conta! Faça login ou recupere sua senha.", {
                duration: 5000,
                icon: '⚠️',
              });
            } else if (jsonError.error.includes("informe letra ou caractere especial")) {
              toast.error("Senha deve conter letras e caracteres especiais (!@#$%^&*)", {
                duration: 5000,
                icon: '🔒',
              });
            } else {
              toast.error(jsonError.error, {
                duration: 4000,
              });
            }
          }
        } catch (parseError) {
          // Se não conseguir fazer parse do JSON, mostra o erro como string
          toast.error(error, {
            duration: 4000,
          });
        }
      }
    }
  }, [error]);

  // Função para determinar a máscara baseada no tipo de pessoa
  const getDocumentMask = (tipoPessoa: string) => {
    return tipoPessoa === 'F' ? '999.999.999-99' : '99.999.999/9999-99';
  };

  // Função para formatar o valor do documento
  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
    }
  };

  // Modifique a função verificarCliente
  const verificarCliente = async (documento: string) => {
    try {
      // const response: any = await axios.get(`https://pedidoexterno.mcnsistemas.net.br/api/cliente?cliente=0&CPFouCNPJ=${documento}`);
      const token = localStorage.getItem('token');
      const response: any = await fetch(`https://pedidoexterno.mcnsistemas.net.br/api/cliente?cliente=0&CPFouCNPJ=${documento}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          }
        }
      )
      const data = await response.json();
      console.log('Resposta da API:', data);

      if (data && data.length > 0) {
        const cliente = data[0];
        console.log('Cliente encontrado:', cliente);

        // Armazenar os dados do cliente para usar no cadastro
        setNome(cliente.TipoPessoa === 'J' ? (cliente.Fantasia || cliente.RazaoSocial) : cliente.RazaoSocial);
        setEmail(cliente.Email || '');
        setCpfCnpj(cliente.TipoPessoa === 'F' ? cliente.CPF : cliente.CNPJ);
        setIe(cliente.IE || '');
        setFone(cliente.Fone2 || cliente.Fone1 || cliente.Fone3 || cliente.Fone4 || '');
        setTipoPessoa(cliente.TipoPessoa);
        
        // Limpar campos de senha
        setSenha('');
        setConfirmarSenha('');
        
        // Atualiza o formulário de login
        setLoginData(prev => ({
          ...prev,
          email: cliente.Email || ''
        }));

        // Mostrar apenas campos de email e senha
        toast.success("Cliente encontrado! Complete seu cadastro com email e senha.");
        setCamposDesabilitados(true);
        
        // Forçar atualização do estado
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar cliente:', error);
      toast.error("Erro ao consultar cliente");
      return false;
    }
  };

  // Modifique a função handleChange
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    // Atualiza o campo específico baseado no nome
    switch (name) {
      case 'Nome':
        setNome(value);
        break;
      case 'Email':
        setEmail(value);
        break;
      case 'Senha':
        setSenha(value);
        break;
      case 'CPFouCNPJ':
        setCpfCnpj(value);
        const numeroLimpo = value.replace(/\D/g, '');
        
        if (numeroLimpo.length > 11) {
          setTipoPessoa('J');
        } else {
          setTipoPessoa('F');
          setIe('');
        }

        // Verificar cliente apenas quando o campo estiver completo
        if ((numeroLimpo.length === 11 && tipoPessoa === 'F') || 
            (numeroLimpo.length === 14 && tipoPessoa === 'J')) {
          await verificarCliente(value);
        }
        break;
      case 'IE':
        setIe(value);
        break;
      case 'Fone':
        setFone(value);
        break;
      case 'DataNascimento':
        setDataNascimento(value);
        break;
      case 'confirmarSenha':
        setConfirmarSenha(value);
        break;
      case 'termsAccepted':
        setTermsAccepted(checked);
        break;
      case 'tipoPessoa':
        setTipoPessoa(value);
        break;
    }
  };

  // Modifique o handleSubmit para usar os dados armazenados
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Evitar múltiplas submissões
    if (isLoading) {
      return;
    }

    if (!termsAccepted) {
      toast.error("Você precisa aceitar os termos de uso e política de privacidade");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (senha.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(senha);
    const hasSpecialChar = /[!@#$%^&*]/.test(senha);

    if (!hasLetter || !hasSpecialChar) {
      toast.error("A senha deve conter pelo menos uma letra e um caractere especial");
      return;
    }

    // Criar objeto de dados do formulário uma vez
    const userData = {
      Nome: nome,
      Email: email,
      Senha: senha,
      CPFouCNPJ: cpfCnpj,
      IE: ie,
      Fone: fone,
      DataNascimento: dataNascimento,
    };

    try {
      // Fazer apenas uma chamada ao método register
      const success = await register(userData);
  
      if (success) {
        setSuccessMessage("Cadastro realizado com sucesso!");

        toast.success("Cadastro realizado com sucesso!");

        // Limpa todos os campos
        setNome("");
        setEmail("");
        setSenha("");
        setCpfCnpj("");
        setIe("");
        setFone("");
        setDataNascimento("");
        setConfirmarSenha("");
        setTermsAccepted(false);
        setTipoPessoa("F");
        setCamposDesabilitados(false);
        
        // Limpar loginData também para evitar tentativas duplicadas
        setLoginData({
          email: "",
          password: "",
          rememberMe: false
        });
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast.error("Erro ao cadastrar");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo");

      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push("/minha-conta/usuario");
      }
    }
  }, [isAuthenticated, router]);

  const { login, isLoading: isLoginLoading, error: loginError } = useLogin();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // useEffect para mostrar toast de erro de login quando há scroll na página
  useEffect(() => {
    if (loginError) {
      // Verifica se a página tem scroll
      const hasVerticalScroll = document.documentElement.scrollHeight > window.innerHeight;
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
      
      if (hasVerticalScroll || hasHorizontalScroll) {
        toast.error(loginError, {
          duration: 4000,
          icon: '🔑',

        });
      }
    }
  }, [loginError]);

  // Modifique a função verificarUsuarioPorEmail para atualizar o status do email
  const verificarUsuarioPorEmail = async (email: string) => {
    try {
      const token = await localStorage.getItem('token');
      const response = await fetch(`https://pedidoexterno.mcnsistemas.net.br/api/ecommerce/usuario/existe?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `${token}`
          }
        }
      );
      
      // Status 200 significa que o usuário existe
      if (response.status === 200) {
        setEmailStatus('valid');
        return true;
      } else if (response.status === 400) {
        // Se o status for 400, o email não existe
        setEmailStatus('invalid');
        toast.error("Email não encontrado. Crie uma nova conta.");
        return false;
      }
      
      return false;
    } catch (error: any) {
      console.error('Erro ao verificar email:', error);
      
      // Para erros de rede ou outros erros
      toast.error("Erro ao verificar usuário");
      return false;
    }
  };

  // Modifique a função handleLoginChange para resetar o status quando o email for alterado
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Resetar o status do email quando o usuário começar a digitá-lo novamente
    if (name === 'email' && emailStatus === 'invalid') {
      setEmailStatus('none');
    }
    
    // Verifica se o email é válido e se o usuário está tentando fazer login
    if (name === 'email' && value && isValidEmail(value)) {
      // Adicione um debounce para não chamar a API muitas vezes
      const timeoutId = setTimeout(() => {
        verificarUsuarioPorEmail(value);
      }, 500);
      
      // Limpa o timeout anterior se o usuário continuar digitando
      return () => clearTimeout(timeoutId);
    }
  };

  // Função para validar email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await login({
      Usuario: loginData.email,
      Senha: loginData.password,
    });
  };

  // Adicione este useEffect para monitorar mudanças no estado camposDesabilitados
  useEffect(() => {
    if (camposDesabilitados) {
      console.log("Campos desabilitados:", camposDesabilitados);
      console.log("Dados do cliente:", { nome, email, cpfCnpj, tipoPessoa });
    }
  }, [camposDesabilitados]);

  // Modificar o link "Esqueci minha senha" no formulário de login
  const handleEsqueciSenha = () => {
    const email = loginData.email;
    if (email) {
      router.push(`/esqueci-senha?email=${encodeURIComponent(email)}`);
    } else {
      router.push('/esqueci-senha');
    }
  };
  
  const jsonError = error? JSON.parse(error) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm5 5c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Adicionar estilo personalizado ao head */}
      <style jsx global>{`
        .highlight-form {
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.5);
          animation: automotive-pulse 1.5s infinite;
        }
        
        @keyframes automotive-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
          }
        }
      `}</style>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="text-primary hover:text-primary-dark">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Minha Conta</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 border-r border-gray-200">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center shadow-lg">
                      <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f98e00] via-[#0ba360] to-[#f98e00] bg-clip-text text-transparent">
                      CRIAR CONTA
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#f98e00] to-[#e67700] mx-auto mb-4 rounded-full"></div>
                    <p className="text-gray-700 mt-1">
                      Cadastre-se na <span className="text-[#f98e00] font-semibold">Sorpack Embalagens</span>
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-red-700">Erro no cadastro:</span>
                      </div>
                      
                      {jsonError && jsonError.error && jsonError.error.includes("usuário ja possuí cadastro") ? (
                        <div className="mt-2">
                          <p className="mt-1 ml-7 font-medium text-amber-600">Este usuário já possui uma conta!</p>
                          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                              </svg>
                              <span className="text-amber-700">Você já tem uma conta em nossa loja.</span>
                            </div>
                            <div className="mt-2 ml-7">
                              <p className="text-sm text-amber-700 mb-3">Você pode fazer login usando seu e-mail e senha ou recuperar sua senha se não lembrar.</p>
                              <button
                                onClick={() => {
                                  // Copiar o email do cadastro para o login
                                  setLoginData(prev => ({
                                    ...prev,
                                    email: email
                                  }));
                                  
                                  // Mudar para a aba de login
                                  setActiveTab('login');
                                  
                                  // Adicionar um destaque temporário ao formulário de login
                                  const loginForm = document.querySelector('.login-form-container');
                                  if (loginForm) {
                                    loginForm.classList.add('highlight-form');
                                    // Remover a classe após 3 segundos
                                    setTimeout(() => {
                                      loginForm.classList.remove('highlight-form');
                                    }, 6000);
                                  }
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-sm py-2 px-4 rounded-md transition-colors mr-2"
                              >
                                Fazer login
                              </button>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEsqueciSenha();
                                }}
                                className="text-sm text-amber-700 hover:text-amber-800 underline"
                              >
                                Esqueci minha senha
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 ml-7">{jsonError && jsonError.error}</p>
                      )}

                      {error.includes(
                        "informe letra ou caractere especial"
                      ) && (
                        <ul className="mt-2 ml-7 text-sm list-disc list-inside text-red-500">
                          <li>A senha deve conter pelo menos uma letra</li>
                          <li>
                            A senha deve conter pelo menos um caractere especial
                            (!@#$%^&*)
                          </li>
                          <li>A senha deve ter no mínimo 8 caracteres</li>
                        </ul>
                      )}
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{successMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {camposDesabilitados ? (
                      // Formulário simplificado para cliente existente
                      <>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <p className="text-blue-700">Cliente encontrado! Complete seu cadastro criando uma senha.</p>
                          <p className="text-sm text-blue-600 mt-2">
                            Nome: {nome}<br />
                            {tipoPessoa === 'F' ? 'CPF' : 'CNPJ'}: {cpfCnpj}
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-2">
                            E-mail
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                              type="email"
                              id="Email"
                              name="Email"
                              value={email}
                              onChange={handleChange}
                              required
                              className="pl-10 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] transition-all duration-300"
                              placeholder="seu@email.com"
                            />
                          </div>
                        </div>
                        
                        
                      </>
                    ) : (
                      // Formulário completo para novo cliente
                      <>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tipo de Cadastro
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="relative flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 p-4 hover:border-primary transition-colors">
                          <input
                            type="radio"
                            name="tipoPessoa"
                            value="F"
                            checked={tipoPessoa === 'F'}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <UserIcon className="h-6 w-6 text-gray-500 peer-checked:text-primary" />
                            <span className="text-sm font-medium text-gray-700 peer-checked:text-primary">
                              Pessoa Física
                            </span>
                          </div>
                          <span className="absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-primary" 
                            aria-hidden="true"
                          />
                        </label>

                        <label className="relative flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 p-4 hover:border-primary transition-colors">
                          <input
                            type="radio"
                            name="tipoPessoa"
                            value="J"
                            checked={tipoPessoa === 'J'}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <BuildingStorefrontIcon className="h-6 w-6 text-gray-500 peer-checked:text-primary" />
                            <span className="text-sm font-medium text-gray-700 peer-checked:text-primary">
                              Pessoa Jurídica
                            </span>
                          </div>
                          <span className="absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-primary" 
                            aria-hidden="true"
                          />
                        </label>
                      </div>
                    </div>

                        <div>
                          <label htmlFor="CPFouCNPJ" className="block text-sm font-medium text-gray-700 mb-2">
                            {tipoPessoa === 'F' ? 'CPF' : 'CNPJ'}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <IdentificationIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <InputMask
                              mask={getDocumentMask(tipoPessoa)}
                              value={cpfCnpj}
                              onChange={handleChange}
                              id="CPFouCNPJ"
                              name="CPFouCNPJ"
                              className="pl-10 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] transition-all duration-300"
                              placeholder={tipoPessoa === 'F' ? '000.000.000-00' : '00.000.000/0000-00'}
                              required
                            />
                          </div>
                        </div>

                        {/* Campos que sempre aparecem */}
                        <div>
                          <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-2">
                            E-mail
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                              type="email"
                              id="Email"
                              name="Email"
                              value={email}
                              onChange={handleChange}
                              required
                              className="pl-10 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] transition-all duration-300"
                              placeholder="seu@email.com"
                            />
                          </div>
                        </div>

                        {/* Campos que aparecem apenas se não for cliente existente */}
                        {!camposDesabilitados && (
                          <>
                            <div>
                              <label htmlFor="Nome" className="block text-sm font-medium text-gray-700 mb-2">
                                {tipoPessoa === 'F' ? 'Nome Completo' : 'Razão Social'}
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <UserIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                  type="text"
                                  id="Nome"
                                  name="Nome"
                                  value={nome}
                                  onChange={handleChange}
                                  required
                                  className="pl-10 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] transition-all duration-300"
                                  placeholder={tipoPessoa === 'F' ? 'Seu nome completo' : 'Razão Social da empresa'}
                                />
                              </div>
                            </div>

                            {tipoPessoa === 'J' && (
                              <div>
                                <label htmlFor="IE" className="block text-sm font-medium text-gray-700 mb-2">
                                  Inscrição Estadual
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IdentificationIcon className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <InputMask
                                    mask="999.999.999.999"
                                    value={ie}
                                    onChange={handleChange}
                                    id="IE"
                                    name="IE"
                                    className="pl-10 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] transition-all duration-300"
                                    placeholder="000.000.000.000"
                                  />
                                </div>
                              </div>
                            )}

                            {tipoPessoa === 'F' && (
                              <div>
                                <label htmlFor="DataNascimento" className="block text-sm font-medium text-gray-700 mb-2">
                                  Data de Nascimento
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <InputMask
                                    mask="99/99/9999"
                                    value={dataNascimento}
                                    onChange={handleChange}
                                    id="DataNascimento"
                                    name="DataNascimento"
                                    className="pl-10 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] transition-all duration-300"
                                    placeholder="DD/MM/AAAA"
                                  />
                                </div>
                              </div>
                            )}

                            <div>
                              <label htmlFor="Fone" className="block text-sm font-medium text-gray-700 mb-2">
                                Telefone
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <PhoneIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <InputMask
                                  mask="(99) 99999-9999"
                                  value={fone}
                                  onChange={handleChange}
                                  id="Fone"
                                  name="Fone"
                                  className="pl-10 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] transition-all duration-300"
                                  placeholder="(00) 00000-0000"
                                  required
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* Campos comuns para ambos os casos */}
                    <div>
                          <label htmlFor="Senha" className="block text-sm font-medium text-gray-700 mb-2">
                            Senha
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <LockClosedIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                              type="password"
                              id="Senha"
                              name="Senha"
                              value={senha}
                              onChange={handleChange}
                              required
                              className="pl-10 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] transition-all duration-300"
                              placeholder="Mínimo 8 caracteres"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            A senha deve ter no mínimo 8 caracteres, incluindo letras e caracteres especiais.
                          </p>
                        </div>

                        <div>
                          <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar Senha
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <LockClosedIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                              type="password"
                              id="confirmarSenha"
                              name="confirmarSenha"
                              value={confirmarSenha}
                              onChange={handleChange}
                              required
                              className="pl-10 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] transition-all duration-300"
                              placeholder="Confirme sua senha"
                            />
                          </div>
                        </div>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        checked={termsAccepted}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 text-[#f98e00] bg-white border-gray-300 rounded focus:ring-[#f98e00] focus:ring-2 cursor-pointer"
                        required
                      />
                      <label htmlFor="termsAccepted" className="text-sm text-gray-600 cursor-pointer">
                        Concordo com os <Link href="/termos" className="text-[#f98e00] hover:underline font-medium">Termos de Uso</Link> e <Link href="/politica-privacidade" className="text-[#f98e00] hover:underline font-medium">Política de Privacidade</Link>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Cadastrando..." : camposDesabilitados ? "Completar Cadastro" : "Criar conta"}
                    </button>
                  </form>
                </div>
              </div>

              <div className="p-8 bg-gray-50 backdrop-blur-lg login-form-container transition-all duration-300">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#f98e00] to-[#e67700] flex items-center justify-center shadow-lg">
                      <LockClosedIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f98e00] via-[#0ba360] to-[#f98e00] bg-clip-text text-transparent">
                      FAZER LOGIN
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#f98e00] to-[#e67700] mx-auto mb-4 rounded-full"></div>
                    <p className="text-gray-700 mt-1">
                      Acesse sua conta na <span className="text-[#f98e00] font-semibold">Sorpack</span>
                    </p>
                  </div>

                  {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700">{loginError}</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      {emailStatus === 'invalid' && (
                        <div className="p-2 mb-2 text-sm text-red-700 bg-red-100 rounded-lg">
                          <span className="font-medium">Este email não está cadastrado.</span> 
                          <button 
                            onClick={() => setActiveTab('register')}
                            className="ml-1 text-red-700 underline hover:text-red-800"
                          >
                            Criar uma conta com este email
                          </button>
                        </div>
                      )}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                          </svg>
                        </div>
                        <input
                          type="email"
                          id="login-email"
                          name="email"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          onBlur={(e) => {
                            if (isValidEmail(e.target.value)) {
                              verificarUsuarioPorEmail(e.target.value);
                            }
                          }}
                          required
                          className={`pl-10 w-full rounded-lg border focus:ring-primary ${
                            emailStatus === 'invalid' 
                              ? 'border-red-500 focus:border-red-500' 
                              : emailStatus === 'valid'
                                ? 'border-green-500 focus:border-green-500'
                                : 'border-gray-300 focus:border-primary'
                          }`}
                          placeholder="Seu email"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Senha
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockClosedIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                          className="pl-10 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f98e00] focus:border-[#f98e00] transition-all duration-300"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={loginData.rememberMe}
                          onChange={handleLoginChange}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Lembrar-me
                        </span>
                      </label>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEsqueciSenha();
                        }}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Esqueci minha senha
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoginLoading}
                      className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoginLoading ? "Entrando..." : "Entrar na Sorpack"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
