import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API_BASE_URL } from '../../../core/http/api.config';
import {
  AdminEntity,
  AdminFilters,
  AdminStatus,
  CreateAdminRequest,
} from '../models/admin.model';
import {
  CreateStoreRequest,
  StoreEntity,
  StoreFilters,
  StoreStatus,
  UpdateStoreRequest,
} from '../models/store.model';

interface AdminListItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  defaulting: boolean;
  lastPayment: string | null;
  storesTotal: number;
  storesActive: number;
}

interface AdminListResponse {
  page: number;
  limit: number;
  total: number;
  items: AdminListItem[];
}

interface AdminStoreItem {
  id: string;
  name: string;
  cnpj: string;
  monthlyValue: number;
  status: 'ACTIVE' | 'BLOCKED' | 'OVERDUE';
  blockedReason: 'NONE' | 'ADMIN' | 'MANUAL' | 'OVERDUE';
  lastPaymentAt: string | null;
  latestBilling?: {
    dueDate?: number | null;
  };
}

interface AdminDetailResponse {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  userIsActive: boolean;
  defaulting: boolean;
  lastPayment: string | null;
  stores: AdminStoreItem[];
}

interface ShopListItem {
  id: string;
  name: string;
  cnpj: string;
  monthlyValue: number;
  billingDueDay: number;
  status: 'ACTIVE' | 'BLOCKED' | 'OVERDUE';
  blockedReason: 'NONE' | 'ADMIN' | 'MANUAL' | 'OVERDUE';
  lastPayment: string | null;
  daysOverdue: number;
  admin: {
    id: string;
    name: string;
    email: string;
  };
}

interface ShopListResponse {
  page: number;
  limit: number;
  total: number;
  items: ShopListItem[];
}

@Injectable({ providedIn: 'root' })
export class SuperAdminApiService {
  constructor(private http: HttpClient) {}

  listAdmins(filters: AdminFilters): Observable<AdminEntity[]> {
    let params = new HttpParams().set('page', '1').set('limit', '100');
    if (filters.termo) params = params.set('search', filters.termo);
    if (filters.status === 'ATIVO') params = params.set('isActive', 'true');
    if (filters.status === 'BLOQUEADO') params = params.set('isActive', 'false');

    return this.http
      .get<AdminListResponse>(`${API_BASE_URL}/superadmin/admins`, { params })
      .pipe(map((res) => res.items.map((item) => this.mapAdminListItem(item))));
  }

  getAdminById(adminId: string): Observable<AdminEntity | undefined> {
    return this.http
      .get<AdminDetailResponse>(`${API_BASE_URL}/superadmin/admins/${adminId}`)
      .pipe(map((res) => this.mapAdminDetail(res)));
  }

  listAdminStores(adminId: string): Observable<StoreEntity[]> {
    return this.http
      .get<AdminDetailResponse>(`${API_BASE_URL}/superadmin/admins/${adminId}`)
      .pipe(map((res) => res.stores.map((store) => this.mapAdminStore(store, adminId))));
  }

  listStores(filters?: StoreFilters): Observable<StoreEntity[]> {
    let params = new HttpParams().set('page', '1').set('limit', '100');
    if (filters?.termo) params = params.set('search', filters.termo);
    if (filters?.adminId) params = params.set('adminId', filters.adminId);
    if (filters?.status === 'ATIVA') params = params.set('status', 'ACTIVE');
    if (filters?.status === 'BLOQUEADA') params = params.set('status', 'BLOCKED');
    if (filters?.status === 'CANCELADA') params = params.set('status', 'BLOCKED');

    return this.http
      .get<ShopListResponse>(`${API_BASE_URL}/superadmin/shops`, { params })
      .pipe(map((res) => res.items.map((item) => this.mapShopListItem(item))));
  }

  updateAdminStatus(adminId: string, status: AdminStatus): Observable<void> {
    return this.http.patch<void>(`${API_BASE_URL}/superadmin/admins/${adminId}/block`, {
      blocked: status === 'BLOQUEADO',
    });
  }

