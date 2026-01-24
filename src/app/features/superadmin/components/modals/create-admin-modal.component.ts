import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'superadmin-create-admin-modal',
  template: `
    <div class="modal" [class.modal-open]="open">
      <div class="modal-box">
        <h3 class="font-semibold text-lg">Novo Admin</h3>
        <p class="text-sm opacity-70 mt-1">Cadastro rápido para ativar um novo cliente.</p>

        <div class="grid gap-3 mt-4">
          <label class="form-control">
            <div class="label">
              <span class="label-text text-xs opacity-70">Nome/Razão social</span>
            </div>
            <input class="input input-bordered" [(ngModel)]="nome" placeholder="Ex.: Cantina Nova" />
          </label>
          <label class="form-control">
            <div class="label">
              <span class="label-text text-xs opacity-70">E-mail de acesso</span>
            </div>
            <input class="input input-bordered" [(ngModel)]="email" placeholder="admin@cliente.com" />
          </label>
          <label class="form-control">
            <div class="label">
              <span class="label-text text-xs opacity-70">Documento (CPF/CNPJ)</span>
            </div>
            <input class="input input-bordered" [(ngModel)]="documento" placeholder="00.000.000/0000-00" />
          </label>
        </div>

        <div class="modal-action">
          <button class="btn btn-ghost" (click)="onClose()">Cancelar</button>
          <button class="btn btn-primary" (click)="confirm.emit({ nome, email, documento })">
            Salvar cadastro
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CreateAdminModalComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{ nome: string; email: string; documento: string }>();

  nome = '';
  email = '';
  documento = '';

  onClose(): void {
    this.nome = '';
    this.email = '';
    this.documento = '';
    this.close.emit();
  }
}
