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

export enum BillingStatus {
  PENDING,
  PAID,
  OVERDUE
}

export interface BillingOverview {
  id: string;
  status: BillingStatus;
  referenceMonth: string;
  dueDate: Date;
  paidAt: Date;
  amount: number;
}

