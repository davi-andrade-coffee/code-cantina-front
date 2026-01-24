import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/product';

@Component({
  selector: 'pdv-product-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-3">
      <div class="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          class="input input-bordered flex-1"
          placeholder="Código do produto ou nome..."
          [(ngModel)]="searchTerm"
          (ngModelChange)="searchTermChange.emit($event)"
        />
        <button class="btn btn-primary" type="button" (click)="search.emit()">Buscar</button>
      </div>

      <div class="text-xs opacity-70">Ex.: Código 100 para produtos por Kg</div>

      <div *ngIf="products.length" class="space-y-2">
        <div
          *ngFor="let product of products"
          class="flex flex-col gap-2 rounded-lg border border-base-200 bg-base-300 p-3 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div class="font-semibold">{{ product.code }} - {{ product.name }}</div>
            <div class="text-sm opacity-70">
              R$ {{ product.price | number: '1.2-2' }} / {{ product.unitLabel || 'un' }}
            </div>
          </div>

          <div class="flex flex-col gap-2 md:flex-row md:items-center">
            <input
              *ngIf="product.soldByWeight"
              class="input input-bordered input-sm w-32"
              type="number"
              min="0.1"
              step="0.01"
              placeholder="Peso (kg)"
              [(ngModel)]="weightByProduct[product.id]"
            />
            <input
              *ngIf="!product.soldByWeight"
              class="input input-bordered input-sm w-24"
              type="number"
              min="1"
              step="1"
              placeholder="Qtd"
              [(ngModel)]="quantityByProduct[product.id]"
            />
            <button
              class="btn btn-outline btn-sm"
              type="button"
              (click)="addProduct(product)"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!products.length" class="text-sm opacity-70">
        Nenhum produto encontrado.
      </div>
    </div>
  `,
})
export class ProductSearchComponent {
  @Input() products: Product[] = [];
  @Input() searchTerm = '';
  @Output() search = new EventEmitter<void>();
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() add = new EventEmitter<{ product: Product; quantity?: number; weight?: number }>();

  quantityByProduct: Record<string, number> = {};
  weightByProduct: Record<string, number> = {};

  addProduct(product: Product): void {
    const quantity = this.quantityByProduct[product.id];
    const weight = this.weightByProduct[product.id];
    this.add.emit({ product, quantity, weight });
    if (product.soldByWeight) {
      this.weightByProduct[product.id] = 0;
    } else {
      this.quantityByProduct[product.id] = 1;
    }
  }
}
