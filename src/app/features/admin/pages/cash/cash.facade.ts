import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { CashDatasource } from './cash.datasource';
import { CashSessionDetail, CashSessionFilters, CashSessionListItem } from './cash.models';

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

@Injectable()
export class CashFacade {
  private readonly datasource = inject(CashDatasource);
  private readonly destroyRef = inject(DestroyRef);

  readonly filters = signal<CashSessionFilters>(this.defaultFilters());
  readonly sessions = signal<CashSessionListItem[]>([]);

  readonly loadingList = signal(false);
  readonly errorList = signal<string | null>(null);

  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly totalItems = signal(0);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));

  readonly detail = signal<CashSessionDetail | null>(null);
  readonly loadingDetail = signal(false);
  readonly errorDetail = signal<string | null>(null);
  readonly detailOpen = computed(
    () => this.loadingDetail() || this.errorDetail() !== null || this.detail() !== null
  );

  constructor() {
    this.loadSessions();
  }

  updateFilters(patch: Partial<CashSessionFilters>): void {
    this.filters.update((current) => ({ ...current, ...patch }));
  }

  buscar(): void {
    this.page.set(1);
    this.loadSessions();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.page.set(page);
    this.loadSessions();
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
    this.loadSessions();
  }

  openDetail(sessionId: string): void {
    this.loadingDetail.set(true);
    this.errorDetail.set(null);
    this.detail.set(null);

    this.datasource
      .getSessionDetail(sessionId)
      .pipe(
        finalize(() => this.loadingDetail.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (detail) => this.detail.set(detail),
        error: () => this.errorDetail.set('Falha ao carregar detalhes da sessão.'),
      });
  }

  closeDetail(): void {
    this.detail.set(null);
    this.errorDetail.set(null);
    this.loadingDetail.set(false);
  }

  private loadSessions(): void {
    this.loadingList.set(true);
    this.errorList.set(null);

    this.datasource
      .listSessions(this.filters(), this.page(), this.pageSize())
      .pipe(
        finalize(() => this.loadingList.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          this.sessions.set(response.items);
          this.totalItems.set(response.totalItems);
          this.page.set(response.page);
          this.pageSize.set(response.pageSize);
        },
        error: () => this.errorList.set('Falha ao carregar sessões de caixa.'),
      });
  }

  private defaultFilters(): CashSessionFilters {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);

    return {
      startDate: toDateInput(start),
      endDate: toDateInput(end),
      status: 'ALL',
      terminal: 'ALL',
      operator: 'ALL',
      onlyDivergence: false,
      search: '',
    };
  }
}
