import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { TerminalPdv, TerminaisFiltro } from './models';
import { TerminaisService } from './service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminaisPage implements OnInit {
  private readonly service = inject(TerminaisService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly terminais = signal<TerminalPdv[]>([]);

  readonly filtro = signal<TerminaisFiltro>({
    termo: '',
    status: 'TODOS',
    somenteAtivos: true,
  });

  readonly statusOptions = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Ativos', value: 'ATIVOS' },
    { label: 'Inativos', value: 'INATIVOS' },
  ] as const;

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.errorMsg.set(null);

    this.service
      .list(this.filtro())
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (items) => this.terminais.set(items),
        error: (err: unknown) => {
          console.error(err);
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao carregar terminais');
        },
      });
  }

  patchFiltro(patch: Partial<TerminaisFiltro>): void {
    this.filtro.update((cur) => ({ ...cur, ...patch }));
  }

  onToggleAtivo(terminalId: string, value: boolean): void {
    this.executarAcaoOtimista(
      terminalId,
      (t) => ({ ...t, ativo: value }),
      () => this.service.toggleAtivo(terminalId, value)
    );
  }

  onExcluir(terminalId: string): void {
    const snapshot = this.terminais();
    this.terminais.update((arr) => arr.filter((t) => t.id !== terminalId));

    this.service
      .delete(terminalId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err: unknown) => {
          console.error(err);
          this.terminais.set(snapshot);
          this.errorMsg.set('Não foi possível excluir o terminal.');
        },
      });
  }

  statusBadge(ativo: boolean): string {
    return ativo ? 'badge badge-success badge-sm' : 'badge badge-ghost badge-sm';
  }

  booleanBadge(value: boolean): string {
    return value ? 'badge badge-success badge-sm' : 'badge badge-ghost badge-sm';
  }

  trackById(_: number, item: TerminalPdv): string {
    return item.id;
  }

  private executarAcaoOtimista(
    id: string,
    updateFn: (t: TerminalPdv) => TerminalPdv,
    serviceCall: () => any
  ) {
    const snapshot = this.terminais();
    this.terminais.update((arr) => arr.map((t) => (t.id === id ? updateFn(t) : t)));

    serviceCall()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err: unknown) => {
          console.error(err);
          this.terminais.set(snapshot);
          this.errorMsg.set('Falha ao sincronizar alteração.');
        },
      });
  }
}
