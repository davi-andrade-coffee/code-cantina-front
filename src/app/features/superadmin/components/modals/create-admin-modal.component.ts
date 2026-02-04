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
            <input
              class="input input-bordered"
              [ngClass]="{ 'input-error': submitted && isNameInvalid() }"
              [(ngModel)]="name"
              placeholder="Ex.: Cantina Nova"
            />
            <div class="text-xs text-red-500 mt-1" *ngIf="submitted && isNameInvalid()">
              O nome deve ter pelo menos 4 caracteres.
            </div>
          </label>

          <label class="form-control">
            <div class="label">
              <span class="label-text text-xs opacity-70">E-mail de acesso</span>
            </div>
            <input
              class="input input-bordered"
              [ngClass]="{ 'input-error': submitted && isEmailInvalid() }"
              [(ngModel)]="email"
              placeholder="admin@cliente.com"
            />
            <div class="text-xs text-red-500 mt-1" *ngIf="submitted && isEmailInvalid()">
              E-mail inválido.
            </div>
          </label>
        </div>

        <div class="modal-action">
          <button class="btn btn-ghost" (click)="onClose()">Cancelar</button>
          <button class="btn btn-primary" [disabled]="hasErrors()" (click)="onSend()">
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
  @Output() confirm = new EventEmitter<{ name: string; email: string }>();

  name = '';
  email = '';
  submitted = false;

  isNameInvalid(): boolean {
    return !this.name || this.name.trim().length < 4;
  }

  isEmailInvalid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !this.email || !emailRegex.test(this.email);
  }

  hasErrors(): boolean {
    return this.isNameInvalid() || this.isEmailInvalid();
  }

  onClose(): void {
    this.name = '';
    this.email = '';
    this.submitted = false;
    this.close.emit();
  }

  onSend(): void {
    this.submitted = true;

    if (this.hasErrors()) return;

    this.confirm.emit({
      name: this.name.trim(),
      email: this.email.trim(),
    });

    this.onClose();
  }
}