  updateStoreStatus(storeId: string, status: StoreStatus): Observable<void> {
    return this.http.patch<void>(`${API_BASE_URL}/superadmin/shops/${storeId}/block`, {
      blocked: status !== 'ATIVA',
    });
  }

  updateStore(
    storeId: string,
    payload: UpdateStoreRequest
  ): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/superadmin/shops/${storeId}`, this.mapUpdateStoreRequest(payload));
  }

  createAdmin(payload: CreateAdminRequest): Observable<{ adminId: string }> {
    return this.http.post<{ adminId: string }>(`${API_BASE_URL}/superadmin/admins`, this.mapCreateAdminRequest(payload));
  }

  createStore(payload: CreateStoreRequest): Observable<{ shopId: string }> {
    return this.http.post<{ shopId: string }>(`${API_BASE_URL}/superadmin/shops`, this.mapCreateStoreRequest(payload));
  }


  private mapCreateAdminRequest(payload: CreateAdminRequest): { name: string; email: string; phone: string } {
    return {
      name: payload.nome,
      email: payload.email,
      phone: payload.telefone,
    };
  }

  private mapCreateStoreRequest(payload: CreateStoreRequest): {
    adminId: string;
    name: string;
    cnpj: string;
    monthlyValue: number;
    billingDueDay: number;
  } {
    return {
      adminId: payload.adminId,
      name: payload.nome,
      cnpj: payload.cnpj,
      monthlyValue: payload.mensalidade,
      billingDueDay: payload.vencimento,
    };
  }

  private mapUpdateStoreRequest(payload: UpdateStoreRequest): {
    name: string;
    cnpj: string;
    monthlyValue: number;
    billingDueDay: number;
  } {
    return {
      name: payload.nome,
      cnpj: payload.cnpj,
      monthlyValue: payload.mensalidade,
      billingDueDay: payload.vencimento,
    };
  }

  private mapAdminListItem(item: AdminListItem): AdminEntity {
    return {
      id: item.id,
      nome: item.name,
      email: item.email,
      telefone: item.phone ?? '',
      lojasTotal: item.storesTotal,
      lojasAtivas: item.storesActive,
      status: item.isActive ? 'ATIVO' : 'BLOQUEADO',
      ultimoPagamento: item.lastPayment ?? '—',
      inadimplente: item.defaulting,
    };
  }

  private mapAdminDetail(item: AdminDetailResponse): AdminEntity {
    return {
      id: item.id,
      nome: item.name,
      email: item.email,
      telefone: item.phone ?? '',
      lojasTotal: item.stores.length,
      lojasAtivas: item.stores.filter((store) => store.status === 'ACTIVE').length,
      status: item.isActive ? 'ATIVO' : 'BLOQUEADO',
      ultimoPagamento: item.lastPayment ?? '—',
      inadimplente: item.defaulting,
    };
  }

  private mapAdminStore(store: AdminStoreItem, adminId: string): StoreEntity {
    return {
      id: store.id,
      adminId,
      nome: store.name,
      cnpj: store.cnpj,
      mensalidade: store.monthlyValue,
      status: this.mapStoreStatus(store.status),
      criadoEm: '—',
      vencimento: store.latestBilling?.dueDate ?? 1,
    };
  }

  private mapShopListItem(item: ShopListItem): StoreEntity {
    return {
      id: item.id,
      adminId: item.admin.id,
      nome: item.name,
      cnpj: item.cnpj,
      mensalidade: item.monthlyValue,
      status: this.mapStoreStatus(item.status),
      criadoEm: item.lastPayment ?? '—',
      vencimento: item.billingDueDay,
    };
  }

  private mapStoreStatus(status: AdminStoreItem['status']): StoreStatus {
    switch (status) {
      case 'ACTIVE':
        return 'ATIVA';
      case 'BLOCKED':
        return 'BLOQUEADA';
      case 'OVERDUE':
        return 'BLOQUEADA';
      default:
        return 'CANCELADA';
    }
  }
}
