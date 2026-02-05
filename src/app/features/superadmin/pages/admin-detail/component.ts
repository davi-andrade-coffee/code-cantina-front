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
import { NotificationService } from '../../../../core/ui/notification.service';

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
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly admin = signal<Admin | null>(null);
  readonly stores = signal<Store[]>([]);
  readonly submitting = signal(false);
  readonly pendingAdminStatusById = signal<Record<string, boolean>>({});
  readonly pendingStoreStatusById = signal<Record<string, boolean>>({});
  readonly modalLojaAberto = signal(false);
  readonly modalLojaModo = signal<'CRIAR' | 'EDITAR'>('CRIAR');
  readonly lojaSelecionada = signal<Store | null>(null);

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
    this.modalLojaModo.set('CRIAR');
    this.lojaSelecionada.set(null);
    this.modalLojaAberto.set(true);
  }

  abrirEditarLoja(store: Store): void {
    this.modalLojaModo.set('EDITAR');
    this.lojaSelecionada.set(store);
    this.modalLojaAberto.set(true);
  }

  fecharNovaLoja(): void {
    this.modalLojaAberto.set(false);
    this.lojaSelecionada.set(null);
  }

  confirmarNovaLoja(payload?: {
    id?: string | null;
    nome: string;
    cnpj: string;
    mensalidade: number;
    vencimento: number;
  }): void {
    const adminId = this.admin()?.id;
    if (!payload) {
      return;
    }

    this.submitting.set(true);

    if (payload.id) {
      this.facade
        .updateStore(payload.id, {
          nome: payload.nome,
          cnpj: payload.cnpj,
          mensalidade: payload.mensalidade,
          vencimento: payload.vencimento,
        })
        .pipe(
          finalize(() => this.submitting.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: () => {
            this.stores.update((lista) =>
              lista.map((item) =>
                item.id === payload.id
                  ? {
                      ...item,
                      nome: payload.nome,
                      cnpj: payload.cnpj,
                      mensalidade: payload.mensalidade,
                      vencimento: payload.vencimento,
                    }
                  : item
              )
            );
            this.notificationService.success('Store updated successfully.');
            this.modalLojaAberto.set(false);
            this.lojaSelecionada.set(null);
          },
          error: () => this.notificationService.error('Failed to update store.'),
        });
    } else if (payload && adminId) {
      this.facade
        .createStore({
          adminId,
          nome: payload.nome,
          cnpj: payload.cnpj,
          mensalidade: payload.mensalidade,
          vencimento: payload.vencimento,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.carregarDetalhes();
            this.notificationService.success('Store created successfully.');
          },
          error: () => this.notificationService.error('Failed to create store.'),
        });
    }

    if (!adminId) {
      this.submitting.set(false);
      return;
    }

    this.facade
      .createStore({
        adminId,
        nome: payload.nome,
        cnpj: payload.cnpj,
        mensalidade: payload.mensalidade,
        vencimento: payload.vencimento,
      })
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.modalLojaAberto.set(false);
          this.lojaSelecionada.set(null);
          this.carregarDetalhes();
        },
        error: () => this.errorMsg.set('Não foi possível cadastrar a loja.'),
      });
  }

  toggleStoreStatus(store: Store, ativo: boolean): void {
    const status = ativo ? 'ATIVA' : 'BLOQUEADA';
    this.setPendingStoreStatus(store.id, true);

    this.facade
      .updateStoreStatus(store.id, status)
      .pipe(
        finalize(() => this.setPendingStoreStatus(store.id, false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.stores.update((lista) =>
            lista.map((item) => (item.id === store.id ? { ...item, status } : item))
          );
          this.notificationService.success(
            ativo ? 'Store unlocked successfully.' : 'Store blocked successfully.'
          );
        },
        error: () => this.notificationService.error('Failed to update store status.'),
      });
  }

  toggleAdminStatus(ativo: boolean): void {
    const admin = this.admin();
    if (!admin) return;
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
          this.admin.set({ ...admin, status });
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

  private setPendingStoreStatus(storeId: string, pending: boolean): void {
    this.pendingStoreStatusById.update((state) => {
      if (pending) {
        return { ...state, [storeId]: true };
      }

      const { [storeId]: _, ...rest } = state;
      return rest;
    });
  }
}
