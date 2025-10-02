export interface CartItem {
  Produto?: number;
  Descricao?: string;
  Quantidade?: number;
  Preco?: number;
  PrecoPromocional?: number;
  Peso?: number | string;
  Espessura?: number | string;
  Largura?: number | string;
  Altura?: number | string;
  Comprimento?: number | string;
  Volume?: number | string;
  Imagens?: any[];
  quantity?: number;
} 