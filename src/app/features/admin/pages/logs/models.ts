export type LogCategoria =
  | 'VENDA_FINALIZADA'
  | 'ABERTURA_CAIXA'
  | 'FECHAMENTO_CAIXA'
  | 'CADASTRO_COLABORADOR'
  | 'CADASTRO_PESSOA'
  | 'CADASTRO_TERMINAL'
  | 'CADASTRO_PRODUTO'
  | 'AJUDA_COLABORADOR'
  | 'AJUSTE_PESSOA'
  | 'AJUSTE_TERMINAL'
  | 'AJUSTE_PRODUTO'
  | 'PAGAMENTO_CONVENIO'
  | 'ADICAO_SALDO';

export type LogCategoriaFiltro = 'TODOS' | LogCategoria;

export interface LogRegistro {
  id: string;
  dataHora: string;
  categoria: LogCategoria;
  operador: string;
  terminal: string;
  descricao: string;
  referencia: string;
  origem: string;
  ip: string;
}

export interface LogFiltro {
  dataInicio: string;
  dataFim: string;
  categoria: LogCategoriaFiltro;
  operador: string;
  terminal: string;
  termo: string;
}
