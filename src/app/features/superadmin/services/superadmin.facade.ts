import { Injectable, inject } from '@angular/core';

import { AdminFilters, AdminStatus, CreateAdminRequest } from '../models/admin.model';
import { CreateStoreRequest, StoreFilters, StoreStatus, UpdateStoreRequest } from '../models/store.model';
import { InvoiceFilters } from '../models/invoice.model';
import { SuperAdminApiService } from './superadmin.api.service';
import { BillingApiService } from './billing.api.service';

@Injectable({ providedIn: 'root' })
export class SuperAdminFacade {
  private readonly superadminSource = inject(SuperAdminApiService);
  private readonly billingSource = inject(BillingApiService);

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

  updateStore(storeId: string, payload: UpdateStoreRequest) {
    return this.superadminSource.updateStore(storeId, payload);
  }

  createAdmin(payload: CreateAdminRequest) {
    return this.superadminSource.createAdmin(payload);
  }

  createStore(payload: CreateStoreRequest) {
    return this.superadminSource.createStore(payload);
  }

  listStores(filters?: StoreFilters) {
    return this.superadminSource.listStores(filters);
  }

  listAdminStores(adminId: string) {
    return this.superadminSource.listAdminStores(adminId);
  }

  listInvoices(filters: InvoiceFilters) {
    return this.billingSource.listInvoices(filters);
  }

  getBillingOverview() {
    return this.billingSource.getBillingOverview();
  }
}
