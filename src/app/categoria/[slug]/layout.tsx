import { Metadata } from "next";
import { useCategorie } from "@/hooks/useCategorie";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Aqui você pode fazer uma chamada à API para buscar os detalhes da categoria
  // Por enquanto vamos retornar um título genérico
  return {
    title: `Categoria ${params.slug} | Construcerto`,
    description: "Encontre os melhores produtos na Construcerto",
  };
}

export default function CategoryLayout({
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
