import { NextResponse } from 'next/server';
import { postApiPedidoecommerce, usePostApiPedidoecommerce } from '@/api/generated/mCNSistemas';
import { cookies } from 'next/headers';

const PAGBANK_TOKEN = '2f3a563f-62b6-412b-a171-0464537211e47251bc8941d4844bf55ba9b4e8fd02ec74c4-de65-44b4-8455-719425355351';
const SELLER_EMAIL = 'atimilson95@gmail.com';

export async function POST(request: Request) {
  const { items, shipping, customer, payment } = await request.json();

  // Validar email do comprador
  if (customer.email === SELLER_EMAIL) {
    return NextResponse.json({
      error: 'O email do comprador não pode ser igual ao email do vendedor'
    }, { status: 400 });
  }

  // Função para limpar CPF/CNPJ
  const cleanDocument = (doc: string) => doc.replace(/\D/g, '');
  
  // Função para limpar telefone
  const cleanPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return {
      area: cleaned.substring(0, 2),
      number: cleaned.substring(2)
    };
  };

  try {
    const phone = cleanPhone(customer.phone);
    const taxId = cleanDocument(customer.cpf);

    // Calcular subtotal dos itens
    const itemsTotal = items.reduce((total: number, item: any) => 
      total + (item.PrecoPromocional || item.Preco || 0) * (item.Quantidade || 1), 
    0);

    // Adicionar valor do frete (garantindo valor mínimo de 0.01)
    const shippingValue = Math.max(0.01, shipping.valor ? parseFloat(shipping.valor) : 0);

    // Calcular valor total em centavos (items + frete)
    const totalAmount = Math.round((itemsTotal + shippingValue) * 100);

    const response = await fetch('https://sandbox.api.pagseguro.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAGBANK_TOKEN}`,
        'Content-Type': 'application/json',
        'x-idempotency-key': new Date().getTime().toString()
      },
      body: JSON.stringify({
        reference_id: new Date().getTime().toString(),
        customer: {
          email: customer.email.toLowerCase(),
          name: customer.name,
          tax_id: taxId,
          phones: [{
            type: 'MOBILE',
            country: '55',
            area: phone.area,
            number: phone.number
          }]
        },
        items: [
          // Produtos
          ...items.map((item: any) => ({
            reference_id: item.Produto?.toString(),
            name: item.Descricao,
            quantity: item.Quantidade || 1,
            unit_amount: Math.round((item.PrecoPromocional || item.Preco || 0) * 100)
          })),
          // Frete como item (apenas se houver valor)
          ...(shippingValue > 0 ? [{
            reference_id: 'shipping',
            name: 'Frete',
            quantity: 1,
            unit_amount: Math.round(shippingValue * 100)
          }] : [])
        ],
        shipping: {
          address: {
            street: shipping.street,
            number: shipping.number,
            complement: shipping.complement || '',
            locality: shipping.neighborhood,
            city: shipping.city,
            region_code: shipping.state,
            country: 'BRA',
            postal_code: shipping.zipcode.replace(/\D/g, '')
          }
        },
        charges: [{
          amount: {
            value: totalAmount,
            currency: 'BRL'
          },
          payment_method: {
            type: 'CREDIT_CARD',
            installments: payment.installments,
            capture: true,
            card: {
              number: payment.card.number.replace(/\D/g, ''),
              exp_month: payment.card.expMonth,
              exp_year: payment.card.expYear,
              security_code: payment.card.securityCode,
              holder: {
                name: payment.card.holder
              }
            }
          }
        }]
      })
    });

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const data = await response.json();

    if (data.id) {
      // Criar pedido no ecommerce após pagamento confirmado
      const pedidoEcommerce = {
        Empresa: 1,
        DataEmissao: formatDate(today),
        ValorProdutos: itemsTotal,
        ValorDesconto: 0,
        ValorFrete: shippingValue,
        OutrasDespesas: 0,
        ValorPedido: totalAmount / 100, // Converter de centavos para reais
        ClienteNome: customer.name,
        CPF: customer.cpf.length === 11 ? customer.cpf : "",
        CNPJ: customer.cpf.length === 14 ? customer.cpf : "",
        IE: "",
        Fone: customer.phone,
        DataPrevEntrega: formatDate(sevenDaysFromNow),
        TipoFrete: shippingValue > 0 ? 3 : 1,
        CodTransportador: shippingValue > 0 ? 1 : 0,
        NomeTransportador: shippingValue > 0 ? "CONSUMIDOR" : "",
        Endereco: {
          Nome: customer.name,
          Endereco: shipping.street,
          Numero: shipping.number,
          Complemento: shipping.complement || "",
          Bairro: shipping.neighborhood,
          Cidade: shipping.city,
          UF: shipping.state,
          CEP: shipping.zipcode
        },
        Itens: items.map((item: any, index: number) => ({
          Item: index + 1,
          Produto: item.Produto,
          Descricao: item.Descricao,
          Quantidade: item.Quantidade,
          Unidade: item.Unidade || "UN",
          ValorUnitario: item.PrecoPromocional || item.Preco || 0,
          IdListaCasamento: 0
        })),
        Pagamento: [{
          QtdeParcela: payment.installments,
          Valor: totalAmount / 100,
          CodCartao: 1,
          BandeiraCartao: "CREDITO",
          NrAutorizacao: data.charges[0]?.id || "",
          NSU: data.charges[0]?.payment_response?.reference || "",
          TXID: data.id,
          endToEndID: data.charges[0]?.payment_method?.card?.id || ""
        }]
      };

      console.log(pedidoEcommerce);

      // Pegar token dos cookies
      const cookieStore = cookies();
      const token = cookieStore.get('token')?.value;

      const pedidoResponse = await fetch('https://pedidoexterno.mcnsistemas.net.br/api/pedidoecommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(pedidoEcommerce)
      });

      // console.log(await pedidoResponse.json());

      if (!pedidoResponse.ok) {
        console.error('Erro pedido:', await pedidoResponse.text());
        throw new Error('Erro ao salvar pedido');
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro detalhado:', error);
    return NextResponse.json({ error: 'Erro ao processar pagamento', details: (error as Error).message }, { status: 500 });
  }
}