import { Injectable, inject } from '@angular/core';

import { AdminFilters, AdminStatus } from '../models/admin.model';
import { StoreStatus } from '../models/store.model';
import { InvoiceFilters } from '../models/invoice.model';
import { SuperAdminMockService } from './superadmin.mock.service';
import { BillingMockService } from './billing.mock.service';
import { SuperAdminApiService } from './superadmin.api.service';
import { BillingApiService } from './billing.api.service';

@Injectable({ providedIn: 'root' })
export class SuperAdminFacade {
  private readonly superadminSource = inject(SuperAdminApiService);
  private readonly superadminMock = inject(SuperAdminMockService);
  private readonly billingSource = inject(BillingApiService);
  private readonly billingMock = inject(BillingMockService);

  listAdmins(filters: AdminFilters) {
    return this.superadminSource.listAdmins(filters);
  }

  getAdminById(adminId: string) {
    return this.superadminSource.getAdminById(adminId);
  }

  updateAdminStatus(adminId: string, status: AdminStatus) {
    return this.superadminSource.updateAdminStatus(adminId, status);
  }

  updateStoreStatus(storeId: string, status: StoreStatus) {
    return this.superadminSource.updateStoreStatus(storeId, status);
  }

  updateStore(storeId: string, payload: { nome: string; codigo: string; mensalidade: number }) {
    return this.superadminSource.updateStore(storeId, payload);
  }

  getAdminInsights(): ReturnType<SuperAdminMockService['getAdminInsights']> {
    return this.superadminMock.getAdminInsights();
  }

  listStores(filters?: { termo?: string; status?: string; adminId?: string }) {
    return this.superadminSource.listStores(filters);
  }

  listAdminStores(adminId: string) {
    return this.superadminSource.listAdminStores(adminId);
  }

  getStoreInsights() {
    return this.superadminMock.getStoreInsights();
  }

  getAdminBillingResumo(adminId: string): ReturnType<SuperAdminMockService['getAdminBillingResumo']> {
    return this.superadminMock.getAdminBillingResumo(adminId);
  }

  listInvoices(filters: InvoiceFilters) {
    return this.billingSource.listInvoices(filters);
  }

  getInvoiceInsights(): ReturnType<BillingMockService['getInvoiceInsights']> {
    return this.billingMock.getInvoiceInsights();
  }

  getBillingOverview(): ReturnType<BillingMockService['getBillingOverview']> {
    return this.billingMock.getBillingOverview();
  }
}
