import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'superadmin-create-store-modal',
  template: `
    <div class="modal" [class.modal-open]="open">
      <div class="modal-box">
        <h3 class="font-semibold text-lg">{{ mode === 'EDITAR' ? 'Editar Loja' : 'Nova Loja' }}</h3>
        <p class="text-sm opacity-70 mt-1">
          {{ mode === 'EDITAR' ? 'Atualize os dados da loja vinculada.' : 'Cadastro rápido para loja vinculada ao Admin.' }}
        </p>

        <div class="grid gap-3 mt-4">
          <label class="form-control">
            <div class="label">
              <span class="label-text text-xs opacity-70">Nome da loja</span>
            </div>
            <input class="input input-bordered" [(ngModel)]="nome" placeholder="Ex.: Unidade Centro" />
          </label>
          <label class="form-control">
            <div class="label">
              <span class="label-text text-xs opacity-70">Código/identificador</span>
            </div>
            <input class="input input-bordered" [(ngModel)]="codigo" placeholder="EX: UNI-001" />
          </label>
          <label class="form-control">
            <div class="label">
              <span class="label-text text-xs opacity-70">Mensalidade por loja (R$)</span>
            </div>
            <input
              class="input input-bordered"
              type="number"
              min="0"
              step="0.01"
              [(ngModel)]="mensalidade"
              placeholder="Ex.: 120,00"
            />
          </label>
        </div>

        <div class="modal-action">
          <button class="btn btn-ghost" (click)="onClose()">Cancelar</button>
          <button class="btn btn-primary" (click)="confirm.emit({ id: storeId, nome, codigo, mensalidade })">
            {{ mode === 'EDITAR' ? 'Salvar alterações' : 'Salvar loja' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CreateStoreModalComponent implements OnChanges {
  @Input() open = false;
  @Input() mode: 'CRIAR' | 'EDITAR' = 'CRIAR';
  @Input() storeId?: string | null;
  @Input() store?: { nome: string; codigo: string; mensalidade: number } | null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{ id?: string | null; nome: string; codigo: string; mensalidade: number }>();

  nome = '';
  codigo = '';
  mensalidade = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['store'] || changes['open']) {
      this.nome = this.store?.nome ?? '';
      this.codigo = this.store?.codigo ?? '';
      this.mensalidade = this.store?.mensalidade ?? 0;
    }
  }

  onClose(): void {
    this.nome = '';
    this.codigo = '';
    this.mensalidade = 0;
    this.close.emit();
  }
}
