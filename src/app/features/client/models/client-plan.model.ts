export type PlanType = 'SALDO' | 'CONVENIO';
export type PlanStatus = 'ATIVO' | 'BLOQUEADO';

export interface ClientPlan {
  type: PlanType;
  status: PlanStatus;
  monthlyLimit?: number | null;
}
