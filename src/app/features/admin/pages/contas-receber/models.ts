export type PessoaTipo = 'ALUNO' | 'PROFESSOR' | 'OUTRO';
export type PlanoTipo = 'CONVENIO' | 'PRE_PAGO';
export type StatusRecebivel = 'EM_ABERTO' | 'QUITADO' | 'VENCIDO';

export interface Recebivel {
  id: string;
  pessoaNome: string;
  pessoaTipo: PessoaTipo;
  planoTipo: PlanoTipo;
  responsavel?: string;
  documento: string;
  registro: string;
  competencia: string;
  valorDevido: number;
  valorPago: number;
  status: StatusRecebivel;
  ultimaCobranca: string;
}

export interface FiltroRecebiveis {
  competencia: string;
  status: 'TODOS' | StatusRecebivel;
  tipoPessoa: 'TODOS' | PessoaTipo;
  tipoPlano: 'TODOS' | PlanoTipo;
  termo: string;
  somenteInadimplentes: boolean;
}

export interface EvolucaoRecebimentoItem {
  label: string;
  valor: number;
}
