import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CashSessionFilters } from './cash.models';

export type SelectOption = { label: string; value: string };

@Component({
  selector: 'app-cash-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-base-300 rounded-lg border border-base-100 p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <label class="form-control w-full">
          <div class="label"><span class="label-text">Data início</span></div>
          <input
            type="date"
            class="input input-bordered input-sm"
            [ngModel]="filters.startDate"
            (ngModelChange)="emitChange({ startDate: $event })"
          />
        </label>

        <label class="form-control w-full">
          <div class="label"><span class="label-text">Data fim</span></div>
          <input
            type="date"
            class="input input-bordered input-sm"
            [ngModel]="filters.endDate"
            (ngModelChange)="emitChange({ endDate: $event })"
          />
        </label>

        <label class="form-control w-full">
          <div class="label"><span class="label-text">Status</span></div>
          <select
            class="select select-bordered select-sm"
            [ngModel]="filters.status"
            (ngModelChange)="emitChange({ status: $event })"
          >
            <option value="ALL">Todos</option>
            <option value="OPEN">Abertas</option>
            <option value="CLOSED">Fechadas</option>
          </select>
        </label>

        <label class="form-control w-full">
          <div class="label"><span class="label-text">Terminal</span></div>
          <select
            class="select select-bordered select-sm"
            [ngModel]="filters.terminal"
            (ngModelChange)="emitChange({ terminal: $event })"
          >
            <option *ngFor="let option of terminals" [value]="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="form-control w-full">
          <div class="label"><span class="label-text">Operador</span></div>
          <select
            class="select select-bordered select-sm"
            [ngModel]="filters.operator"
            (ngModelChange)="emitChange({ operator: $event })"
          >
            <option *ngFor="let option of operators" [value]="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="form-control w-full">
          <div class="label"><span class="label-text">Buscar</span></div>
          <input
            type="text"
            class="input input-bordered input-sm"
            placeholder="Terminal, operador ou ID"
            [ngModel]="filters.search"
            (ngModelChange)="emitChange({ search: $event })"
          />
        </label>
      </div>

      <div class="flex flex-wrap items-center gap-3 mt-4">
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            class="checkbox checkbox-sm"
            [ngModel]="filters.onlyDivergence"
            (ngModelChange)="emitChange({ onlyDivergence: $event })"
          />
          Somente com divergência
        </label>

        <button class="btn btn-primary btn-sm" type="button" (click)="submit.emit()">
          Buscar
        </button>
      </div>
    </section>
  `,
})
export class CashFiltersComponent {
  @Input({ required: true }) filters!: CashSessionFilters;
  @Input() terminals: SelectOption[] = [];
  @Input() operators: SelectOption[] = [];

  @Output() filtersChange = new EventEmitter<Partial<CashSessionFilters>>();
  @Output() submit = new EventEmitter<void>();

  emitChange(patch: Partial<CashSessionFilters>): void {
    this.filtersChange.emit(patch);
  }
}
