import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { RelatorioVendasService } from './service';
import { FormaPagamento, Venda, VendaFiltro } from './models';
import { PAGAMENTO_LABELS, STATUS_CLASSES, STATUS_LABELS, formatCurrency, formatDateTime } from './utils';

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
  readonly vendaSelecionada = signal<Venda | null>(null);

  readonly filtros = signal<VendaFiltro>({
    dataInicio: '2024-09-01',
    dataFim: '2024-09-07',
    terminal: 'TODOS',
    operador: 'TODOS',
    formaPagamento: 'TODOS',
    produto: '',
    cliente: '',
    status: 'TODOS',
  });

  readonly filtrosAplicados = signal<VendaFiltro>({ ...this.filtros() });

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

  readonly statusOptions = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Concluída', value: 'CONCLUIDA' },
    { label: 'Cancelada', value: 'CANCELADA' },
    { label: 'Estornada', value: 'ESTORNADA' },
  ] as const;

  readonly vendasFiltradas = computed(() => {
    const filtros = this.filtrosAplicados();
    if (!filtros.dataInicio || !filtros.dataFim) return [];

    const inicio = new Date(filtros.dataInicio);
    const fim = new Date(filtros.dataFim);
    const produtoLower = filtros.produto.trim().toLowerCase();
    const clienteLower = filtros.cliente.trim().toLowerCase();

    return this.vendas().filter((venda) => {
      const dataVenda = new Date(venda.dataHora);
      const dataOk = dataVenda >= inicio && dataVenda <= new Date(fim.getTime() + 86400000 - 1);
      const terminalOk = filtros.terminal === 'TODOS' || venda.terminal === filtros.terminal;
      const operadorOk = filtros.operador === 'TODOS' || venda.operador === filtros.operador;
      const statusOk = filtros.status === 'TODOS' || venda.status === filtros.status;
      const pagamentoOk =
        filtros.formaPagamento === 'TODOS' || venda.formasPagamento.includes(filtros.formaPagamento as FormaPagamento);
      const produtoOk =
        produtoLower.length === 0 || venda.itens.some((item) => item.produto.toLowerCase().includes(produtoLower));
      const clienteOk =
        clienteLower.length === 0 ||
        venda.cliente?.toLowerCase().includes(clienteLower) ||
        venda.registroCliente?.toLowerCase().includes(clienteLower);

      return dataOk && terminalOk && operadorOk && statusOk && pagamentoOk && produtoOk && clienteOk;
    });
  });

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
      venda.formasPagamento.forEach((forma) => {
        agrupado.set(forma, (agrupado.get(forma) || 0) + 1);
      });
    });
    return Array.from(agrupado.entries()).map(([forma, quantidade]) => ({
      label: this.pagamentoLabel(forma),
      quantidade,
      percentual: (quantidade / total) * 100,
    }));
  });

  readonly detalhesAberto = computed(() => this.vendaSelecionada() !== null);

  constructor() {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.service
      .listVendas()
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
    this.filtrosAplicados.set({ ...this.filtros() });
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

  abrirDetalhes(venda: Venda): void {
    this.vendaSelecionada.set(venda);
  }

  fecharDetalhes(): void {
    this.vendaSelecionada.set(null);
  }

  onEstornar(venda: Venda): void {
    this.vendas.update((lista) =>
      lista.map((item) => (item.id === venda.id ? { ...item, status: 'ESTORNADA' } : item))
    );
  }

  statusLabel(status: Venda['status']): string {
    return STATUS_LABELS[status];
  }

  statusClass(status: Venda['status']): string {
    return STATUS_CLASSES[status];
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
