export type CashSessionStatus = 'OPEN' | 'CLOSED';

export interface CashSession {
  id: string;
  terminalId: string;
  operatorId: string;
  openedAt: string;
  openingBalance: number;
  status: CashSessionStatus;
  closedAt?: string;
  countedBalance?: number;
  closingNote?: string;
}
