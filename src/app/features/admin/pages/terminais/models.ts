export type TerminalStatus = 'TODOS' | 'ATIVOS' | 'INATIVOS';

export interface TerminalPdv {
  id: string;
  codigo: string;
  nome: string;
  portaBalanca: string;
  impressoraFiscal: string;
  imprimeCupom: boolean;
  previewCupom: boolean;
  modoOffline: boolean;
  ativo: boolean;
}

export interface TerminaisFiltro {
  termo: string;
  status: TerminalStatus;
  somenteAtivos: boolean;
}
