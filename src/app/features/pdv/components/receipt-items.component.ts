import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SaleItem } from '../models/sale';

@Component({
  selector: 'pdv-receipt-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Produto</th>
            <th class="w-24">Qtd</th>
            <th class="w-28">Peso (kg)</th>
            <th class="w-28">Vlr Unit</th>
            <th class="w-28">Total</th>
            <th class="w-16"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td>
              <div class="font-medium">{{ item.product.name }}</div>
              <div class="text-xs opacity-70">{{ item.product.code }}</div>
            </td>
            <td>
              <input
                class="input input-bordered input-sm w-20"
                type="number"
                min="1"
                step="1"
                [ngModel]="item.quantity"
                (ngModelChange)="quantityChange.emit({ id: item.id, quantity: $event })"
                [disabled]="item.product.soldByWeight"
              />
            </td>
            <td>
              <input
                class="input input-bordered input-sm w-24"
                type="number"
                min="0.01"
                step="0.01"
                [ngModel]="item.weight"
                (ngModelChange)="weightChange.emit({ id: item.id, weight: $event })"
                [disabled]="!item.product.soldByWeight"
              />
            </td>
            <td>R$ {{ item.unitPrice | number: '1.2-2' }}</td>
            <td>R$ {{ item.total | number: '1.2-2' }}</td>
            <td>
              <button class="btn btn-ghost btn-xs text-error" type="button" (click)="remove.emit(item.id)">
                Remover
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!items.length" class="text-sm opacity-70 py-6 text-center">
        Nenhum item adicionado.
      </div>
    </div>
  `,
})
export class ReceiptItemsComponent {
  @Input() items: SaleItem[] = [];
  @Output() remove = new EventEmitter<string>();
  @Output() quantityChange = new EventEmitter<{ id: string; quantity: number }>();
  @Output() weightChange = new EventEmitter<{ id: string; weight: number }>();
}
