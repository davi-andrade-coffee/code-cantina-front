export type AdminStatus = 'ATIVO' | 'BLOQUEADO';

export interface Admin {
  id: string;
  nome: string;
  razaoSocial: string;
  email: string;
  documento: string;
  lojasTotal: number;
  lojasAtivas: number;
  status: AdminStatus;
  ultimoPagamento: string;
  plano: string;
  inadimplente: boolean;
  criadoEm: string;
}

export interface AdminInsights {
  total: number;
  ativos: number;
  bloqueados: number;
  receitaEstimadaMes: number;
  inadimplentes: number;
  inadimplenciaPercentual: number;
  novosPorMes: Array<{ mes: string; total: number }>;
}

export interface AdminFilters {
  termo: string;
  status: AdminStatus | 'TODOS';
  somenteInadimplentes: boolean;
}

export interface AdminBillingResumo {
  lojasAtivasMes: number;
  valorCalculado: number;
  statusFaturaMes: string;
  competencia: string;
}
