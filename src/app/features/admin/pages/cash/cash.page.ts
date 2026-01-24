import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CashDatasource } from './cash.datasource';
import { CashDetailModalComponent } from './cash.detail-modal.component';
import { CashFacade } from './cash.facade';
import { CashFiltersComponent, SelectOption } from './cash.filters.component';
import { CashMockService } from './cash.mock.service';
import { CashTableComponent } from './cash.table.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CashFiltersComponent,
    CashTableComponent,
    CashDetailModalComponent,
  ],
  providers: [CashFacade, { provide: CashDatasource, useClass: CashMockService }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-6">
      <header>
        <h1 class="text-lg font-semibold">Caixa</h1>
        <p class="text-sm opacity-70">
          Listagem e auditoria de ciclos de caixa por terminal/operador
        </p>
      </header>

      <app-cash-filters
        [filters]="facade.filters()"
        [terminals]="terminais"
        [operators]="operadores"
        (filtersChange)="facade.updateFilters($event)"
        (submit)="facade.buscar()"
      />

      <div *ngIf="facade.errorList()" class="alert alert-error">
        <span>{{ facade.errorList() }}</span>
      </div>

      <app-cash-table
        [sessions]="facade.sessions()"
        [loading]="facade.loadingList()"
        (openDetail)="facade.openDetail($event)"
      />

      <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
        <div class="text-sm opacity-70">
          Página {{ facade.page() }} de {{ facade.totalPages() }} •
          {{ facade.totalItems() }} sessões
        </div>

        <div class="flex items-center gap-2">
          <button
            class="btn btn-outline btn-sm"
            type="button"
            (click)="facade.changePage(facade.page() - 1)"
            [disabled]="facade.page() === 1"
          >
            Anterior
          </button>
          <button
            class="btn btn-outline btn-sm"
            type="button"
            (click)="facade.changePage(facade.page() + 1)"
            [disabled]="facade.page() === facade.totalPages()"
          >
            Próxima
          </button>
          <select
            class="select select-bordered select-sm"
            [value]="facade.pageSize()"
            (change)="changePageSize($event)"
          >
            <option *ngFor="let size of pageSizes" [value]="size">
              {{ size }} por página
            </option>
          </select>
        </div>
      </div>
    </div>

    <app-cash-detail-modal
      [open]="facade.detailOpen()"
      [detail]="facade.detail()"
      [loading]="facade.loadingDetail()"
      [error]="facade.errorDetail()"
      (close)="facade.closeDetail()"
    />
  `,
})
export class CashPage {
  readonly facade = inject(CashFacade);

  readonly pageSizes = [10, 20];

  readonly terminais: SelectOption[] = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Terminal 01', value: 'Terminal 01' },
    { label: 'Terminal 02', value: 'Terminal 02' },
    { label: 'Terminal 03', value: 'Terminal 03' },
    { label: 'Terminal 04', value: 'Terminal 04' },
  ];

  readonly operadores: SelectOption[] = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Camila Rocha', value: 'Camila Rocha' },
    { label: 'Rafael Lima', value: 'Rafael Lima' },
    { label: 'Maria Santos', value: 'Maria Santos' },
    { label: 'Igor Silva', value: 'Igor Silva' },
    { label: 'Larissa Costa', value: 'Larissa Costa' },
    { label: 'Bruno Alves', value: 'Bruno Alves' },
    { label: 'Marina Lopes', value: 'Marina Lopes' },
    { label: 'Carla Mendes', value: 'Carla Mendes' },
    { label: 'Paulo Souza', value: 'Paulo Souza' },
    { label: 'Fernanda Alves', value: 'Fernanda Alves' },
    { label: 'Helena Dias', value: 'Helena Dias' },
    { label: 'Joana Ferreira', value: 'Joana Ferreira' },
  ];

  changePageSize(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isNaN(value)) {
      this.facade.changePageSize(value);
    }
  }
}
