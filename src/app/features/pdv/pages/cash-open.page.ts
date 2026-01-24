import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Terminal } from '../models/terminal';

@Component({
  selector: 'pdv-cash-open',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="rounded-lg border border-base-200 bg-base-300 p-6">
      <h2 class="text-lg font-semibold">Abertura de Caixa</h2>
      <p class="text-sm opacity-70 mb-6">Informe o troco inicial para iniciar o atendimento.</p>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="form-control">
          <label class="label">Terminal</label>
          <input
            class="input input-bordered"
            [value]="terminal ? terminal.code + ' - ' + terminal.name : ''"
            readonly
          />
        </div>
        <div class="form-control">
          <label class="label">Operador</label>
          <input class="input input-bordered" [value]="operator" readonly />
        </div>
      </div>

      <div class="form-control mt-4">
        <label class="label">Valor inicial (R$)</label>
        <input
          class="input input-bordered w-full md:w-72"
          type="number"
          min="0"
          step="0.01"
          [(ngModel)]="openingBalance"
        />
      </div>

      <div class="mt-6">
        <button class="btn btn-primary" type="button" (click)="openCash()">Abrir Caixa</button>
      </div>
    </section>
  `,
})
export class CashOpenPage {
  @Input() terminal: Terminal | null = null;
  @Input() operator = '';
  @Output() open = new EventEmitter<number>();

  openingBalance = 0;

  openCash(): void {
    this.open.emit(this.openingBalance);
  }
}
