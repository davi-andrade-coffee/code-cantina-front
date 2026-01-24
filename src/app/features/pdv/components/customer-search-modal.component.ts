import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Customer } from '../models/customer';

@Component({
  selector: 'pdv-customer-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div class="w-full max-w-2xl rounded-xl bg-base-300 p-6 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold">Buscar aluno/professor</h3>
            <p class="text-sm opacity-70">Identifique o cliente para seguir com a venda.</p>
          </div>
          <button class="btn btn-ghost btn-sm" type="button" (click)="close.emit()">✕</button>
        </div>

        <div class="rounded-lg border border-base-200 bg-base-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-semibold">Identificação por biometria</div>
              <div class="text-xs opacity-70">Aguardando...</div>
            </div>
            <span class="badge badge-outline">Manual</span>
          </div>
          <div class="mt-3 h-2 w-full rounded-full bg-base-100">
            <div class="h-2 w-1/3 rounded-full bg-primary/70"></div>
          </div>
          <div class="mt-3 flex justify-end">
            <button class="btn btn-outline btn-sm" type="button">Busca manual</button>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <input
            class="input input-bordered flex-1"
            placeholder="Digite nome ou CPF/CNPJ"
            [(ngModel)]="searchTerm"
          />
          <button class="btn btn-primary" type="button" (click)="search.emit(searchTerm)">
            Buscar
          </button>
        </div>

        <div class="mt-4 space-y-2">
          <div
            *ngFor="let customer of customers"
            class="flex flex-col gap-2 rounded-lg border border-base-200 bg-base-200 p-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div class="font-semibold">{{ customer.name }}</div>
              <div class="text-xs opacity-70">{{ customer.document }}</div>
              <div class="text-xs" [class.text-error]="customer.blocked">
                Saldo: R$ {{ customer.balance | number: '1.2-2' }}
              </div>
            </div>
            <button
              class="btn btn-outline btn-sm"
              type="button"
              [disabled]="customer.blocked"
              (click)="select.emit(customer)"
            >
              Selecionar
            </button>
          </div>
        </div>

        <div *ngIf="!customers.length" class="mt-4 text-center text-sm opacity-70">
          Nenhum registro encontrado.
        </div>
      </div>
    </div>
  `,
})
export class CustomerSearchModalComponent {
  @Input() open = false;
  @Input() customers: Customer[] = [];
  @Output() search = new EventEmitter<string>();
  @Output() select = new EventEmitter<Customer>();
  @Output() close = new EventEmitter<void>();

  searchTerm = '';
}
