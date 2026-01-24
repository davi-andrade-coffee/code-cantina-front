import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'client-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto border border-base-200 rounded-lg">
      <table class="table table-zebra w-full">
        <thead class="bg-base-200">
          <ng-content select="thead"></ng-content>
        </thead>
        <tbody>
          <ng-content select="tbody"></ng-content>
        </tbody>
      </table>
      <div *ngIf="empty" class="p-4 text-sm opacity-70">{{ emptyMessage }}</div>
    </div>
  `,
})
export class ClientTableComponent {
  @Input() empty = false;
  @Input() emptyMessage = 'Sem registros para o filtro atual.';
}
