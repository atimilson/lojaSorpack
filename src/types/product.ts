import { ProdutosEcommerceDto } from '@/api/generated/mCNSistemas.schemas';

export type Product = ProdutosEcommerceDto;

export interface ProductImage {
  URL: string;
}

export interface ProductProps {
  Contrato?: number;
  Produto: number;
  Preco: number;
  PrecoPromocional: number;
  Descricao: string;
  Estoque: number;
  Categoria: string;
  DescCategoria?: string;
  Marca: string;
  DescMarca?: string;
  Complemento?: string;
  Grupo: string;
  SubGrupo: string;
  DescEcommerce: string;
  Observacao: string;
  Imagens: ProductImage[];
  Alteracao: string;
} 