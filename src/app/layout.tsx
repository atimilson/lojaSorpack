import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'react-hot-toast';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sorpack Embalagens - O Atacadão das Embalagens | Mato Grosso e Mato Grosso do Sul",
  description: "Distribuidora especializada em embalagens descartáveis e produtos para food service. Atendemos todo Mato Grosso e Mato Grosso do Sul com os melhores preços do mercado. Mais de 10.000 produtos em estoque!",
  keywords: "embalagens, descartáveis, food service, atacado, embalagens plásticas, sacolas, copos descartáveis, talheres, marmitas, sorpack, cuiabá, campo grande",
  authors: [{ name: "Sorpack Embalagens" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Sorpack Embalagens - O Atacadão das Embalagens",
    description: "Distribuidora de embalagens e descartáveis para food service. Atendemos Mato Grosso e Mato Grosso do Sul com qualidade e os melhores preços.",
    type: "website",
    locale: "pt_BR",
    siteName: "Sorpack Embalagens",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sorpack Embalagens - O Atacadão das Embalagens",
    description: "Distribuidora especializada em embalagens e produtos descartáveis para food service",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 overflow-x-hidden`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <WhatsAppButton />
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(31, 41, 55, 0.95)',
                  backdropFilter: 'blur(16px)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '1rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                },
                success: {
                  iconTheme: {
                    primary: '#ff6b35',
                    secondary: '#fff',
                  },
                  style: {
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                  style: {
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
                  },
                },
                loading: {
                  iconTheme: {
                    primary: '#ff6b35',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// Configurar cache compartilhado
export const revalidate = 3600; // Cache global de 1 hora
