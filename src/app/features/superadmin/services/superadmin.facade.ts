import { Injectable, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ApiError } from '../../../core/http/api.model';

import { Admin, AdminCreate, AdminFilters, AdminStatus } from '../models/admin.model'
import { SuperadminSource } from './superadmin.service';

// import { BillingMockService } from './billing.mock.service';

export interface BusinessError {
  code: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class SuperAdminFacade {
  private readonly superadminSource = inject(SuperadminSource);
  // private readonly billingSource = inject(BillingMockService);

  private mapBusinessError(err: ApiError, message?: string): BusinessError {
    switch (err.status) {
      case 400:
        return { code: 'INVALID_FILTER', message: err.message || 'Filtros inválidos.' }

      // case 404:
      //   return { code: 'NOT_FOUND', message: 'Nenhum admin encontrado.' };

      default:
        return { code: 'GENERIC', message: message || 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  listAdmins(filters: AdminFilters) {
    return this.superadminSource.listAdmins(filters).pipe(
      catchError((err: ApiError) => {
        return throwError(() => this.mapBusinessError(err));
      })
    );
  }

  getAdminById(id: string) {
    return this.superadminSource.getAdminById(id).pipe(
      catchError((err: ApiError) => {
        return throwError(() => this.mapBusinessError(err));
      })
    );
  }

  createAdmin(payload: AdminCreate) {
    return this.superadminSource.createAdmin(payload).pipe(
      catchError((err: ApiError) => {
        return throwError(() => this.mapBusinessError(err, 'Erro interno ao criar. Tente novamente mais tarde.'));
      })
    );
  }

  updateAdminStatus(adminId: string, blocked: boolean) {
    return this.superadminSource.updateAdminStatus(adminId, blocked);
  }

  // updateStoreStatus(storeId: string, status: StoreStatus) {
  //   return this.superadminSource.updateStoreStatus(storeId, status);
  // }

  // updateStore(storeId: string, payload: { nome: string; codigo: string; mensalidade: number }) {
  //   return this.superadminSource.updateStore(storeId, payload);
  // }

  // getAdminInsights(): ReturnType<SuperAdminMockService['getAdminInsights']> {
  //   return this.superadminSource.getAdminInsights();
  // }

  // listStores(filters?: { termo?: string; status?: string; adminId?: string }) {
  //   return this.superadminSource.listStores(filters);
  // }

  // listAdminStores(adminId: string) {
  //   return this.superadminSource.listAdminStores(adminId);
  // }

  // getStoreInsights() {
  //   return this.superadminSource.getStoreInsights();
  // }

  // getAdminBillingResumo(adminId: string): ReturnType<SuperAdminMockService['getAdminBillingResumo']> {
  //   return this.superadminSource.getAdminBillingResumo(adminId);
  // }

  // listInvoices(filters: InvoiceFilters) {
  //   return this.billingSource.listInvoices(filters);
  // }

  // getInvoiceInsights(): ReturnType<BillingMockService['getInvoiceInsights']> {
  //   return this.billingSource.getInvoiceInsights();
  // }

  // getBillingOverview(): ReturnType<BillingMockService['getBillingOverview']> {
  //   return this.billingSource.getBillingOverview();
  // }
}
