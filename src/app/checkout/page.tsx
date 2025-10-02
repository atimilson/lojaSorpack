"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useEcommerceUser } from "@/hooks/useEcommerceUser";
import { useEcommerceAddress } from "@/hooks/useEcommerceAddress";
import { UsuarioEcommerceEnderecoDto } from "@/api/generated/mCNSistemas.schemas";
import Loading from "@/components/Loading";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useGetApiCondpgto, useGetApiCondpgtoFormapgto } from '@/api/generated/mCNSistemas';

interface CheckoutFormData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: {
    zipcode: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  payment: {
    method: "credit_card";
    installments: number;
    cardNumber: string;
    expMonth: string;
    expYear: string;
    securityCode: string;
    cardHolder: string;
  };
}

export default function CheckoutPage() {
  const { items = [], total = 0, selectedShipping } = useCart();
  const router = useRouter();
  const { user, isLoading: userLoading } = useEcommerceUser();
  const { addresses = [], isLoading: addressLoading } = useEcommerceAddress();
  
  const [enderecoCliente, setEnderecoCliente] = useState<UsuarioEcommerceEnderecoDto>({
    CEP: '',
    Endereco: '',
    Numero: '',
    Complemento: '',
    Bairro: '',
    Cidade: '',
    UF: ''
  });

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    address: {
      zipcode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    payment: {
      method: "credit_card",
      installments: 1,
      cardNumber: "",
      expMonth: "",
      expYear: "",
      securityCode: "",
      cardHolder: "",
    },
  });

  // Buscar condições de pagamento
  const { data: condicoesPagamento = [] } = useGetApiCondpgto({    
    condicao: 0
  });

  // Filtrar condições válidas para cartão de crédito no ecommerce
  const parcelasDisponiveis = condicoesPagamento
    .filter(cond => 
      cond.Ecommerce && 
      cond.TipoFormaPgto === 8 && 
      cond.FormaPgto === 6
    )
    .sort((a, b) => (a.QtdeParcelas || 0) - (b.QtdeParcelas || 0));

  // Calcular valor das parcelas
  const calcularParcelas = (qtdeParcelas: number, valorTotal: number) => {
    const condicao = parcelasDisponiveis.find(p => p.QtdeParcelas === qtdeParcelas);
    if (!condicao) return valorTotal / qtdeParcelas;

    // Corrigir o cálculo do percentual de acréscimo
    const percentualAcrescimo = (condicao.PercAcrescimo || 0) / 100;
    
    if (condicao.CalcJuroComposto) {
      // Cálculo de juros compostos
      const valorParcela = (valorTotal * (1 + percentualAcrescimo) ** qtdeParcelas) / qtdeParcelas;
      return valorParcela;
    } else {
      // Cálculo de juros simples
      const valorComAcrescimo = valorTotal * (1 + (percentualAcrescimo * qtdeParcelas));
      return valorComAcrescimo / qtdeParcelas;
    }
  };

  useEffect(() => {
    if (addresses.length > 0) {
      setEnderecoCliente(addresses[0]);
    }
  }, [addresses]);

  useEffect(() => {
    if (user && enderecoCliente) {
      setFormData(prev => ({
        ...prev,
        name: user.Nome || '',
        email: user.Email || '',
        cpf: user.CPFouCNPJ || '',
        phone: user.Fone || '',
        address: {
          zipcode: enderecoCliente.CEP || '',
          street: enderecoCliente.Endereco || '',
          number: enderecoCliente.Numero || '',
          complement: enderecoCliente.Complemento || '',
          neighborhood: enderecoCliente.Bairro || '',
          city: enderecoCliente.Cidade || '',
          state: enderecoCliente.UF || ''
        }
      }));
    }
  }, [user, enderecoCliente]);

  if (userLoading || addressLoading) {
    return <Loading />;
  }

  if (!items.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900">Seu carrinho está vazio</h2>
            <p className="mt-2 text-gray-600">Adicione produtos para continuar com a compra</p>
            <Link href="/" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
              Voltar às compras
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Substituir o installmentOptions existente
  const valorTotal = total + (selectedShipping?.valor ? parseFloat(selectedShipping.valor) : 0);
  const installmentOptions = parcelasDisponiveis.map(condicao => {
    const qtdeParcelas = condicao.QtdeParcelas || 1;
    const valorParcela = calcularParcelas(qtdeParcelas, valorTotal);
    const valorTotalParcelado = valorParcela * qtdeParcelas;

    return {
      number: qtdeParcelas,
      value: valorParcela,
      total: valorTotalParcelado,
      description: condicao.Descricao
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/pagbank/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customer: {
            name: formData.name,
            email: formData.email,
            cpf: formData.cpf,
            phone: formData.phone,
          },
          shipping: {
            ...formData.address,
            valor: selectedShipping?.valor || '0'
          },
          payment: {
            method: formData.payment.method,
            ...(formData.payment.method === 'credit_card' && {
              installments: formData.payment.installments,
              card: {
                number: formData.payment.cardNumber,
                expMonth: formData.payment.expMonth,
                expYear: formData.payment.expYear,
                securityCode: formData.payment.securityCode,
                holder: formData.payment.cardHolder
              }
            })
          }
        }),
      });

      const data = await response.json();

      if (data.id) {
        router.push('/pedido-finalizado');
      } else {
        toast.error('Erro ao processar pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      {/* Hero Section do Checkout */}
      <section className="relative py-16 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm5 5c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center automotive-glow engine-pulse">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient-automotive whitespace-nowrap">
                FINALIZAR PEDIDO
              </h1>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
            </div>
            
            <p className="text-gray-300 text-lg">
              Complete suas informações para <span className="text-orange-400 font-semibold">confirmar sua compra</span>
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Dados Pessoais - Somente Leitura */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Dados Pessoais</h2>
                {userLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                      <div className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-700">
                        {formData.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                      <div className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-700">
                        {formData.email}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                        <div className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-700">
                          {formData.cpf}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <div className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-700">
                          {formData.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Endereço - Somente Leitura */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Endereço de Entrega</h2>
                {addressLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ) : addresses && addresses.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                        <div className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-700">
                          {`${formData.address.street} N:${formData.address.number}`}
                          {formData.address.complement && ` - ${formData.address.complement}`}
                          <br />
                          {`${formData.address.neighborhood} - ${formData.address.city}/${formData.address.state}`}
                          <br />
                          {`CEP: ${formData.address.zipcode}`}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CEP
                        </label>
                        <input
                          type="text"
                          value={formData.address.zipcode}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address, zipcode: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="00000-000"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rua
                      </label>
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, street: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número
                        </label>
                        <input
                          type="text"
                          value={formData.address.number}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address, number: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={formData.address.complement}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address, complement: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={formData.address.neighborhood}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, neighborhood: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={formData.address.city}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address, city: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <select
                          value={formData.address.state}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address, state: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        >
                          <option value="">Selecione...</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          <option value="SP">São Paulo</option>
                          <option value="TO">Tocantins</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagamento */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold mb-4">Forma de Pagamento</h2>
                <div className="space-y-4">
                  {/* Campos do Cartão */}
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome no Cartão
                      </label>
                      <input
                        type="text"
                        value={formData.payment.cardHolder}
                        onChange={(e) => setFormData({
                          ...formData,
                          payment: { ...formData.payment, cardHolder: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Nome como está no cartão"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        value={formData.payment.cardNumber}
                        onChange={(e) => setFormData({
                          ...formData,
                          payment: { ...formData.payment, cardNumber: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="0000 0000 0000 0000"
                        maxLength={16}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mês
                        </label>
                        <select
                          value={formData.payment.expMonth}
                          onChange={(e) => setFormData({
                            ...formData,
                            payment: { ...formData.payment, expMonth: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, '0');
                            return (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ano
                        </label>
                        <select
                          value={formData.payment.expYear}
                          onChange={(e) => setFormData({
                            ...formData,
                            payment: { ...formData.payment, expYear: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        >
                          <option value="">AAAA</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (new Date().getFullYear() + i).toString();
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={formData.payment.securityCode}
                          onChange={(e) => setFormData({
                            ...formData,
                            payment: { ...formData.payment, securityCode: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parcelas
                      </label>
                      <select
                        value={formData.payment.installments}
                        onChange={(e) => setFormData({
                          ...formData,
                          payment: { ...formData.payment, installments: Number(e.target.value) }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      >
                        <option value="">Selecione as parcelas</option>
                        {installmentOptions.map((option) => (
                          <option key={option.number} value={option.number}>
                            {option.description} - {option.number}x de R$ {option.value.toFixed(2)}
                            {option.number && option.number > 1 && option.total > valorTotal 
                              ? ` (Total: R$ ${option.total.toFixed(2)})` 
                              : ''
                            }
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-primary text-white py-3 rounded-lg"
              >
                Finalizar Compra
              </button>
            </form>
          </div>

          {/* Resumo */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
            <div className="space-y-4">
              {/* Lista de Itens */}
              <div className="space-y-3">
                {items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div className="flex-1">
                      <p className="font-medium">{item.Descricao}</p>
                      <p className="text-sm text-gray-600">Quantidade: {item.Quantidade}</p>
                    </div>
                    <p className="font-medium">
                      R$ {((item.PrecoPromocional || item.Preco || 0) * item.Quantidade).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totais */}
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span>R$ {selectedShipping?.valor || '0.00'}</span>
                </div>

                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">
                    R$ {((selectedShipping?.valor ? parseFloat(selectedShipping.valor) : total) + (total)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
