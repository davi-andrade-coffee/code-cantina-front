import { ClientPlan } from './client-plan.model';

export interface DashboardBalance {
  amount: number;
  lastTopup: {
    date: string;
    amount: number;
  } | null;
}

export interface DashboardInvoice {
  competency: string;
  amount: number;
  status: 'EM_ABERTO' | 'QUITADO' | 'VENCIDO';
}

export interface DashboardConsumption {
  total: number;
  purchases: number;
  averageTicket?: number | null;
}

export interface DashboardPending {
  hasOverdue: boolean;
  message: string;
}

export interface DashboardSummary {
  plan: ClientPlan;
  balance?: DashboardBalance;
  invoice?: DashboardInvoice;
  consumption: DashboardConsumption;
  pending: DashboardPending;
}
