import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CashMovementType } from '../models/cash-movement';
import { PaymentMethod, SaleItem } from '../models/sale';
import { Terminal } from '../models/terminal';
import { ProductSearchComponent } from '../components/product-search.component';
import { ReceiptItemsComponent } from '../components/receipt-items.component';
import { SaleSummaryComponent } from '../components/sale-summary.component';
import { PaymentModalComponent } from '../components/payment-modal.component';
import { CashMovementModalComponent } from '../components/cash-movement-modal.component';
import { Product } from '../models/product';

@Component({
  selector: 'pdv-sale-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductSearchComponent,
    ReceiptItemsComponent,
    SaleSummaryComponent,
    PaymentModalComponent,
    CashMovementModalComponent,
  ],
  template: `
    <div class="grid grid-cols-12 gap-4">
      <section class="col-span-12 lg:col-span-8 space-y-4">
        <div class="rounded-lg border border-base-200 bg-base-300 p-4">
          <h3 class="text-sm font-semibold mb-3">Produto</h3>
          <pdv-product-search
            [products]="products"
            [searchTerm]="searchTerm()"
            (searchTermChange)="searchTerm.set($event)"
            (search)="search.emit(searchTerm())"
            (add)="add.emit($event)"
          ></pdv-product-search>
        </div>

        <div class="rounded-lg border border-base-200 bg-base-300 p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold">Itens do Cupom</h3>
            <span class="text-xs opacity-70">{{ items.length }} item(ns)</span>
          </div>
          <pdv-receipt-items
            [items]="items"
            (remove)="remove.emit($event)"
            (quantityChange)="quantityChange.emit($event)"
            (weightChange)="weightChange.emit($event)"
          ></pdv-receipt-items>

          <div class="mt-4 flex flex-wrap gap-2">
            <button class="btn btn-outline btn-sm" type="button" (click)="clear.emit()">
              Cancelar compra
            </button>
            <button class="btn btn-outline btn-sm" type="button" (click)="openMovement('SANGRIA')">
              Registrar Sangria
            </button>
            <button class="btn btn-outline btn-sm" type="button" (click)="openMovement('REFORCO')">
              Registrar Reforço
            </button>
          </div>
        </div>
      </section>

      <aside class="col-span-12 lg:col-span-4 space-y-4">
        <div class="rounded-lg border border-base-200 bg-base-300 p-4">
          <h3 class="text-sm font-semibold mb-3">Resumo</h3>
          <pdv-sale-summary [subtotal]="subtotal" [total]="total"></pdv-sale-summary>
          <div class="mt-4">
            <button
              class="btn btn-success w-full"
              type="button"
              [disabled]="!items.length"
              (click)="openPaymentModal()"
            >
              Finalizar Compra
            </button>
          </div>
          <div class="mt-2 text-xs opacity-70">
            Ao finalizar, escolha a forma de pagamento.
          </div>
        </div>

        <div class="rounded-lg border border-base-200 bg-base-300 p-4">
          <div class="text-sm font-semibold mb-2">Status</div>
          <div class="text-xs opacity-70">Terminal: {{ terminalLabel }}</div>
          <div class="text-xs opacity-70">Operador: {{ operator }}</div>
          <button class="btn btn-outline btn-sm mt-3" type="button" (click)="closeCash.emit()">
            Fechamento de Caixa
          </button>
        </div>
      </aside>
    </div>

    <pdv-payment-modal
      [open]="paymentModalOpen()"
      [total]="total"
      (confirm)="confirmPayment($event)"
      (cancel)="paymentModalOpen.set(false)"
    ></pdv-payment-modal>

    <pdv-cash-movement-modal
      [open]="movementModalOpen()"
      [type]="movementType()"
      (save)="saveMovement($event)"
      (cancel)="movementModalOpen.set(false)"
    ></pdv-cash-movement-modal>
  `,
})
export class PdvSalePage {
  @Input() terminal: Terminal | null = null;
  @Input() operator = '';
  @Input() products: Product[] = [];
  @Input() items: SaleItem[] = [];
  @Output() search = new EventEmitter<string>();
  @Output() add = new EventEmitter<{ product: Product; quantity?: number; weight?: number }>();
  @Output() remove = new EventEmitter<string>();
  @Output() quantityChange = new EventEmitter<{ id: string; quantity: number }>();
  @Output() weightChange = new EventEmitter<{ id: string; weight: number }>();
  @Output() clear = new EventEmitter<void>();
  @Output() finalize = new EventEmitter<PaymentMethod>();
  @Output() saveMovementRequest = new EventEmitter<{ type: CashMovementType; amount: number; note?: string }>();
  @Output() closeCash = new EventEmitter<void>();

  searchTerm = signal('');
  paymentModalOpen = signal(false);
  movementModalOpen = signal(false);
  movementType = signal<CashMovementType>('SANGRIA');

  get terminalLabel(): string {
    if (!this.terminal) return '-';
    return `${this.terminal.code} - ${this.terminal.name}`;
  }

  get subtotal(): number {
    return this.items.reduce((acc, item) => acc + item.total, 0);
  }

  get total(): number {
    return this.items.reduce((acc, item) => acc + item.total, 0);
  }

  openPaymentModal(): void {
    this.paymentModalOpen.set(true);
  }

  confirmPayment(method: PaymentMethod): void {
    this.paymentModalOpen.set(false);
    this.finalize.emit(method);
  }

  openMovement(type: CashMovementType): void {
    this.movementType.set(type);
    this.movementModalOpen.set(true);
  }

  saveMovement({ amount, note }: { amount: number; note?: string }): void {
    this.movementModalOpen.set(false);
    this.saveMovementRequest.emit({ type: this.movementType(), amount, note });
  }

  ngOnChanges(): void {
    if (!this.items.length) {
      this.paymentModalOpen.set(false);
    }
  }
}
