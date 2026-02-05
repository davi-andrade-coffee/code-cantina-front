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
            <div class="label" *ngIf="showError('nome')">
              <span class="label-text-alt text-error">Informe o nome da loja.</span>
            </div>
          </label>
          <label class="form-control">
            <div class="label">
              <span class="label-text text-xs opacity-70">CNPJ (identificador único)</span>
            </div>
            <input class="input input-bordered" [(ngModel)]="cnpj" placeholder="00.000.000/0000-00" />
            <div class="label" *ngIf="showError('cnpj')">
              <span class="label-text-alt text-error">Informe um CNPJ válido.</span>
            </div>
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
            <div class="label" *ngIf="showError('mensalidade')">
              <span class="label-text-alt text-error">Informe um valor maior que zero.</span>
            </div>
          </label>
          <label class="form-control">
            <div class="label">
              <span class="label-text text-xs opacity-70">Vencimento da fatura</span>
            </div>
            <input class="input input-bordered" type="number" [(ngModel)]="vencimento" />
            <div class="label" *ngIf="showError('vencimento')">
              <span class="label-text-alt text-error">Selecione a data de vencimento.</span>
            </div>
          </label>
        </div>

        <div class="modal-action">
          <button class="btn btn-ghost" [disabled]="submitting" (click)="onClose()">Cancelar</button>
          <button class="btn btn-primary" [disabled]="submitting || !formValid()" (click)="onConfirm()">
            <span *ngIf="!submitting">{{ mode === 'EDITAR' ? 'Salvar alterações' : 'Salvar loja' }}</span>
            <span *ngIf="submitting" class="loading loading-spinner loading-xs"></span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CreateStoreModalComponent implements OnChanges {
  @Input() open = false;
  @Input() submitting = false;
  @Input() mode: 'CRIAR' | 'EDITAR' = 'CRIAR';
  @Input() storeId?: string | null;
  @Input() store?: { nome: string; cnpj: string; mensalidade: number; vencimento: number } | null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{
    id?: string | null;
    nome: string;
    cnpj: string;
    mensalidade: number;
    vencimento: number;
  }>();

  nome = '';
  cnpj = '';
  mensalidade = 0;
  vencimento = 1;
  submitted = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['store'] || changes['open']) {
      this.nome = this.store?.nome ?? '';
      this.cnpj = this.store?.cnpj ?? '';
      this.mensalidade = this.store?.mensalidade ?? 0;
      this.vencimento = this.store?.vencimento ?? 1;
      this.submitted = false;
    }
  }

  onClose(): void {
    this.nome = '';
    this.cnpj = '';
    this.mensalidade = 0;
    this.vencimento = 1;
    this.submitted = false;
    this.close.emit();
  }

  onConfirm(): void {
    if (this.submitting) return;
    this.submitted = true;
    if (!this.formValid()) return;
    this.confirm.emit({
      id: this.storeId,
      nome: this.nome.trim(),
      cnpj: this.cnpj.trim(),
      mensalidade: Number(this.mensalidade),
      vencimento: this.vencimento,
    });
  }

  formValid(): boolean {
    return this.isNameValid() && this.isCnpjValid() && this.isMensalidadeValid() && this.isVencimentoValid();
  }

  showError(field: 'nome' | 'cnpj' | 'mensalidade' | 'vencimento'): boolean {
    if (!this.submitted) return false;
    if (field === 'nome') return !this.isNameValid();
    if (field === 'cnpj') return !this.isCnpjValid();
    if (field === 'mensalidade') return !this.isMensalidadeValid();
    return !this.isVencimentoValid();
  }

  private isNameValid(): boolean {
    return this.nome.trim().length > 1;
  }

  private isCnpjValid(): boolean {
    const digits = this.cnpj.replace(/\D/g, '');
    return digits.length === 14;
  }

  private isMensalidadeValid(): boolean {
    return Number(this.mensalidade) > 0;
  }

  private isVencimentoValid(): boolean {
    return Number(this.mensalidade) > 0;
  }
}
