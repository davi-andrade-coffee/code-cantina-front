import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, effect } from '@angular/core';
import { TerminalSelectPage } from './terminal-select.page';
import { CashOpenPage } from './cash-open.page';
import { PdvSalePage } from './pdv-sale.page';
import { CashClosePage } from './cash-close.page';
import { PdvFacade } from '../services/pdv.facade';
import { CashMovementType } from '../models/cash-movement';

@Component({
  standalone: true,
  imports: [CommonModule, TerminalSelectPage, CashOpenPage, PdvSalePage, CashClosePage],
  template: `
    <div class="pdv-shell space-y-4">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-lg font-semibold">PDV</h1>
          <p class="text-sm opacity-70">
            {{
              terminalLabel
                ? 'Terminal: ' + terminalLabel
                : 'Selecione um terminal para iniciar o fluxo.'
            }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span *ngIf="terminalLabel" class="text-sm opacity-80">Operador: {{ operator }}</span>
          <button
            *ngIf="terminalLabel"
            class="btn btn-outline btn-sm"
            type="button"
            (click)="backToTerminal()"
          >
            Voltar
          </button>
        </div>
      </header>

      <div *ngIf="facade.noticeView()" class="alert" [class.alert-error]="facade.noticeView()?.type === 'error'"
        [class.alert-success]="facade.noticeView()?.type === 'success'">
        <span>{{ facade.noticeView()?.message }}</span>
      </div>

      <ng-container [ngSwitch]="facade.viewMode()">
        <pdv-terminal-select
          *ngSwitchCase="'terminal'"
          [terminals]="facade.terminalsView()"
          (select)="onSelectTerminal($event.id)"
        ></pdv-terminal-select>

        <pdv-cash-open
          *ngSwitchCase="'cash-open'"
          [terminal]="facade.selectedTerminal()"
          [operator]="operator"
          (open)="facade.openSession($event)"
        ></pdv-cash-open>

        <pdv-sale-page
          *ngSwitchCase="'sale'"
          [terminal]="facade.selectedTerminal()"
          [operator]="operator"
          [products]="facade.productsView()"
          [items]="facade.cartItemsView()"
          [customers]="facade.customersView()"
          [selectedCustomer]="facade.selectedCustomerView()"
          [balanceWarning]="facade.balanceWarningView()"
          (search)="facade.searchProducts($event)"
          (add)="facade.addItem($event.product, $event.quantity, $event.weight)"
          (remove)="facade.removeItem($event)"
          (quantityChange)="facade.updateItemQuantity($event.id, $event.quantity)"
          (weightChange)="facade.updateItemWeight($event.id, $event.weight)"
          (clear)="facade.clearSale()"
          (finalize)="facade.finalizeSale($event)"
          (searchCustomer)="facade.searchCustomers($event)"
          (selectCustomer)="facade.selectCustomer($event)"
          (clearCustomer)="facade.clearCustomer()"
          (dismissBalanceWarning)="facade.clearBalanceWarning()"
          (saveMovementRequest)="onSaveMovement($event)"
          (closeCash)="facade.openCashClose()"
        ></pdv-sale-page>

        <pdv-cash-close
          *ngSwitchCase="'cash-close'"
          [summary]="facade.summaryView()"
          (close)="onCloseCash($event.counted, $event.note)"
          (cancel)="facade.backToSale()"
        ></pdv-cash-close>
      </ng-container>
    </div>
  `,
})
export class PdvShellPage implements OnInit, OnDestroy {
  constructor(public facade: PdvFacade) {
    effect(() => {
      const isActive = !!this.facade.selectedTerminal();
      document.body.classList.toggle('pdv-fullscreen', isActive);
    });
  }

  ngOnInit(): void {
    void this.facade.init();
  }

  get terminalLabel(): string | null {
    const terminal = this.facade.selectedTerminal();
    if (!terminal) return null;
    return `${terminal.code} - ${terminal.name}`;
  }

  get operator(): string {
    return this.facade.operatorName();
  }

  onSelectTerminal(terminalId: string): void {
    void this.facade.selectTerminal(terminalId);
  }

  onSaveMovement(event: { type: CashMovementType; amount: number; note?: string }): void {
    void this.facade.registerMovement(event.type, event.amount, event.note);
  }

  onCloseCash(counted: number, note?: string): void {
    void this.facade.closeSession(counted, note);
  }

  backToTerminal(): void {
    this.facade.clearTerminal();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('pdv-fullscreen');
  }

}
