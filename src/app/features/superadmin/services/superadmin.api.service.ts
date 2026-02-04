import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API_BASE_URL } from '../../../core/http/api.config';
import { Admin, AdminFilters, AdminStatus } from '../models/admin.model';
import { Store, StoreStatus } from '../models/store.model';

interface AdminListItem {
  id: string;
  name: string;
  email: string;
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
}

interface AdminDetailResponse {
  id: string;
  name: string;
  email: string;
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

  listAdmins(filters: AdminFilters): Observable<Admin[]> {
    let params = new HttpParams().set('page', '1').set('limit', '100');
    if (filters.termo) params = params.set('search', filters.termo);
    if (filters.status === 'ATIVO') params = params.set('isActive', 'true');
    if (filters.status === 'BLOQUEADO') params = params.set('isActive', 'false');

    return this.http
      .get<AdminListResponse>(`${API_BASE_URL}/superadmin/admins`, { params })
      .pipe(map((res) => res.items.map((item) => this.mapAdminListItem(item))));
  }

  getAdminById(adminId: string): Observable<Admin | undefined> {
    return this.http
      .get<AdminDetailResponse>(`${API_BASE_URL}/superadmin/admins/${adminId}`)
      .pipe(map((res) => this.mapAdminDetail(res)));
  }

  listAdminStores(adminId: string): Observable<Store[]> {
    return this.http
      .get<AdminDetailResponse>(`${API_BASE_URL}/superadmin/admins/${adminId}`)
      .pipe(map((res) => res.stores.map((store) => this.mapAdminStore(store, adminId))));
  }

  listStores(filters?: { termo?: string; status?: string; adminId?: string }): Observable<Store[]> {
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
    payload: { nome: string; codigo: string; mensalidade: number }
  ): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/superadmin/shops/${storeId}`, {
      name: payload.nome,
      cnpj: payload.codigo,
      monthlyValue: payload.mensalidade,
    });
  }

  private mapAdminListItem(item: AdminListItem): Admin {
    return {
      id: item.id,
      nome: item.name,
      razaoSocial: item.name,
      email: item.email,
      documento: '—',
      lojasTotal: item.storesTotal,
      lojasAtivas: item.storesActive,
      status: item.isActive ? 'ATIVO' : 'BLOQUEADO',
      ultimoPagamento: item.lastPayment ?? '—',
      plano: '—',
      inadimplente: item.defaulting,
      criadoEm: '—',
    };
  }

  private mapAdminDetail(item: AdminDetailResponse): Admin {
    return {
      id: item.id,
      nome: item.name,
      razaoSocial: item.name,
      email: item.email,
      documento: '—',
      lojasTotal: item.stores.length,
      lojasAtivas: item.stores.filter((store) => store.status === 'ACTIVE').length,
      status: item.isActive ? 'ATIVO' : 'BLOQUEADO',
      ultimoPagamento: item.lastPayment ?? '—',
      plano: '—',
      inadimplente: item.defaulting,
      criadoEm: '—',
    };
  }

  private mapAdminStore(store: AdminStoreItem, adminId: string): Store {
    return {
      id: store.id,
      adminId,
      nome: store.name,
      codigo: store.cnpj,
      mensalidade: store.monthlyValue,
      status: this.mapStoreStatus(store.status),
      criadoEm: '—',
      ultimoAcesso: store.lastPaymentAt ?? undefined,
    };
  }

  private mapShopListItem(item: ShopListItem): Store {
    return {
      id: item.id,
      adminId: item.admin.id,
      nome: item.name,
      codigo: item.cnpj,
      mensalidade: item.monthlyValue,
      status: this.mapStoreStatus(item.status),
      criadoEm: item.lastPayment ?? '—',
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
