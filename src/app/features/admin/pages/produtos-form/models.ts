export type ProdutoTipo = 'UNITARIO' | 'QUILO';

export interface ProdutoFormData {
  id?: string;
  nome: string;
  tipo: ProdutoTipo;
  descricao: string;
  precoCents: number | null;
  controleEstoque: boolean;
  quantidadeEstoque: number | null;
  ativo: boolean;
}

export interface ProdutoSavePayload {
  id?: string;
  nome: string;
  tipo: ProdutoTipo;
  descricao?: string;
  precoCents: number;
  controleEstoque: boolean;
  quantidadeEstoque?: number | null;
  ativo: boolean;
}

export type FieldErrors = Partial<Record<keyof ProdutoFormData, string>>;
