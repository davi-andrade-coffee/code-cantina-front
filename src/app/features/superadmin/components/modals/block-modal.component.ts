import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'superadmin-block-modal',
  template: `
    <div class="modal" [class.modal-open]="open">
      <div class="modal-box">
        <h3 class="font-semibold text-lg">{{ title }}</h3>
        <p class="text-sm opacity-70 mt-1">{{ subtitle }}</p>

        <label class="form-control mt-4">
          <div class="label">
            <span class="label-text text-xs opacity-70">Motivo do bloqueio</span>
          </div>
          <textarea
            class="textarea textarea-bordered min-h-[90px]"
            [(ngModel)]="reason"
            placeholder="Detalhe o motivo para auditoria e suporte"
          ></textarea>
        </label>

        <div class="modal-action">
          <button class="btn btn-ghost" (click)="onClose()">Cancelar</button>
          <button class="btn btn-error" (click)="confirm.emit(reason)">Confirmar bloqueio</button>
        </div>
      </div>
    </div>
  `,
})
export class BlockModalComponent {
  @Input() open = false;
  @Input() title = 'Bloquear';
  @Input() subtitle = 'Confirme o bloqueio e registre o motivo.';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();

  reason = '';

  onClose(): void {
    this.reason = '';
    this.close.emit();
  }
}
