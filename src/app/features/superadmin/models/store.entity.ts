export type StoreStatus = 'ATIVA' | 'BLOQUEADA' | 'CANCELADA';

export interface StoreEntity {
  id: string;
  adminId: string;
  nome: string;
  cnpj: string;
  mensalidade: number;
  status: StoreStatus;
  criadoEm: string;
  vencimento: number;
}

export interface StoreFilters {
  termo?: string;
  status?: string;
  adminId?: string;
}

export interface CreateStoreRequest {
  adminId: string;
  nome: string;
  cnpj: string;
  mensalidade: number;
  vencimento: number;
}

export interface UpdateStoreRequest {
  nome: string;
  cnpj: string;
  mensalidade: number;
  vencimento: number;
}
