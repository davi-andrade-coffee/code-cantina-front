import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { LogsSistemaService } from './service';
import { LogCategoria, LogFiltro, LogRegistro } from './models';
import { CATEGORIA_BADGES, CATEGORIA_LABELS, ORIGEM_BADGES, formatDateInput, formatDateTime } from './utils';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsSistemaPage {
  private readonly service = inject(LogsSistemaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly logs = signal<LogRegistro[]>([]);

  readonly filtros = signal<LogFiltro>(this.defaultFiltro());

  readonly categorias = [
    { label: 'Todos', value: 'TODOS' },
    ...Object.entries(CATEGORIA_LABELS).map(([value, label]) => ({
      value: value as LogCategoria,
      label,
    })),
  ];

  readonly operadores = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Camila Souza', value: 'Camila Souza' },
    { label: 'Rafael Nunes', value: 'Rafael Nunes' },
    { label: 'Fernanda Silva', value: 'Fernanda Silva' },
    { label: 'Ricardo Lima', value: 'Ricardo Lima' },
    { label: 'Financeiro', value: 'Financeiro' },
    { label: 'Atendimento', value: 'Atendimento' },
    { label: 'Equipe Suporte', value: 'Equipe Suporte' },
  ];

  readonly terminais = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'PDV-01', value: 'PDV-01' },
    { label: 'PDV-02', value: 'PDV-02' },
    { label: 'PDV-03', value: 'PDV-03' },
    { label: 'Admin-01', value: 'Admin-01' },
    { label: 'Admin-02', value: 'Admin-02' },
    { label: 'Admin-03', value: 'Admin-03' },
    { label: 'Finance-01', value: 'Finance-01' },
    { label: 'Admin-Help', value: 'Admin-Help' },
  ];

  readonly tamanhosPagina = [6, 8, 12, 16];
  readonly paginaAtual = signal(1);
  readonly itensPorPagina = signal(8);

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.logs().length / this.itensPorPagina()))
  );

  readonly paginaLogs = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina();
    return this.logs().slice(inicio, inicio + this.itensPorPagina());
  });

  constructor() {
    this.buscar();
  }

  buscar(): void {
    const { dataInicio, dataFim } = this.filtros();
    if (dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)) {
      this.errorMsg.set('A data inicial deve ser anterior à data final.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    this.service
      .listLogs(this.filtros())
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (logs) => {
          this.logs.set(logs);
          this.paginaAtual.set(1);
        },
        error: () => this.errorMsg.set('Falha ao carregar logs do sistema.'),
      });
  }

  patchFiltro(patch: Partial<LogFiltro>): void {
    this.filtros.update((atual) => ({ ...atual, ...patch }));
  }

  voltarPagina(): void {
    this.paginaAtual.update((pagina) => Math.max(1, pagina - 1));
  }

  avancarPagina(): void {
    this.paginaAtual.update((pagina) => Math.min(this.totalPaginas(), pagina + 1));
  }

  setItensPorPagina(valor: string | number): void {
    const novo = Number(valor);
    this.itensPorPagina.set(novo);
    this.paginaAtual.set(1);
  }

  categoriaLabel(categoria: LogCategoria): string {
    return CATEGORIA_LABELS[categoria];
  }

  categoriaBadge(categoria: LogCategoria): string {
    return CATEGORIA_BADGES[categoria];
  }

  origemBadge(origem: string): string {
    return ORIGEM_BADGES[origem] ?? 'badge badge-outline badge-sm';
  }

  formatDateTime(data: string): string {
    return formatDateTime(data);
  }

  trackById(_: number, item: LogRegistro): string {
    return item.id;
  }

  private defaultFiltro(): LogFiltro {
    const hoje = new Date();
    const inicio = new Date();
    inicio.setDate(hoje.getDate() - 7);

    return {
      dataInicio: formatDateInput(inicio),
      dataFim: formatDateInput(hoje),
      categoria: 'TODOS',
      operador: 'TODOS',
      terminal: 'TODOS',
      termo: '',
    };
  }
}
