import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { RelatorioVendasService } from './service';
import { FormaPagamento, Venda, VendaFiltro } from './models';
import { PAGAMENTO_LABELS, formatCurrency, formatDateTime } from './utils';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatorioVendasPage {
  private readonly service = inject(RelatorioVendasService);
  private readonly destroyRef = inject(DestroyRef);

  readonly abaAtiva = signal<'listagem' | 'insights'>('listagem');
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly vendas = signal<Venda[]>([]);
  readonly expandidoIds = signal<Set<string>>(new Set());

  readonly filtros = signal<VendaFiltro>({
    dataInicio: '2024-09-01',
    dataFim: '2024-09-07',
    terminal: 'TODOS',
    operador: 'TODOS',
    formaPagamento: 'TODOS',
    produto: '',
    cliente: '',
  });

  readonly terminais = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Terminal 1', value: 'Terminal 1' },
    { label: 'Terminal 2', value: 'Terminal 2' },
    { label: 'Terminal 3', value: 'Terminal 3' },
  ] as const;

  readonly operadores = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Camila', value: 'Camila' },
    { label: 'Rafael', value: 'Rafael' },
    { label: 'Maria', value: 'Maria' },
  ] as const;

  readonly formasPagamento = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Saldo', value: 'SALDO' },
    { label: 'Dinheiro', value: 'DINHEIRO' },
    { label: 'Convênio', value: 'CONVENIO' },
  ] as const;


  readonly vendasFiltradas = computed(() => this.vendas());

  readonly totalVendido = computed(() =>
    this.vendasFiltradas().reduce((acc, venda) => acc + venda.total, 0)
  );

  readonly ticketMedio = computed(() => {
    const total = this.totalVendido();
    const quantidade = this.vendasFiltradas().length || 1;
    return total / quantidade;
  });

  readonly vendasPorDia = computed(() => {
    const agrupado = new Map<string, number>();
    this.vendasFiltradas().forEach((venda) => {
      const label = new Date(venda.dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      agrupado.set(label, (agrupado.get(label) || 0) + venda.total);
    });
    const itens = Array.from(agrupado.entries()).map(([label, valor]) => ({ label, valor }));
    const max = Math.max(...itens.map((item) => item.valor), 1);
    return itens.map((item) => ({ ...item, percentual: (item.valor / max) * 100 }));
  });

  readonly topProdutos = computed(() => {
    const agrupado = new Map<string, { quantidade: number; total: number }>();
    this.vendasFiltradas().forEach((venda) => {
      venda.itens.forEach((item) => {
        const atual = agrupado.get(item.produto) || { quantidade: 0, total: 0 };
        agrupado.set(item.produto, {
          quantidade: atual.quantidade + item.quantidade,
          total: atual.total + item.total,
        });
      });
    });
    return Array.from(agrupado.entries())
      .map(([produto, dados]) => ({ produto, ...dados }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  });

  readonly vendasPorTerminal = computed(() => {
    const agrupado = new Map<string, { quantidade: number; total: number }>();
    this.vendasFiltradas().forEach((venda) => {
      const atual = agrupado.get(venda.terminal) || { quantidade: 0, total: 0 };
      agrupado.set(venda.terminal, {
        quantidade: atual.quantidade + 1,
        total: atual.total + venda.total,
      });
    });
    return Array.from(agrupado.entries())
      .map(([terminal, dados]) => ({ terminal, ...dados }))
      .sort((a, b) => b.total - a.total);
  });

  readonly distribuicaoPagamento = computed(() => {
    const total = this.vendasFiltradas().length || 1;
    const agrupado = new Map<FormaPagamento, number>();
    this.vendasFiltradas().forEach((venda) => {
      agrupado.set(venda.formaPagamento, (agrupado.get(venda.formaPagamento) || 0) + 1);
    });
    return Array.from(agrupado.entries()).map(([forma, quantidade]) => ({
      label: this.pagamentoLabel(forma),
      quantidade,
      percentual: (quantidade / total) * 100,
    }));
  });

  constructor() {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.service
      .listVendas(this.filtros())
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (vendas) => this.vendas.set(vendas),
        error: () => this.errorMsg.set('Falha ao carregar vendas.'),
      });
  }

  buscar(): void {
    if (!this.filtros().dataInicio || !this.filtros().dataFim) {
      this.errorMsg.set('Informe o intervalo de datas para buscar.');
      return;
    }
    this.errorMsg.set(null);
    this.carregarDados();
  }

  patchFiltro(patch: Partial<VendaFiltro>): void {
    this.filtros.update((atual) => ({ ...atual, ...patch }));
  }

  toggleItens(vendaId: string): void {
    this.expandidoIds.update((set) => {
      const novo = new Set(set);
      if (novo.has(vendaId)) {
        novo.delete(vendaId);
      } else {
        novo.add(vendaId);
      }
      return novo;
    });
  }

  expandido(vendaId: string): boolean {
    return this.expandidoIds().has(vendaId);
  }

  subtotal(venda: Venda): number {
    return venda.itens.reduce((acc, item) => acc + item.total, 0);
  }

  pagamentoLabel(forma: FormaPagamento): string {
    return PAGAMENTO_LABELS[forma];
  }

  formatCurrency(valor: number): string {
    return formatCurrency(valor);
  }

  formatDateTime(data: string): string {
    return formatDateTime(data);
  }

  trackById(_: number, venda: Venda): string {
    return venda.id;
  }
}
