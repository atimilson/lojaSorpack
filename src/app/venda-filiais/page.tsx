'use client'

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGetApiEmpresa } from '@/api/generated/mCNSistemas';
import type { EmpresaDto as Empresa } from '@/api/generated/mCNSistemas.schemas';
import Image from "next/image";
import { Header } from "@/components/Header";
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  AtSymbolIcon,
} from '@heroicons/react/24/outline';

export default function NossasLojasPage() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();

  const { data: empresas = [], error: apiError, isLoading } = useGetApiEmpresa({
    empresa: 0
  }, {
    swr: {
      enabled: !isAuthLoading && !authError
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Banner Principal */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 text-center">Nossas Lojas</h1>
            <p className="text-center text-lg opacity-90 max-w-2xl mx-auto">
              Encontre a loja mais próxima de você e venha nos conhecer
            </p>
          </div>
        </div>

        {/* Lista de Empresas */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {empresas.map((empresa) => (
                <div 
                  key={empresa.Empresa}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Cabeçalho com Logo */}
                  <div className="p-6 bg-gray-50 border-b flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={`data:image/png;base64,${empresas[0].LogoMarca}`}
                        alt={empresa.Fantasia || ''}
                        fill
                        unoptimized={true}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{empresa.Fantasia || ''}</h2>
                      <p className="text-gray-600">{empresa.RazaoSocial || ''}</p>
                    </div>
                  </div>


                  {/* Informações */}
                  <div className="p-6 space-y-6">
                    {/* Endereço */}
                    <div className="flex gap-4">
                      <MapPinIcon className="w-6 h-6 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Endereço</h3>
                        <p className="text-gray-600">
                          {empresa.Endereco}, {empresa.Numero}
                          {empresa.Complemento && ` - ${empresa.Complemento}`}
                          <br />
                          {empresa.Bairro}
                          <br />
                          {empresa.Cidade} - {empresa.UF}
                          <br />
                          CEP: {empresa.CEP}
                        </p>
                      </div>
                    </div>

                    {/* Contatos */}
                    <div className="flex gap-4">
                      <PhoneIcon className="w-6 h-6 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Telefones</h3>
                        <p className="text-gray-600">
                          {empresa.Fone1}
                          {empresa.Fone2 && <><br />{empresa.Fone2}</>}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex gap-4">
                      <EnvelopeIcon className="w-6 h-6 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">E-mail</h3>
                        <p className="text-gray-600">{empresa.Email}</p>
                      </div>
                    </div>

                    {/* CNPJ/IE
                    <div className="flex gap-4">
                      <DocumentTextIcon className="w-6 h-6 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Documentos</h3>
                        <p className="text-gray-600">
                          CNPJ: {empresa.CNPJ}
                          <br />
                          IE: {empresa.IE}
                        </p>
                      </div>
                    </div> */}
                  </div>

                  {/* Mapa */}
                  {/* Mapa usando OpenStreetMap */}
                  {/* <div className="h-[300px] w-full border-t">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
                        `${empresa.Endereco}, ${empresa.Numero}, ${empresa.Cidade}, ${empresa.UF}, Brasil`
                      )}&layer=mapnik`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full"
                    ></iframe>
                    <div className="p-2 bg-gray-50 text-sm text-center">
                      <a 
                        href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(
                          `${empresa.Endereco}, ${empresa.Numero}, ${empresa.Cidade}, ${empresa.UF}, Brasil`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark"
                      >
                        Ver mapa maior
                      </a>
                    </div>
                  </div> */}
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 