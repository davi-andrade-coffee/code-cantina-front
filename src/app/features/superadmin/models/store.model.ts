export type {
  CreateStoreRequest,
  StoreEntity,
  StoreFilters,
  StoreStatus,
  UpdateStoreRequest,
} from './store.entity';

import type { StoreEntity } from './store.entity';

export type Store = StoreEntity;

export interface StoreInsights {
  totalAtivas: number;
  totalBloqueadas: number;
  totalCanceladas: number;
  topAdmins: Array<{ admin: string; total: number }>;
  bloqueadasPorInadimplencia: number;
}
