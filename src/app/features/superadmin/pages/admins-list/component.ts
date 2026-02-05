import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { Admin, AdminFilters, AdminStatus, CreateAdminRequest } from '../../models/admin.model';
import { SuperAdminFacade } from '../../services/superadmin.facade';
import { CreateAdminModalComponent } from '../../components/modals/create-admin-modal.component';
import { PaginationComponent } from '../../components/pagination.component';
import { StatusBadgeComponent } from '../../components/status-badge.component';
import { NotificationService } from '../../../../core/ui/notification.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CreateAdminModalComponent,
    PaginationComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminsListPage {
  private readonly facade = inject(SuperAdminFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly admins = signal<Admin[]>([]);
  readonly submitting = signal(false);
  readonly pendingAdminStatusById = signal<Record<string, boolean>>({});

  readonly filtros = signal<AdminFilters>({
    termo: '',
    status: 'TODOS',
  });

  readonly tamanhosPagina = [6, 8, 12, 16];
  readonly paginaAtual = signal(1);
  readonly itensPorPagina = signal(8);

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.admins().length / this.itensPorPagina()))
  );

  readonly paginaAdmins = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina();
    return this.admins().slice(inicio, inicio + this.itensPorPagina());
  });

  readonly modalCadastroAberto = signal(false);

  constructor() {
    this.buscar();
  }

  buscar(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.facade
      .listAdmins(this.filtros())
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (admins) => {
          this.admins.set(admins);
          this.paginaAtual.set(1);
        },
        error: () => this.errorMsg.set('Não foi possível carregar os Admins.'),
      });
  }

  patchFiltro(patch: Partial<AdminFilters>): void {
    this.filtros.update((atual) => ({ ...atual, ...patch }));
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.patchFiltro({ termo: target?.value ?? '' });
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    this.patchFiltro({ status: (target?.value as AdminFilters['status']) ?? 'TODOS' });
  }

  onAdminStatusChange(admin: Admin, event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.toggleAdminStatus(admin, target?.checked ?? false);
  }

  alterarPagina(pagina: number): void {
    this.paginaAtual.set(pagina);
  }

  setItensPorPagina(valor: number): void {
    this.itensPorPagina.set(valor);
    this.paginaAtual.set(1);
  }

  abrirCadastro(): void {
    this.modalCadastroAberto.set(true);
  }

  fecharCadastro(): void {
    this.modalCadastroAberto.set(false);
  }

  confirmarCadastro(payload: CreateAdminRequest): void {
    this.submitting.set(true);
    this.facade
      .createAdmin(payload)
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.modalCadastroAberto.set(false);
          this.buscar();
          this.notificationService.success('Admin created successfully.');
        },
        error: () => this.notificationService.error('Failed to create admin.'),
      });
  }

  toggleAdminStatus(admin: Admin, ativo: boolean): void {
    const status: AdminStatus = ativo ? 'ATIVO' : 'BLOQUEADO';
    this.setPendingAdminStatus(admin.id, true);

    this.facade
      .updateAdminStatus(admin.id, status)
      .pipe(
        finalize(() => this.setPendingAdminStatus(admin.id, false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.admins.update((lista) =>
            lista.map((item) => (item.id === admin.id ? { ...item, status } : item))
          );
          this.notificationService.success(
            ativo ? 'Admin unlocked successfully.' : 'Admin blocked successfully.'
          );
        },
        error: () => this.notificationService.error('Failed to update admin status.'),
      });
  }

  private setPendingAdminStatus(adminId: string, pending: boolean): void {
    this.pendingAdminStatusById.update((state) => {
      if (pending) {
        return { ...state, [adminId]: true };
      }

      const { [adminId]: _, ...rest } = state;
      return rest;
    });
  }
}
