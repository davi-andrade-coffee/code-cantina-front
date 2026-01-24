import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { Admin, AdminStatus } from '../../models/admin.model';
import { Store } from '../../models/store.model';
import { SuperAdminFacade } from '../../services/superadmin.facade';
import { CreateStoreModalComponent } from '../../components/modals/create-store-modal.component';
import { StatusBadgeComponent } from '../../components/status-badge.component';
import { TableCardComponent } from '../../components/table-card.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CreateStoreModalComponent,
    StatusBadgeComponent,
    TableCardComponent,
  ],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDetailPage {
  private readonly facade = inject(SuperAdminFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly admin = signal<Admin | null>(null);
  readonly stores = signal<Store[]>([]);
  readonly modalLojaAberto = signal(false);

  constructor() {
    this.carregarDetalhes();
  }

  carregarDetalhes(): void {
    const adminId = this.route.snapshot.paramMap.get('adminId');
    if (!adminId) {
      this.errorMsg.set('Admin não encontrado.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    this.facade
      .getAdminById(adminId)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (admin) => this.admin.set(admin ?? null),
        error: () => this.errorMsg.set('Falha ao carregar dados do Admin.'),
      });

    this.facade
      .listAdminStores(adminId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (stores) => this.stores.set(stores),
        error: () => this.errorMsg.set('Falha ao carregar lojas vinculadas.'),
      });
  }

  abrirNovaLoja(): void {
    this.modalLojaAberto.set(true);
  }

  fecharNovaLoja(): void {
    this.modalLojaAberto.set(false);
  }

  confirmarNovaLoja(): void {
    this.modalLojaAberto.set(false);
  }

  toggleAdminStatus(ativo: boolean): void {
    const admin = this.admin();
    if (!admin) return;
    const status: AdminStatus = ativo ? 'ATIVO' : 'BLOQUEADO';
    this.facade
      .updateAdminStatus(admin.id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          if (!updated) return;
          this.admin.set(updated);
        },
        error: () => this.errorMsg.set('Não foi possível atualizar o status do Admin.'),
      });
  }
}
