export type ProdutoTipo = 'UNITARIO' | 'QUILO';
export type ProdutoStatus = 'TODOS' | 'ATIVOS' | 'INATIVOS';

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  tipo: ProdutoTipo;
  ativo: boolean;
  precoCents: number;
  controleEstoque: boolean;
  quantidadeEstoque: number | null;
}

export interface ProdutosFiltro {
  termo: string;
  tipo: ProdutoTipo | 'TODOS';
  status: ProdutoStatus;
  somenteAtivos: boolean;
}
