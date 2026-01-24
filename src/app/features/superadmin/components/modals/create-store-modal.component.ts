import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'superadmin-create-store-modal',
  template: `
    <div class="modal" [class.modal-open]="open">
      <div class="modal-box">
        <h3 class="font-semibold text-lg">Nova Loja</h3>
        <p class="text-sm opacity-70 mt-1">Cadastro rápido para loja vinculada ao Admin.</p>

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
        </div>

        <div class="modal-action">
          <button class="btn btn-ghost" (click)="onClose()">Cancelar</button>
          <button class="btn btn-primary" (click)="confirm.emit({ nome, codigo })">
            Salvar loja
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CreateStoreModalComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{ nome: string; codigo: string }>();

  nome = '';
  codigo = '';

  onClose(): void {
    this.nome = '';
    this.codigo = '';
    this.close.emit();
  }
}
