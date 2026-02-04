import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { Admin, AdminFilters, AdminStatus } from '../../models/admin.model'
import { SuperAdminFacade, BusinessError } from '../../services/superadmin.facade';
import { CreateAdminModalComponent } from '../../components/modals/create-admin-modal.component';
import { PaginationComponent } from '../../components/pagination.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CreateAdminModalComponent,
    PaginationComponent,
  ],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminsListPage {
  private readonly facade = inject(SuperAdminFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly error = signal<{ title: string, message: string }>({ title: '', message: '' });
  adminsList = signal<Admin[]>([]);

  readonly filters = signal<AdminFilters>({
    searchTerm: '',
    status: AdminStatus.ALL,
    page: 1,
    pageSize: 8,  
  });

  readonly optionsSizePagination = [6, 8, 12, 16];
  readonly totalNumberAdmins = signal(10); // @ todo vem da api
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalNumberAdmins() / this.filters().pageSize))
  );

  readonly modalOpenRegistration = signal(false);

  constructor() {  
    this.search();
  }

  search(): void {
    this.loading.set(true);
    this.clearError();

    this.facade
      .listAdmins(this.filters())
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res) => {
          this.adminsList.set(res.items);
          this.totalNumberAdmins.set(res.total)
          this.patchFilter({ page: res.page });
        },
        error: (err: BusinessError) => {
          this.mapError(err)
        }
      });
  }

  patchFilter(patch: Partial<AdminFilters>): void {
    this.filters.update((current) => ({ ...current, ...patch }));
  }

  mapError(err: BusinessError) {
    if (err.code === 'INVALID_FILTER') {
      this.error.set({ title: 'Erro ao salvar o dado.', message: err.message });
    } else {
      this.error.set({ title: 'Erro ao carregar dados.', message: err.message });
    }
  }

  clearError(): void {
    this.error.set({ title: '', message: '' });
  }
  
  openRegistration(): void {
    this.modalOpenRegistration.set(true);
  }

  closeRegistration(): void {
    this.modalOpenRegistration.set(false);
  }

  confirmRegistration(payload: { name: string; email: string; }): void {
    // @todo loading o modal para criar
    this.facade
      .createAdmin(payload)
      .pipe(
        finalize(() => this.modalOpenRegistration.set(false)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          this.search();
        },
        error: (err: BusinessError) => {
          this.mapError(err)
        }
      });
    
  }

  toggleAdminStatus(admin: Admin, checked: boolean): void {
    this.facade
      .updateAdminStatus(admin.id, checked)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          if (!updated) return;
          this.adminsList.update((lista) =>
            lista.map((item) => {
              if (item.id === admin.id) item.isActive = checked
              return item
            })
          );
        },
        error: (err: BusinessError) => {
          this.mapError(err)
        }
   });
  }
}
