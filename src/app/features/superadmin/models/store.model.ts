export type StoreStatus = 'ATIVA' | 'BLOQUEADA' | 'CANCELADA';

export interface Store {
  id: string;
  adminId: string;
  nome: string;
  codigo: string;
  mensalidade: number;
  status: StoreStatus;
  criadoEm: string;
  ultimoAcesso?: string;
}

export interface StoreInsights {
  totalAtivas: number;
  totalBloqueadas: number;
  totalCanceladas: number;
  topAdmins: Array<{ admin: string; total: number }>;
  bloqueadasPorInadimplencia: number;
}
