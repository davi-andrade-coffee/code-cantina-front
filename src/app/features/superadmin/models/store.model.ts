import { BillingOverview } from './invoice.model';


export enum StoreStatus {
  ACTIVE,
  BLOCKED,
  OVERDUE,
}

export enum StoreBlockReason {
  NONE,
  ADMIN,
  MANUAL,
  OVERDUE,
}

export interface Store {
  id: string;
  name: string;
  cnpj: string;
  monthlyValue: number;
  status: StoreStatus;
  blockedReason: StoreBlockReason;
  lastPaymentAt: Date;
  latestBilling?: BillingOverview
}

export interface StoreInsights {
  totalAtivas: number;
  totalBloqueadas: number;
  totalCanceladas: number;
  topAdmins: Array<{ admin: string; total: number }>;
  bloqueadasPorInadimplencia: number;
}
