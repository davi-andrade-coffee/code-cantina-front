import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Terminal } from '../models/terminal';

@Component({
  selector: 'pdv-terminal-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="rounded-lg border border-base-200 bg-base-300 p-6">
      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-lg font-semibold">Selecionar Terminal</h2>
          <p class="text-sm opacity-70">Escolha o terminal para iniciar o PDV.</p>
        </div>
      </div>

      <div class="mt-4">
        <input
          class="input input-bordered w-full"
          placeholder="Buscar por código ou nome"
          [(ngModel)]="searchTerm"
        />
      </div>

      <div class="mt-4 grid gap-3 md:grid-cols-2">
        <button
          *ngFor="let terminal of filteredTerminals"
          class="btn btn-outline justify-start"
          type="button"
          (click)="select.emit(terminal)"
        >
          <span class="font-semibold">{{ terminal.code }}</span>
          <span class="ml-2 opacity-70">{{ terminal.name }}</span>
        </button>
      </div>

      <div *ngIf="!filteredTerminals.length" class="mt-4 text-sm opacity-70">
        Nenhum terminal encontrado.
      </div>
    </section>
  `,
})
export class TerminalSelectPage {
  @Input() terminals: Terminal[] = [];
  @Output() select = new EventEmitter<Terminal>();

  searchTerm = '';

  get filteredTerminals(): Terminal[] {
    if (!this.searchTerm.trim()) return this.terminals;
    const normalized = this.searchTerm.toLowerCase();
    return this.terminals.filter(
      terminal =>
        terminal.code.toLowerCase().includes(normalized) ||
        terminal.name.toLowerCase().includes(normalized)
    );
  }
}
