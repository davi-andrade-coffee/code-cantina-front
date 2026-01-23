import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Colaborador, ColaboradoresFiltro } from './models';
import { ColaboradoresService } from './service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColaboradoresPage implements OnInit {
  private readonly service = inject(ColaboradoresService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly colaboradores = signal<Colaborador[]>([]);

  readonly filtro = signal<ColaboradoresFiltro>({
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
        next: (items) => this.colaboradores.set(items),
        error: (err: unknown) => {
          console.error(err);
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao carregar colaboradores');
        },
      });
  }

  patchFiltro(patch: Partial<ColaboradoresFiltro>): void {
    this.filtro.update((cur) => ({ ...cur, ...patch }));
  }

  onToggleAtivo(colaboradorId: string, value: boolean): void {
    this.executarAcaoOtimista(
      colaboradorId,
      (c) => ({ ...c, ativa: value }),
      () => this.service.toggleAtiva(colaboradorId, value)
    );
  }

  onExcluir(colaboradorId: string): void {
    const snapshot = this.colaboradores();
    this.colaboradores.update((arr) => arr.filter((c) => c.id !== colaboradorId));

    this.service
      .delete(colaboradorId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err: unknown) => {
          console.error(err);
          this.colaboradores.set(snapshot);
          this.errorMsg.set('Não foi possível excluir o colaborador.');
        },
      });
  }

  getInitials(nome: string): string {
    const parts = nome.trim().split(' ').filter(Boolean);
    const initials = parts.slice(0, 2).map((p) => p[0].toUpperCase());
    return initials.join('');
  }

  trackById(_: number, item: Colaborador): string {
    return item.id;
  }

  private executarAcaoOtimista(
    id: string,
    updateFn: (c: Colaborador) => Colaborador,
    serviceCall: () => any
  ) {
    const snapshot = this.colaboradores();
    this.colaboradores.update((arr) => arr.map((c) => (c.id === id ? updateFn(c) : c)));

    serviceCall()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err: unknown) => {
          console.error(err);
          this.colaboradores.set(snapshot);
          this.errorMsg.set('Falha ao sincronizar alteração.');
        },
      });
  }
}
