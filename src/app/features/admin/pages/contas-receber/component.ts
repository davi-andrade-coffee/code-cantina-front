import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { ContasReceberService } from './service';
import { EvolucaoRecebimentoItem, FiltroRecebiveis, Recebivel, StatusRecebivel } from './models';
import {
  STATUS_CLASSES,
  STATUS_LABELS,
  PESSOA_LABELS,
  competenciaLabel,
  formatCurrency,
  formatDate,
} from './utils';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContasReceberPage {
  private readonly service = inject(ContasReceberService);
  private readonly destroyRef = inject(DestroyRef);

  readonly hoje = new Date().toLocaleDateString('pt-BR');
  readonly abaAtiva = signal<'listagem' | 'insights'>('listagem');

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly filtros = signal<FiltroRecebiveis>({
    competencia: '2024-09',
    status: 'TODOS',
    tipoPessoa: 'TODOS',
    termo: '',
    // somenteInadimplentes: false,
  });

  readonly recebiveis = signal<Recebivel[]>([]);

  readonly paginaAtual = signal(1);
  readonly itensPorPagina = signal(5);

  readonly statusOptions = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Em aberto', value: 'EM_ABERTO' },
    { label: 'Quitado', value: 'QUITADO' },
    { label: 'Vencido', value: 'VENCIDO' },
  ] as const;

  readonly tiposPessoa = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Aluno', value: 'ALUNO' },
    { label: 'Professor', value: 'PROFESSOR' },
    { label: 'Outros', value: 'OUTRO' },
  ] as const;

  readonly tamanhosPagina = [5, 10, 20];

  readonly recebiveisFiltrados = computed(() => this.recebiveis());

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.recebiveisFiltrados().length / this.itensPorPagina()))
  );

  readonly paginaRecebiveis = computed(() => {
    const start = (this.paginaAtual() - 1) * this.itensPorPagina();
    return this.recebiveisFiltrados().slice(start, start + this.itensPorPagina());
  });

  readonly inadimplentes = computed(() =>
    this.recebiveisFiltrados().filter((item) => item.status !== 'QUITADO')
  );

  readonly totalAReceber = computed(() =>
    this.recebiveisFiltrados().reduce((acc, item) => acc + item.valorDevido, 0)
  );

  readonly totalRecebido = computed(() =>
    this.recebiveisFiltrados().reduce((acc, item) => acc + item.valorPago, 0)
  );

  readonly saldoEmAberto = computed(() => this.totalAReceber() - this.totalRecebido());

  readonly evolucaoRecebimento = computed(() => {
    const base: EvolucaoRecebimentoItem[] = [
      { label: 'Sem 1', valor: this.totalRecebido() * 0.18 },
      { label: 'Sem 2', valor: this.totalRecebido() * 0.29 },
      { label: 'Sem 3', valor: this.totalRecebido() * 0.27 },
      { label: 'Sem 4', valor: this.totalRecebido() * 0.26 },
    ];
    const max = Math.max(...base.map((item) => item.valor), 1);
    return base.map((item) => ({
      ...item,
      percentual: (item.valor / max) * 100,
    }));
  });

  readonly topDevedores = computed(() =>
    [...this.inadimplentes()]
      .sort((a, b) => b.valorDevido - b.valorPago - (a.valorDevido - a.valorPago))
      .slice(0, 10)
  );

  readonly distribuicaoStatus = computed(() => {
    const total = this.recebiveisFiltrados().length || 1;
    return (['EM_ABERTO', 'QUITADO', 'VENCIDO'] as StatusRecebivel[]).map((status) => {
      const quantidade = this.recebiveisFiltrados().filter((item) => item.status === status).length;
      return {
        status,
        quantidade,
        percentual: (quantidade / total) * 100,
      };
    });
  });

  constructor() {
    this.buscar();
  }

  buscar(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.errorMsg.set(null);

    this.service
      .list(this.filtros())
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (items) => {
          this.recebiveis.set(items);
          this.paginaAtual.set(1);
        },
        error: (err: unknown) => {
          console.error(err);
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao carregar recebíveis');
        },
      });
  }

  patchFiltro(patch: Partial<FiltroRecebiveis>): void {
    this.filtros.update((atual) => ({ ...atual, ...patch }));
    this.paginaAtual.set(1);
  }

  onEnviarCobranca(item: Recebivel): void {
    const dataHoje = new Date().toISOString().slice(0, 10);
    const snapshot = this.recebiveis();

    this.recebiveis.update((lista) =>
      lista.map((entry) => (entry.id === item.id ? { ...entry, ultimaCobranca: dataHoje } : entry))
    );
    this.service
      .enviarCobranca(item.id, dataHoje)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.recebiveis.set(snapshot);
          this.errorMsg.set('Não foi possível enviar a cobrança.');
        },
      });
  }

  onMarcarPagamento(item: Recebivel): void {
    const snapshot = this.recebiveis();
    const atualizado = { ...item, valorPago: item.valorDevido, status: 'QUITADO' as const };

    this.recebiveis.update((lista) => lista.map((entry) => (entry.id === item.id ? atualizado : entry)));

    this.service
      .marcarPagamento(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.recebiveis.set(snapshot);
          this.errorMsg.set('Não foi possível marcar o pagamento.');
        },
      });
  }

  voltarPagina(): void {
    this.paginaAtual.update((pagina) => Math.max(1, pagina - 1));
  }

  avancarPagina(): void {
    this.paginaAtual.update((pagina) => Math.min(this.totalPaginas(), pagina + 1));
  }

  setItensPorPagina(valor: number | string): void {
    const numeric = typeof valor === 'string' ? Number(valor) : valor;
    this.itensPorPagina.set(numeric);
    this.paginaAtual.set(1);
  }

  statusLabel(status: StatusRecebivel): string {
    return STATUS_LABELS[status];
  }

  statusClass(status: StatusRecebivel): string {
    return STATUS_CLASSES[status];
  }

  tipoPessoaLabel(tipo?: Recebivel['pessoaTipo']): string {
    return tipo ? PESSOA_LABELS[tipo] : '—';
  }

  competenciaLabel(competencia: string): string {
    return competenciaLabel(competencia);
  }

  formatCurrency(valor: number): string {
    return formatCurrency(valor);
  }

  formatDate(data: string): string {
    return formatDate(data);
  }

  trackById(_: number, item: Recebivel): string {
    return item.id;
  }
}
