import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StatementEntry } from '../models/statement.model';

@Component({
  selector: 'client-statement-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="w-full max-w-lg rounded-lg bg-base-300 p-6 shadow-xl">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-lg font-semibold">Detalhes da movimentação</div>
            <div class="text-sm opacity-70">{{ entry?.dateTime }} • {{ entry?.origin }}</div>
          </div>
          <button class="btn btn-sm btn-ghost" (click)="close.emit()">Fechar</button>
        </div>

        <div class="mt-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm">Descrição</span>
            <span class="font-medium">{{ entry?.description }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm">Valor</span>
            <span class="font-semibold">R$ {{ entry?.amount | number: '1.2-2' }}</span>
          </div>
          <div *ngIf="entry?.balanceAfter !== undefined" class="flex items-center justify-between">
            <span class="text-sm">Saldo após</span>
            <span class="font-semibold">R$ {{ entry?.balanceAfter | number: '1.2-2' }}</span>
          </div>
        </div>

        <div *ngIf="entry?.detail" class="mt-5">
          <div class="text-sm font-semibold mb-2">Itens</div>
          <ul class="space-y-2">
            <li
              *ngFor="let item of entry?.detail?.items"
              class="flex items-center justify-between text-sm"
            >
              <span>{{ item.name }} (x{{ item.quantity }})</span>
              <span>R$ {{ item.price | number: '1.2-2' }}</span>
            </li>
          </ul>

          <div class="mt-4 grid gap-2 text-sm">
            <div class="flex items-center justify-between">
              <span>Pagamento</span>
              <span>{{ entry?.detail?.paymentMethod }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Operador</span>
              <span>{{ entry?.detail?.operator }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Terminal</span>
              <span>{{ entry?.detail?.terminal }}</span>
            </div>
            <div *ngIf="entry?.detail?.notes" class="flex items-center justify-between">
              <span>Observações</span>
              <span>{{ entry?.detail?.notes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class StatementDetailModalComponent {
  @Input() open = false;
  @Input() entry: StatementEntry | null = null;
  @Output() close = new EventEmitter<void>();
}
