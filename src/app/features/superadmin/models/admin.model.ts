import { Store } from './store.model'

// export interface AdminInsights {
//   total: number;
//   ativos: number;
//   bloqueados: number;
//   receitaEstimadaMes: number;
//   inadimplentes: number;
//   inadimplenciaPercentual: number;
//   novosPorMes: Array<{ mes: string; total: number }>;
// }

// export interface AdminBillingResumo {
//   lojasAtivasMes: number;
//   valorCalculado: number;
//   statusFaturaMes: string;
//   competencia: string;
// }

export enum AdminStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated', 
  ALL = 'all'
}

export interface AdminFilters {
  searchTerm: string;
  status: AdminStatus;
  page: number;     
  pageSize: number;  
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  defaulting: boolean;
  lastPayment?: Date;
  storesTotal: number;
  storesActive: number;
}

export interface AdminCreate {
  name: string,
  email: string
}

export interface AdminListPageResult {
  items: Admin[];
  total: number;     
  page: number;
  pageSize: number;
}


export interface AdminDetail {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  userIsActive: boolean;
  defaulting: boolean; // inadiaplcentes ou n~ao
  lastPayment: Date;
  stores: Store[]
}
