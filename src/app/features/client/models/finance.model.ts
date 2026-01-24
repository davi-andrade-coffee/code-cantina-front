export type InvoiceStatus = 'EM_ABERTO' | 'QUITADO' | 'VENCIDO';

export interface FinanceSummary {
  planType: 'SALDO' | 'CONVENIO';
  balance?: number;
  currentInvoice?: {
    competency: string;
    amount: number;
    dueDate: string;
    status: InvoiceStatus;
  };
}

export interface InvoiceHistoryItem {
  id: string;
  type: 'INVOICE';
  competency: string;
  total: number;
  dueDate: string;
  status: InvoiceStatus;
  paidAt?: string | null;
}

export interface WalletTransactionItem {
  id: string;
  type: 'TRANSACTION';
  date: string;
  movement: 'RECARGA' | 'ESTORNO' | 'AJUSTE';
  amount: number;
  status: 'CONCLUIDA' | 'PENDENTE' | 'FALHOU';
}

export type FinanceHistoryItem = InvoiceHistoryItem | WalletTransactionItem;
