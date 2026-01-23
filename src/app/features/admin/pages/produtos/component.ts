import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Produto, ProdutoTipo, ProdutosFiltro } from './models';
import { ProdutosService } from './service';
import { formatCentsToBRL } from './util';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProdutosPage implements OnInit {
  private readonly service = inject(ProdutosService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly produtos = signal<Produto[]>([]);

  readonly filtro = signal<ProdutosFiltro>({
    termo: '',
    tipo: 'TODOS',
    status: 'TODOS',
    // somenteAtivos: true,
  });

  readonly tipos = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Unitário', value: 'UNITARIO' },
    { label: 'Por quilo', value: 'QUILO' },
  ] as const;

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
        next: (items) => this.produtos.set(items),
        error: (err: unknown) => {
          console.error(err);
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao carregar produtos');
        },
      });
  }

  patchFiltro(patch: Partial<ProdutosFiltro>): void {
    this.filtro.update((cur) => ({ ...cur, ...patch }));
  }

  onToggleAtivo(produtoId: string, value: boolean): void {
    this.executarAcaoOtimista(
      produtoId,
      (p) => ({ ...p, ativo: value }),
      () => this.service.toggleAtivo(produtoId, value)
    );
  }

  onExcluir(produtoId: string): void {
    const snapshot = this.produtos();
    this.produtos.update((arr) => arr.filter((p) => p.id !== produtoId));

    this.service
      .delete(produtoId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err: unknown) => {
          console.error(err);
          this.produtos.set(snapshot);
          this.errorMsg.set('Não foi possível excluir o produto.');
        },
      });
  }

  tipoLabel(tipo: ProdutoTipo): string {
    return tipo === 'UNITARIO' ? 'Unitário' : 'Por quilo';
  }

  tipoBadgeClass(tipo: ProdutoTipo): string {
    return tipo === 'UNITARIO' ? 'badge badge-success badge-sm' : 'badge badge-warning badge-sm';
  }

  formatPreco(tipo: ProdutoTipo, cents: number): string {
    const valor = formatCentsToBRL(cents);
    return tipo === 'UNITARIO' ? valor : `${valor}/kg`;
  }

  trackById(_: number, item: Produto): string {
    return item.id;
  }

  private executarAcaoOtimista(
    id: string,
    updateFn: (p: Produto) => Produto,
    serviceCall: () => any
  ) {
    const snapshot = this.produtos();
    this.produtos.update((arr) => arr.map((p) => (p.id === id ? updateFn(p) : p)));

    serviceCall()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err: unknown) => {
          console.error(err);
          this.produtos.set(snapshot);
          this.errorMsg.set('Falha ao sincronizar alteração.');
        },
      });
  }
}
