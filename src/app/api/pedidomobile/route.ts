import { NextResponse } from 'next/server';
import { PedidoDto, RetornoPedido } from '@/api/generated/mCNSistemas.schemas';

// URL base da API externa
const BASE_URL = 'https://pedidoexterno.mcnsistemas.net.br';

export async function POST(req: Request) {
  try {
    // Obter os dados do pedido enviados pelo cliente
    const pedidoData = await req.json() as PedidoDto;
    
    // Validar dados básicos obrigatórios
    if (pedidoData.Pedido === undefined || 
        pedidoData.Contrato === undefined ||
        pedidoData.Empresa === undefined ||
        pedidoData.Tipo === undefined) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }
    
    console.log('Enviando pedido para API externa:', pedidoData);
    
    // Obter token de autenticação
    let token = req.headers.get('authorization');
    
    // Se não houver token no cabeçalho, tentar autenticar
    if (!token) {
      try {
        const authResponse = await fetch(`${BASE_URL}/api/autenticacao/autenticar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Contrato: 540,
            Usuario: "ECOMMERCE",
            Senha: "123"
          })
        });
        
        const authData = await authResponse.json();
        
        if (authData.Token) {
          token = authData.Token;
        } else {
          throw new Error('Falha na autenticação');
        }
      } catch (authError: any) {
        console.error('Erro ao autenticar:', authError);
        return NextResponse.json(
          { error: 'Erro de autenticação', details: authError.message },
          { status: 401 }
        );
      }
    }
    
    // Enviar o pedido para a API externa
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = token;
      }
      
      const response = await fetch(`${BASE_URL}/api/pedidomobile`, {
        method: 'POST',
        headers,
        body: JSON.stringify(pedidoData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const resultado = await response.json() as RetornoPedido;
      
      console.log('Resposta da API externa:', resultado);

      const liberarSim = await fetch(`${BASE_URL}/api/pedidomobile/liberarsim`, {
        method: 'PUT',
        headers,
        body: JSON.stringify([
          {
            Pedido: resultado.Pedido || 0
          }
        ])
      });
      
      // Retornar o resultado da API externa
      return NextResponse.json({
        success: true,
        Pedido: resultado.Pedido || 0,
        LiberarSim: liberarSim.status === 200 || false,
        message: 'Pedido enviado com sucesso'
      });
    } catch (apiError: any) {
      console.error('Erro na API externa:', apiError);
      
      return NextResponse.json(
        { 
          error: 'Erro ao enviar pedido para API externa', 
          details: apiError.message || 'Sem detalhes disponíveis'
        },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Erro ao processar pedido:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno ao processar pedido',
        details: error.message || 'Sem detalhes disponíveis'
      },
      { status: 500 }
    );
  }
} 