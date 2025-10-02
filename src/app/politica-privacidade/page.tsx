'use client';

import { Header } from "@/components/Header";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="text-sm">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="text-primary hover:text-primary-dark">Home</Link></li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900">Política de Privacidade</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
            
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Informações Gerais</h2>
                <p>
                  A presente Política de Privacidade contém informações sobre coleta, uso, armazenamento, 
                  tratamento e proteção dos dados pessoais dos usuários e visitantes do site Construcerto, 
                  com a finalidade de demonstrar absoluta transparência quanto ao assunto e esclarecer a todos 
                  interessados sobre os tipos de dados que são coletados, os motivos da coleta e a forma como 
                  os usuários podem gerenciar ou excluir as suas informações pessoais.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Coleta de Dados</h2>
                <p>Os dados pessoais coletados podem incluir:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Nome completo</li>
                  <li>Email</li>
                  <li>Telefone</li>
                  <li>Endereço</li>
                  <li>CPF ou CNPJ</li>
                  <li>Dados de navegação</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Uso dos Dados</h2>
                <p>Os dados coletados são utilizados para:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Processar pedidos e transações</li>
                  <li>Enviar atualizações sobre pedidos</li>
                  <li>Fornecer suporte ao cliente</li>
                  <li>Enviar comunicações de marketing (mediante autorização)</li>
                  <li>Melhorar nossos produtos e serviços</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Proteção de Dados</h2>
                <p>
                  Utilizamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais 
                  contra perda, uso indevido ou alteração não autorizada. Todos os dados são armazenados em 
                  servidores seguros e seguem os padrões rigorosos de segurança da informação.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
                <p>
                  Utilizamos cookies para melhorar a experiência de navegação do usuário. Cookies são pequenos 
                  arquivos de texto que são armazenados no seu dispositivo quando você visita nosso site. Eles 
                  nos ajudam a lembrar suas preferências e entender como você interage com nosso site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Direitos do Usuário</h2>
                <p>O usuário tem direito a:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos ou inexatos</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Revogar o consentimento para processamento de dados</li>
                  <li>Solicitar a portabilidade dos dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contato</h2>
                <p>
                  Para exercer seus direitos ou esclarecer dúvidas sobre nossa Política de Privacidade, 
                  entre em contato conosco através dos seguintes canais:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Email: [email de contato]</li>
                  <li>Telefone: [telefone de contato]</li>
                  <li>Endereço: [endereço físico]</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Alterações na Política</h2>
                <p>
                  Reservamos o direito de modificar esta Política de Privacidade a qualquer momento. 
                  Recomendamos que você revise esta página periodicamente para se manter informado sobre 
                  eventuais alterações.
                </p>
                <p className="mt-2">
                  Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Construcerto. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
} 