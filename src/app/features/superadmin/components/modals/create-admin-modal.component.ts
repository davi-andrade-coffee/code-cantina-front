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
            <div class="label" *ngIf="showError('nome')">
              <span class="label-text-alt text-error">Informe o nome do admin.</span>
            </div>
          </label>
          <label class="form-control">
            <div class="label">
              <span class="label-text text-xs opacity-70">E-mail de acesso</span>
            </div>
            <input class="input input-bordered" [(ngModel)]="email" placeholder="admin@cliente.com" />
            <div class="label" *ngIf="showError('email')">
              <span class="label-text-alt text-error">Informe um e-mail válido.</span>
            </div>
          </label>
          <label class="form-control">
            <div class="label">
              <span class="label-text text-xs opacity-70">Telefone de contato</span>
            </div>
            <input class="input input-bordered" [(ngModel)]="telefone" placeholder="(00) 00000-0000" />
            <div class="label" *ngIf="showError('telefone')">
              <span class="label-text-alt text-error">Informe um telefone válido.</span>
            </div>
          </label>
        </div>

        <div class="modal-action">
          <button class="btn btn-ghost" [disabled]="submitting" (click)="onClose()">Cancelar</button>
          <button class="btn btn-primary" [disabled]="submitting || !formValid()" (click)="onConfirm()">
            <span *ngIf="!submitting">Salvar cadastro</span>
            <span *ngIf="submitting" class="loading loading-spinner loading-xs"></span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CreateAdminModalComponent {
  @Input() open = false;
  @Input() submitting = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{ nome: string; email: string; telefone: string }>();

  nome = '';
  email = '';
  telefone = '';
  submitted = false;

  onClose(): void {
    this.nome = '';
    this.email = '';
    this.telefone = '';
    this.submitted = false;
    this.close.emit();
  }

  onConfirm(): void {
    if (this.submitting) return;
    this.submitted = true;
    if (!this.formValid()) return;
    this.confirm.emit({
      nome: this.nome.trim(),
      email: this.email.trim(),
      telefone: this.telefone.trim(),
    });
  }

  formValid(): boolean {
    return this.isNameValid() && this.isEmailValid() && this.isPhoneValid();
  }

  showError(field: 'nome' | 'email' | 'telefone'): boolean {
    if (!this.submitted) return false;
    if (field === 'nome') return !this.isNameValid();
    if (field === 'email') return !this.isEmailValid();
    return !this.isPhoneValid();
  }

  private isNameValid(): boolean {
    return this.nome.trim().length > 2;
  }

  private isEmailValid(): boolean {
    const value = this.email.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private isPhoneValid(): boolean {
    const digits = this.telefone.replace(/\D/g, '');
    return digits.length >= 10;
  }
}
