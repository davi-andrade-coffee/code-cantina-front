export type CashSessionStatus = 'OPEN' | 'CLOSED';

export type CashSessionListItem = {
  id: string;
  code: string;
  terminalName: string;
  operatorName: string;
  openedAt: string;
  closedAt?: string;
  status: CashSessionStatus;
  openingBalanceCents: number;
  expectedCashCents?: number;
  closingCashCents?: number;
  differenceCents?: number;
};

export type CashSessionFilters = {
  startDate: string;
  endDate: string;
  status: 'ALL' | CashSessionStatus;
  terminal: string;
  operator: string;
  onlyDivergence: boolean;
  search: string;
};

export type CashSessionListResponse = {
  items: CashSessionListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
};

export type CashMovementType = 'WITHDRAWAL' | 'REINFORCEMENT';
export type CashPaymentMethod = 'CASH' | 'WALLET' | 'CONVENIO' | 'MIXED';

export type CashSessionDetail = {
  id: string;
  code: string;
  terminal: { id: string; name: string };
  operator: { id: string; name: string };
  openedAt: string;
  closedAt?: string;
  status: CashSessionStatus;
  summary: {
    openingBalanceCents: number;
    salesCashCents: number;
    salesOtherCents: number;
    reinforcementsCents: number;
    withdrawalsCents: number;
    expectedCashCents?: number;
    closingCashCents?: number;
    differenceCents?: number;
  };
  movements: Array<{
    id: string;
    type: CashMovementType;
    amountCents: number;
    createdAt: string;
    note?: string;
  }>;
  sales: Array<{
    id: string;
    code: string;
    createdAt: string;
    totalCents: number;
    paymentMethod: CashPaymentMethod;
    customerName?: string;
  }>;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatCurrency = (cents?: number): string => {
  if (cents === null || cents === undefined) {
    return '—';
  }
  return currencyFormatter.format(cents / 100);
};

export const formatDateTime = (value?: string): string => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleString('pt-BR');
};

export const formatDate = (value?: string): string => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleDateString('pt-BR');
};
