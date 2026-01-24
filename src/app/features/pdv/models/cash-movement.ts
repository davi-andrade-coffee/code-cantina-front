export type CashMovementType = 'SANGRIA' | 'REFORCO';

export interface CashMovement {
  id: string;
  sessionId: string;
  type: CashMovementType;
  amount: number;
  note?: string;
  createdAt: string;
}
