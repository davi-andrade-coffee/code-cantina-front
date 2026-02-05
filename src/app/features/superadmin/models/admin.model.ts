export type {
  AdminEntity,
  AdminFilters,
  AdminStatus,
  CreateAdminRequest,
} from './admin.entity';

import type { AdminEntity } from './admin.entity';

export type Admin = AdminEntity;

export interface AdminInsights {
  total: number;
  ativos: number;
  bloqueados: number;
  receitaEstimadaMes: number;
  inadimplentes: number;
  inadimplenciaPercentual: number;
  novosPorMes: Array<{ mes: string; total: number }>;
}

export interface AdminBillingResumo {
  lojasAtivasMes: number;
  valorCalculado: number;
  statusFaturaMes: string;
  competencia: string;
}
