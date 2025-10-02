'use client';

import { Header } from "@/components/Header";
import Link from "next/link";

export default function TermsPage() {
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
                <li className="text-gray-900">Termos de Uso</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos de Uso</h1>
            
            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Termos</h2>
                <p>
                  Ao acessar o site Construcerto, você concorda em cumprir estes termos de serviço, 
                  todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento 
                  de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está 
                  proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos 
                  pelas leis de direitos autorais e marcas comerciais aplicáveis.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Uso de Licença</h2>
                <p>
                  É concedida permissão para baixar temporariamente uma cópia dos materiais (informações 
                  ou software) no site Construcerto, apenas para visualização transitória pessoal e 
                  não comercial. Esta é a concessão de uma licença, não uma transferência de título e, 
                  sob esta licença, você não pode:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Modificar ou copiar os materiais;</li>
                  <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública;</li>
                  <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site;</li>
                  <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais;</li>
                  <li>Transferir os materiais para outra pessoa ou 'espelhar' os materiais em qualquer outro servidor.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Isenção de responsabilidade</h2>
                <ul className="list-decimal pl-6 space-y-3">
                  <li>
                    Os materiais no site da Construcerto são fornecidos 'como estão'. Não oferecemos 
                    garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras 
                    garantias.
                  </li>
                  <li>
                    Além disso, a Construcerto não garante ou faz qualquer representação relativa à 
                    precisão, aos resultados prováveis ou à confiabilidade do uso dos materiais em seu site.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Limitações</h2>
                <p>
                  Em nenhum caso a Construcerto ou seus fornecedores serão responsáveis por quaisquer 
                  danos decorrentes do uso ou da incapacidade de usar os materiais em nosso site, mesmo 
                  que a Construcerto ou um representante autorizado tenha sido notificado oralmente 
                  ou por escrito da possibilidade de tais danos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Precisão dos materiais</h2>
                <p>
                  Os materiais exibidos no site da Construcerto podem incluir erros técnicos, 
                  tipográficos ou fotográficos. Não garantimos que qualquer material em nosso site seja 
                  preciso, completo ou atual. Podemos fazer alterações nos materiais contidos em nosso 
                  site a qualquer momento, sem aviso prévio.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Links</h2>
                <p>
                  A Construcerto não analisou todos os sites vinculados ao seu site e não é 
                  responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não 
                  implica endosso pela Construcerto do site. O uso de qualquer site vinculado é por 
                  conta e risco do usuário.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Modificações</h2>
                <p>
                  A Construcerto pode revisar estes termos de serviço do site a qualquer momento, 
                  sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual 
                  desses termos de serviço.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Lei aplicável</h2>
                <p>
                  Estes termos e condições são regidos e interpretados de acordo com as leis do Brasil e 
                  você se submete irrevogavelmente à jurisdição exclusiva dos tribunais neste estado.
                </p>
                <p className="mt-4 text-sm text-gray-500">
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