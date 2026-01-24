export type LogCategoria =
  | 'CADASTRO_LOJA'
  | 'CADASTRO_ADMIN'
  | 'BLOQUEIO_LOJA'
  | 'DESBLOQUEIO_LOJA'
  | 'BLOQUEIO_ADMIN'
  | 'DESBLOQUEIO_ADMIN'
  | 'PAGAMENTO_BOLETO';

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
  termo: string;
}
