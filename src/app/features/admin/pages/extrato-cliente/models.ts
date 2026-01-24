export type PessoaTipo = 'ALUNO' | 'PROFESSOR' | 'OUTRO';
export type PlanoTipo = 'CONVENIO' | 'PRE_PAGO' | 'SALDO';
export type TipoMovimento = 'CONSUMO' | 'CARGA' | 'PAGAMENTO';
export type FormaPagamento = 'SALDO' | 'DINHEIRO' | 'CONVENIO';

export interface PessoaExtrato {
  id: string;
  nome: string;
  tipo: PessoaTipo;
  responsavel?: string;
  documento: string;
  plano: PlanoTipo;
  saldoAtual: number;
}

export interface Movimentacao {
  id: string;
  pessoaId: string;
  dataHora: string;
  origem: string;
  descricao: string;
  valor: number;
  saldoApos: number;
  tipo: TipoMovimento;
  terminal: string;
  operador: string;
  produto: string;
  formaPagamento: FormaPagamento;
  observacao?: string;
}

export interface ExtratoFiltro {
  pessoaId: string;
  dataInicio: string;
  dataFim: string;
  tipoMovimento: 'TODOS' | TipoMovimento;
  texto: string;
}
