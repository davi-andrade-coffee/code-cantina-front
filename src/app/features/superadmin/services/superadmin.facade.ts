import { Injectable, inject } from '@angular/core';

import { AdminFilters, AdminStatus } from '../models/admin.model';
import { InvoiceFilters } from '../models/invoice.model';
import { SuperAdminMockService } from './superadmin.mock.service';
import { BillingMockService } from './billing.mock.service';

@Injectable({ providedIn: 'root' })
export class SuperAdminFacade {
  private readonly superadminSource = inject(SuperAdminMockService);
  private readonly billingSource = inject(BillingMockService);
  // Troque o provider acima por um serviço HTTP real quando integrar com API.

  listAdmins(filters: AdminFilters) {
    return this.superadminSource.listAdmins(filters);
  }

  getAdminById(adminId: string) {
    return this.superadminSource.getAdminById(adminId);
  }

  updateAdminStatus(adminId: string, status: AdminStatus) {
    return this.superadminSource.updateAdminStatus(adminId, status);
  }

  getAdminInsights(): ReturnType<SuperAdminMockService['getAdminInsights']> {
    return this.superadminSource.getAdminInsights();
  }

  listStores(filters?: { termo?: string; status?: string; adminId?: string }) {
    return this.superadminSource.listStores(filters);
  }

  listAdminStores(adminId: string) {
    return this.superadminSource.listAdminStores(adminId);
  }

  getStoreInsights() {
    return this.superadminSource.getStoreInsights();
  }

  getAdminBillingResumo(adminId: string): ReturnType<SuperAdminMockService['getAdminBillingResumo']> {
    return this.superadminSource.getAdminBillingResumo(adminId);
  }

  listInvoices(filters: InvoiceFilters) {
    return this.billingSource.listInvoices(filters);
  }

  getInvoiceInsights(): ReturnType<BillingMockService['getInvoiceInsights']> {
    return this.billingSource.getInvoiceInsights();
  }

  getBillingOverview(): ReturnType<BillingMockService['getBillingOverview']> {
    return this.billingSource.getBillingOverview();
  }
}
