import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { LicencaService } from './service';
import { LicencaInfo, LicencaStatus } from './models';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicencaPage {
  private readonly service = inject(LicencaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly licenca = signal<LicencaInfo | null>(null);

  readonly statusLabel = computed(() => {
    const status = this.licenca()?.status;
    switch (status) {
      case 'VALIDA':
        return 'Licença válida';
      case 'TOLERANCIA':
        return 'Em período de tolerância';
      case 'EXPIRADA':
        return 'Licença expirada';
      default:
        return 'Status indisponível';
    }
  });

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.service
      .obterLicenca()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (info) => this.licenca.set(info),
        error: () => this.errorMsg.set('Não foi possível carregar os dados da licença.'),
      });
  }

  statusBadge(status: LicencaStatus): string {
    switch (status) {
      case 'VALIDA':
        return 'badge badge-success badge-sm';
      case 'TOLERANCIA':
        return 'badge badge-warning badge-sm';
      case 'EXPIRADA':
        return 'badge badge-error badge-sm';
      default:
        return 'badge badge-ghost badge-sm';
    }
  }

  formatDate(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
