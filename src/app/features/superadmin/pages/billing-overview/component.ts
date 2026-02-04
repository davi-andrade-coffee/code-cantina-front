// @ts-nocheck
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BillingOverview } from '../../models/invoice.model';
import { SuperAdminFacade } from '../../services/superadmin.facade';
import { KpiCardComponent } from '../../components/kpi-card.component';

@Component({
  standalone: true,
  imports: [CommonModule, KpiCardComponent],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingOverviewPage {
  private readonly facade = inject(SuperAdminFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly overview = signal<BillingOverview | null>(null);
  readonly errorMsg = signal<string | null>(null);

  constructor() {
    this.facade
      .getBillingOverview()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (overview) => this.overview.set(overview),
        error: () => this.errorMsg.set('Falha ao carregar visão consolidada.'),
      });
  }

  formatPercent(value?: number | null): string {
    if (value === null || value === undefined) {
      return '—';
    }
    return `${value.toFixed(1)}%`;
  }
}
