export type AdminStatus = 'ATIVO' | 'BLOQUEADO';

export interface AdminEntity {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  lojasTotal: number;
  lojasAtivas: number;
  status: AdminStatus;
  ultimoPagamento: string;
  inadimplente: boolean;
}

export interface AdminFilters {
  termo: string;
  status: AdminStatus | 'TODOS';
}

export interface CreateAdminRequest {
  nome: string;
  email: string;
  telefone: string;
}
