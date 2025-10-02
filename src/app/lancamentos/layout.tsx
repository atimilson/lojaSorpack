import { WhatsAppButton } from '@/components/WhatsAppButton';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lançamentos | Sorpack Embalagens',
  description: 'Confira os novos produtos da Sorpack. Produtos recém chegados e últimos lançamentos em embalagens.',
  keywords: 'lançamentos, novos produtos, embalagens, produtos novos, últimos lançamentos, sorpack',
};

export default function LancamentosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   return (
   <AuthProvider>
          <CartProvider>
            {children}
            <WhatsAppButton />

          </CartProvider>
        </AuthProvider>
  );

} 