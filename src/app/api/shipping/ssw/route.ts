import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { cepDestino, peso, volume, altura, largura, comprimento, quantidade, total } = await request.json();
 
  const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope 

      xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
      xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <soapenv:Body>
        <ns1:cotar xmlns:ns1="urn:sswinfbr.sswCotacao" 
          soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
          <dominio xsi:type="xsd:string">OTC</dominio>
          <login xsi:type="xsd:string">n.casa</login>
          <senha xsi:type="xsd:string">180</senha>
          <cnpjPagador xsi:type="xsd:string">01645302000180</cnpjPagador>
          <cepOrigem xsi:type="xsd:integer">78070090</cepOrigem>
          <cepDestino xsi:type="xsd:integer">${cepDestino.replace(/\D/g, '')}</cepDestino>
          <valorNF xsi:type="xsd:decimal">${total}</valorNF>
          <quantidade xsi:type="xsd:integer">${quantidade}</quantidade>
          <peso xsi:type="xsd:decimal">${peso}</peso>
          <volume xsi:type="xsd:decimal">${volume}</volume>
          <mercadoria xsi:type="xsd:integer">1</mercadoria>
          <cnpjDestinatario xsi:type="xsd:string"></cnpjDestinatario>
          <coletar xsi:type="xsd:string">N</coletar>
          <entDificil xsi:type="xsd:string">N</entDificil>
          <destContribuinte xsi:type="xsd:string">N</destContribuinte>
          <qtdePares xsi:type="xsd:integer">0</qtdePares>
          <altura xsi:type="xsd:decimal">${altura}</altura>
          <largura xsi:type="xsd:decimal">${largura}</largura>
          <comprimento xsi:type="xsd:decimal">${comprimento}</comprimento>
          <fatorMultiplicador xsi:type="xsd:integer">1</fatorMultiplicador>
        </ns1:cotar>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await fetch('https://ssw.inf.br/ws/sswCotacao/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'urn:sswinfbr.sswCotacao#cotar'
      },
      body: xmlBody
    });

    const data = await response.text();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao calcular frete SSW' }, { status: 500 });
  }
} 