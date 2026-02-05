export type InvoiceStatus = 'EM_ABERTO' | 'PAGA' | 'VENCIDA' | 'CANCELADA';

export interface Invoice {
  id: string;
  adminId: string;
  adminNome: string;
  competencia: string;
  lojasAtivas: number;
  valor: number;
  vencimento: string;
  status: InvoiceStatus;
}

export interface InvoiceInsights {
  receitaMes: number;
  receitaEmAberto: number;
  inadimplenciaValor: number;
  inadimplenciaPercentual: number;
  receitaPorMes: Array<{ mes: string; valor: number }>;
  statusResumo: Array<{ status: InvoiceStatus; total: number }>;
}

export interface InvoiceFilters {
  competencia: string;
  status: InvoiceStatus | 'TODOS';
  termo: string;
  somenteVencidas: boolean;
}

export interface BillingOverview {
  receitaMes: number;
  receitaAno: number;
  adminsAtivos: number;
  lojasAtivas: number;
  taxaInadimplencia: number;
  crescimentoMensal: number;
  receitaMensal: Array<{ mes: string; valor: number }>;
  novosAdminsMensal: Array<{ mes: string; total: number }>;
  lojasAtivasMensal: Array<{ mes: string; total: number }>;
  inadimplenciaMensal: Array<{ mes: string; valor: number }>;
}
