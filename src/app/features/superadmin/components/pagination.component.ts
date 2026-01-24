import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'superadmin-pagination',
  template: `
    <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
      <div class="text-xs opacity-70">
        Mostrando {{ pageItems }} de {{ totalItems }} registros
      </div>
      <div class="flex items-center gap-2">
        <select
          class="select select-bordered select-xs"
          [value]="pageSize"
          (change)="pageSizeChange.emit(+($any($event.target).value))"
        >
          <option *ngFor="let size of pageSizes" [value]="size">{{ size }} / pág.</option>
        </select>
        <button class="btn btn-ghost btn-xs" (click)="prevPage()" [disabled]="page === 1">
          Anterior
        </button>
        <span class="text-xs opacity-70">Página {{ page }} de {{ totalPages }}</span>
        <button class="btn btn-ghost btn-xs" (click)="nextPage()" [disabled]="page === totalPages">
          Próxima
        </button>
      </div>
    </div>
  `,
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Input() pageItems = 0;
  @Input() pageSize = 8;
  @Input() pageSizes: number[] = [6, 8, 12];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  prevPage(): void {
    this.pageChange.emit(Math.max(1, this.page - 1));
  }

  nextPage(): void {
    this.pageChange.emit(Math.min(this.totalPages, this.page + 1));
  }
}
