export type StatusVenda = 'CONCLUIDA' | 'CANCELADA' | 'ESTORNADA';
export type FormaPagamento = 'SALDO' | 'DINHEIRO' | 'CONVENIO';

export interface ItemVenda {
  id: string;
  vendaId: string;
  produto: string;
  quantidade: number;
  valorUnitario: number;
  total: number;
}

export interface Venda {
  id: string;
  dataHora: string;
  terminal: string;
  operador: string;
  cliente?: string;
  registroCliente?: string;
  total: number;
  formaPagamento: FormaPagamento;
  itens: ItemVenda[];
  status: StatusVenda;
  caixaId: string;
}

export interface VendaFiltro {
  dataInicio: string;
  dataFim: string;
  terminal: 'TODOS' | string;
  operador: 'TODOS' | string;
  formaPagamento: 'TODOS' | FormaPagamento;
  produto: string;
  cliente: string;
  status: 'TODOS' | StatusVenda;
}
