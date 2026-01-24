import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'superadmin-status-badge',
  template: `
    <span [class]="badgeClass">{{ status }}</span>
  `,
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() kind: 'admin' | 'store' | 'invoice' = 'admin';

  get badgeClass(): string {
    const base = 'badge badge-sm';
    const map: Record<string, string> = {
      ATIVO: 'badge-success',
      BLOQUEADO: 'badge-error',
      ATIVA: 'badge-success',
      BLOQUEADA: 'badge-error',
      CANCELADA: 'badge-ghost',
      EM_ABERTO: 'badge-warning',
      PAGA: 'badge-success',
      VENCIDA: 'badge-error',
      CANCELADA_FATURA: 'badge-ghost',
    };

    if (this.kind === 'invoice' && this.status === 'CANCELADA') {
      return `${base} ${map['CANCELADA_FATURA']}`;
    }

    return `${base} ${map[this.status] ?? 'badge-outline'}`;
  }
}
