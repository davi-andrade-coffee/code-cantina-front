import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API_BASE_URL } from '../../../core/http/api.config';
import { BillingOverview, Invoice, InvoiceFilters, InvoiceStatus } from '../models/invoice.model';

interface BillingItem {
  id: string;
  referenceMonth: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paidAt: string | null;
  store: {
    id: string;
    name: string;
    document: string;
    admin: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
    };
  };
}

interface BillingListResponse {
  page: number;
  limit: number;
  total: number;
  items: BillingItem[];
}


interface KpiResponse {
  current: {
    revenue: number;
    accumulatedRevenue: number;
    activeAdmins: number;
    activeStores: number;
    defaultRate: number;
    monthlyGrowth: number;
  };
  history: {
    revenuePerMonth: Array<{ month: string; value: number }>;
    newAdminsPerMonth: Array<{ month: string; value: number }>;
    activeStoresPerMonth: Array<{ month: string; value: number }>;
    defaultRatePerMonth: Array<{ month: string; value: number }>;
  };
}

@Injectable({ providedIn: 'root' })
export class BillingApiService {
  constructor(private http: HttpClient) {}

  listInvoices(filters: InvoiceFilters): Observable<Invoice[]> {
    let params = new HttpParams().set('page', '1').set('limit', '100');

    if (filters.competencia) {
      const normalized = this.normalizeCompetencia(filters.competencia);
      if (normalized) params = params.set('month', normalized);
    }

    const status = filters.somenteVencidas ? 'VENCIDA' : filters.status;
    if (status && status !== 'TODOS') {
      params = params.set('status', this.mapStatusToApi(status as InvoiceStatus));
    }

    return this.http
      .get<BillingListResponse>(`${API_BASE_URL}/superadmin/billings`, { params })
      .pipe(
        map((res) => res.items.map((item) => this.mapBillingItem(item))),
        map((items) => this.filterInvoices(items, filters.termo))
      );
  }



  getBillingOverview(): Observable<BillingOverview> {
    return this.http
      .get<KpiResponse>(`${API_BASE_URL}/superadmin/kpis`)
      .pipe(map((res) => this.mapKpisToOverview(res)));
  }

  private mapBillingItem(item: BillingItem): Invoice {
    return {
      id: item.id,
      adminId: item.store.admin.id,
      adminNome: item.store.admin.name,
      competencia: this.formatCompetencia(item.referenceMonth),
      lojasAtivas: 1,
      valor: item.amount,
      vencimento: item.dueDate,
      status: this.mapStatusFromApi(item.status),
    };
  }



  private mapKpisToOverview(payload: KpiResponse): BillingOverview {
    return {
      receitaMes: payload.current.revenue,
      receitaAno: payload.current.accumulatedRevenue,
      adminsAtivos: payload.current.activeAdmins,
      lojasAtivas: payload.current.activeStores,
      taxaInadimplencia: payload.current.defaultRate,
      crescimentoMensal: payload.current.monthlyGrowth,
      receitaMensal: payload.history.revenuePerMonth.map((item) => ({
        mes: item.month,
        valor: item.value,
      })),
      novosAdminsMensal: payload.history.newAdminsPerMonth.map((item) => ({
        mes: item.month,
        total: item.value,
      })),
      lojasAtivasMensal: payload.history.activeStoresPerMonth.map((item) => ({
        mes: item.month,
        total: item.value,
      })),
      inadimplenciaMensal: payload.history.defaultRatePerMonth.map((item) => ({
        mes: item.month,
        valor: item.value,
      })),
    };
  }

  private mapStatusFromApi(status: BillingItem['status']): InvoiceStatus {
    switch (status) {
      case 'PAID':
        return 'PAGA';
      case 'OVERDUE':
        return 'VENCIDA';
      default:
        return 'EM_ABERTO';
    }
  }

  private mapStatusToApi(status: InvoiceStatus): BillingItem['status'] {
    switch (status) {
      case 'PAGA':
        return 'PAID';
      case 'VENCIDA':
        return 'OVERDUE';
      default:
        return 'PENDING';
    }
  }

  private normalizeCompetencia(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const match = trimmed.match(/^(\d{2})\/(\d{4})$/);
    if (!match) return trimmed;
    return `${match[2]}-${match[1]}`;
  }

  private formatCompetencia(value: string): string {
    const match = value.match(/^(\d{4})-(\d{2})$/);
    if (!match) return value;
    return `${match[2]}/${match[1]}`;
  }

  private filterInvoices(items: Invoice[], termo: string): Invoice[] {
    const filtro = termo.trim().toLowerCase();
    if (!filtro) return items;
    return items.filter(
      (item) =>
        item.adminNome.toLowerCase().includes(filtro) ||
        item.adminId.toLowerCase().includes(filtro)
    );
  }
}
