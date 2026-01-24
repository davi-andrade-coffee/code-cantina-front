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
import { CustomerSearchModalComponent } from '../components/customer-search-modal.component';
import { BalanceWarningModalComponent } from '../components/balance-warning-modal.component';
import { PeripheralsStatusComponent, PeripheralStatus } from '../components/peripherals-status.component';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { BalanceWarning } from '../services/pdv.facade';

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
    CustomerSearchModalComponent,
    BalanceWarningModalComponent,
    PeripheralsStatusComponent,
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
          <div class="mt-4 rounded-lg border border-base-200 bg-base-200 p-3">
            <div class="text-xs uppercase opacity-60">Cliente</div>
            <div class="mt-1 text-sm font-semibold">
              {{ selectedCustomer?.name || 'Não identificado' }}
            </div>
            <div class="text-xs opacity-70" *ngIf="selectedCustomer">
              {{ selectedCustomer.document }} · Saldo R$ {{ selectedCustomer.balance | number: '1.2-2' }}
            </div>
            <div class="mt-3 flex gap-2">
              <button class="btn btn-outline btn-xs" type="button" (click)="openCustomerModal()">
                {{ selectedCustomer ? 'Trocar cliente' : 'Identificar cliente' }}
              </button>
              <button
                *ngIf="selectedCustomer"
                class="btn btn-ghost btn-xs text-error"
                type="button"
                (click)="clearCustomer.emit()"
              >
                Remover
              </button>
            </div>
          </div>
          <div class="mt-4">
            <button
              class="btn btn-success w-full"
              type="button"
              [disabled]="!items.length"
              (click)="handleFinalizeClick()"
            >
              Finalizar Compra
            </button>
          </div>
          <div class="mt-2 text-xs opacity-70">
            Ao finalizar, escolha a forma de pagamento.
          </div>
        </div>

        <div class="rounded-lg border border-base-200 bg-base-300 p-4 space-y-2">
          <div class="text-sm font-semibold">Status</div>
          <div class="text-xs opacity-70">Terminal: {{ terminalLabel }}</div>
          <div class="text-xs opacity-70">Operador: {{ operator }}</div>
          <div class="mt-3">
            <pdv-peripherals-status [items]="peripherals"></pdv-peripherals-status>
          </div>
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

    <pdv-customer-search-modal
      [open]="customerModalOpen()"
      [customers]="customers"
      (search)="searchCustomer.emit($event)"
      (select)="handleCustomerSelect($event)"
      (close)="customerModalOpen.set(false)"
    ></pdv-customer-search-modal>

    <pdv-balance-warning-modal
      [warning]="balanceWarning"
      (close)="dismissBalanceWarning.emit()"
    ></pdv-balance-warning-modal>
  `,
})
export class PdvSalePage {
  @Input() terminal: Terminal | null = null;
  @Input() operator = '';
  @Input() products: Product[] = [];
  @Input() items: SaleItem[] = [];
  @Input() customers: Customer[] = [];
  @Input() selectedCustomer: Customer | null = null;
  @Input() balanceWarning: BalanceWarning | null = null;
  @Output() search = new EventEmitter<string>();
  @Output() add = new EventEmitter<{ product: Product; quantity?: number; weight?: number }>();
  @Output() remove = new EventEmitter<string>();
  @Output() quantityChange = new EventEmitter<{ id: string; quantity: number }>();
  @Output() weightChange = new EventEmitter<{ id: string; weight: number }>();
  @Output() clear = new EventEmitter<void>();
  @Output() finalize = new EventEmitter<PaymentMethod>();
  @Output() searchCustomer = new EventEmitter<string>();
  @Output() selectCustomer = new EventEmitter<Customer>();
  @Output() clearCustomer = new EventEmitter<void>();
  @Output() dismissBalanceWarning = new EventEmitter<void>();
  @Output() saveMovementRequest = new EventEmitter<{ type: CashMovementType; amount: number; note?: string }>();
  @Output() closeCash = new EventEmitter<void>();

  searchTerm = signal('');
  paymentModalOpen = signal(false);
  movementModalOpen = signal(false);
  movementType = signal<CashMovementType>('SANGRIA');
  customerModalOpen = signal(false);

  peripherals: PeripheralStatus[] = [
    { id: 'printer', label: 'Impressora', status: 'OFFLINE', icon: '🖨️' },
    { id: 'scale', label: 'Balança', status: 'OFFLINE', icon: '⚖️' },
    { id: 'bio', label: 'Biometria', status: 'OFFLINE', icon: '🔒' },
  ];

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

  handleFinalizeClick(): void {
    if (!this.selectedCustomer) {
      this.openCustomerModal();
      return;
    }
    this.openPaymentModal();
  }

  openCustomerModal(): void {
    this.customerModalOpen.set(true);
  }

  handleCustomerSelect(customer: Customer): void {
    this.selectCustomer.emit(customer);
    this.customerModalOpen.set(false);
    if (this.items.length) {
      this.openPaymentModal();
    }
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
