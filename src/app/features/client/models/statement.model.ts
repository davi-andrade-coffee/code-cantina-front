export interface StatementSummary {
  clientName: string;
  planLabel: string;
  balance?: number;
  periodConsumption: number;
}

export interface StatementEntryDetailItem {
  name: string;
  quantity: number;
  price: number;
}

export interface StatementEntry {
  id: string;
  dateTime: string;
  origin: string;
  description: string;
  amount: number;
  balanceAfter?: number | null;
  type: 'COMPRA' | 'RECARGA' | 'AJUSTE';
  detail?: {
    items: StatementEntryDetailItem[];
    paymentMethod: string;
    operator: string;
    terminal: string;
    notes?: string | null;
  };
}
