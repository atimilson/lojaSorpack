import { NextResponse } from 'next/server';
import { postApiPedidoecommerce } from '@/api/generated/mCNSistemas';

export async function POST(request: Request) {
  try {
    const pedido = await request.json();
    const response = await postApiPedidoecommerce(pedido);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao salvar pedido:', error);
    return NextResponse.json({ error: 'Erro ao salvar pedido' }, { status: 500 });
  }
} 