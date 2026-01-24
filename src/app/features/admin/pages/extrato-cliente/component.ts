import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { ExtratoClienteService } from './service';
import { ExtratoFiltro, Movimentacao, PessoaExtrato, TipoMovimento } from './models';
import {
  MOVIMENTO_LABELS,
  PAGAMENTO_LABELS,
  PESSOA_LABELS,
  PLANO_LABELS,
  formatCurrency,
  formatDateTime,
} from './utils';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtratoClientePage {
  private readonly service = inject(ExtratoClienteService);
  private readonly destroyRef = inject(DestroyRef);

  readonly abaAtiva = signal<'listagem' | 'insights'>('listagem');
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly pessoas = signal<PessoaExtrato[]>([]);
  readonly movimentacoes = signal<Movimentacao[]>([]);

  readonly filtros = signal<ExtratoFiltro>({
    pessoaId: '',
    dataInicio: '',
    dataFim: '',
    tipoMovimento: 'TODOS',
    terminal: 'TODOS',
    texto: '',
  });

  readonly detalheSelecionado = signal<Movimentacao | null>(null);

  readonly tiposMovimento = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Consumo', value: 'CONSUMO' },
    { label: 'Carga', value: 'CARGA' },
    { label: 'Ajuste', value: 'AJUSTE' },
  ] as const;

  readonly terminais = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Terminal 1 - Camila', value: 'Terminal 1' },
    { label: 'Terminal 2 - Rafael', value: 'Terminal 2' },
    { label: 'Terminal 3 - Maria', value: 'Terminal 3' },
  ] as const;

  readonly pessoaSelecionada = computed(() =>
    this.pessoas().find((pessoa) => pessoa.id === this.filtros().pessoaId)
  );

  readonly consumoMes = computed(() =>
    this.movimentacoes()
      .filter((item) => item.tipo === 'CONSUMO')
      .reduce((acc, item) => acc + item.valor, 0)
  );

  readonly consumoDiario = computed(() => {
    const consumos = this.movimentacoes().filter((item) => item.tipo === 'CONSUMO');
    const agrupado = new Map<string, number>();

    consumos.forEach((item) => {
      const label = new Date(item.dataHora).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
      agrupado.set(label, (agrupado.get(label) || 0) + item.valor);
    });

    const itens = Array.from(agrupado.entries()).map(([label, valor]) => ({ label, valor }));
    const max = Math.max(...itens.map((item) => item.valor), 1);

    return itens.map((item) => ({ ...item, percentual: (item.valor / max) * 100 }));
  });

  readonly topProdutos = computed(() => {
    const consumos = this.movimentacoes().filter((item) => item.tipo === 'CONSUMO');
    const agrupado = new Map<string, { quantidade: number; valor: number }>();

    consumos.forEach((item) => {
      const atual = agrupado.get(item.produto) || { quantidade: 0, valor: 0 };
      agrupado.set(item.produto, {
        quantidade: atual.quantidade + 1,
        valor: atual.valor + item.valor,
      });
    });

    return Array.from(agrupado.entries())
      .map(([produto, dados]) => ({ produto, ...dados }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);
  });

  readonly distribuicaoPagamento = computed(() => {
    const consumos = this.movimentacoes().filter((item) => item.tipo === 'CONSUMO');
    const total = consumos.length || 1;
    const agrupado = new Map<Movimentacao['formaPagamento'], number>();

    consumos.forEach((item) => {
      agrupado.set(item.formaPagamento, (agrupado.get(item.formaPagamento) || 0) + 1);
    });

    return Array.from(agrupado.entries()).map(([forma, quantidade]) => ({
      label: this.pagamentoLabel(forma),
      quantidade,
      percentual: (quantidade / total) * 100,
    }));
  });

  readonly detalheAberto = computed(() => this.detalheSelecionado() !== null);
  readonly saldoValor = computed(() => {
    const pessoa = this.pessoaSelecionada();
    if (!pessoa) return '—';
    if (pessoa.plano === 'CONVENIO') return '—';
    return this.formatCurrency(pessoa.saldoAtual);
  });
  readonly saldoDescricao = computed(() => {
    const pessoa = this.pessoaSelecionada();
    if (!pessoa) return 'Carteira não selecionada';
    if (pessoa.plano === 'CONVENIO') return 'Convênio (sem saldo)';
    return 'Carteira ativa';
  });

  constructor() {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.service
      .listPessoas()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (pessoas) => {
          this.pessoas.set(pessoas);
          if (!this.filtros().pessoaId && pessoas.length > 0) {
            this.filtros.update((current) => ({ ...current, pessoaId: pessoas[0].id }));
          }
          this.buscar();
        },
        error: (err) => {
          console.error(err);
          this.errorMsg.set('Falha ao carregar pessoas.');
        },
      });
  }

  buscar(): void {
    if (!this.filtros().pessoaId) {
      this.errorMsg.set('Selecione uma pessoa para buscar.');
      return;
    }

    this.errorMsg.set(null);
    this.service
      .listMovimentacoes(this.filtros())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (movimentacoes) => this.movimentacoes.set(movimentacoes),
        error: () => this.errorMsg.set('Falha ao carregar movimentações.'),
      });
  }

  patchFiltro(patch: Partial<ExtratoFiltro>): void {
    this.filtros.update((atual) => ({ ...atual, ...patch }));
  }

  abrirDetalhes(item: Movimentacao): void {
    this.detalheSelecionado.set(item);
  }

  fecharDetalhes(): void {
    this.detalheSelecionado.set(null);
  }

  tipoPessoaLabel(tipo?: PessoaExtrato['tipo']): string {
    return tipo ? PESSOA_LABELS[tipo] : '—';
  }

  planoLabel(tipo?: PessoaExtrato['plano']): string {
    return tipo ? PLANO_LABELS[tipo] : '—';
  }

  tipoMovimentoLabel(tipo?: TipoMovimento): string {
    return tipo ? MOVIMENTO_LABELS[tipo] : '—';
  }

  pagamentoLabel(forma?: Movimentacao['formaPagamento']): string {
    return forma ? PAGAMENTO_LABELS[forma] : '—';
  }

  formatCurrency(valor: number): string {
    return formatCurrency(valor);
  }

  formatDateTime(data: string): string {
    return formatDateTime(data);
  }

  trackById(_: number, item: Movimentacao): string {
    return item.id;
  }
}
