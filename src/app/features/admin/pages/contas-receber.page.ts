import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

type PessoaTipo = 'ALUNO' | 'PROFESSOR' | 'OUTRO';
type StatusRecebivel = 'EM_ABERTO' | 'PARCIAL' | 'QUITADO' | 'VENCIDO';

interface Recebivel {
  id: string;
  pessoaNome: string;
  pessoaTipo: PessoaTipo;
  responsavel?: string;
  documento: string;
  registro: string;
  competencia: string;
  valorDevido: number;
  valorPago: number;
  status: StatusRecebivel;
  ultimaCobranca: string;
}

interface FiltroRecebiveis {
  competencia: string;
  status: 'TODOS' | StatusRecebivel;
  tipo: 'TODOS' | PessoaTipo;
  termo: string;
  somenteInadimplentes: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap items-center justify-between mb-4 gap-3">
      <div>
        <h1 class="text-lg font-semibold">Contas a Receber (Convênio)</h1>
        <p class="text-sm opacity-70">Relatórios financeiros de clientes em plano convênio.</p>
      </div>

      <div class="flex items-center gap-2">
        <button class="btn btn-outline btn-sm" (click)="onAtualizarMock()">
          Atualizar mock
        </button>
        <button class="btn btn-success btn-sm" (click)="onNovaCobranca()">+ Nova cobrança</button>
      </div>
    </div>

    <div role="tablist" class="tabs tabs-lifted mb-4">
      <button
        role="tab"
        class="tab"
        [class.tab-active]="abaAtiva() === 'listagem'"
        (click)="abaAtiva.set('listagem')"
      >
        Listagem
      </button>
      <button
        role="tab"
        class="tab"
        [class.tab-active]="abaAtiva() === 'insights'"
        (click)="abaAtiva.set('insights')"
      >
        Insights
      </button>
    </div>

    <section
      *ngIf="abaAtiva() === 'listagem'"
      class="bg-base-300 rounded-lg border border-base-100 p-4"
    >
      <div class="flex flex-wrap items-end gap-3 mb-4">
        <label class="form-control w-full max-w-[160px]">
          <div class="label">
            <span class="label-text text-xs opacity-70">Competência *</span>
          </div>
          <input
            class="input input-bordered input-sm"
            type="month"
            [value]="filtros().competencia"
            (input)="patchFiltro({ competencia: $any($event.target).value })"
          />
        </label>

        <label class="form-control w-full max-w-[180px]">
          <div class="label">
            <span class="label-text text-xs opacity-70">Status</span>
          </div>
          <select
            class="select select-bordered select-sm"
            [value]="filtros().status"
            (change)="patchFiltro({ status: $any($event.target).value })"
          >
            <option *ngFor="let status of statusOptions" [value]="status.value">
              {{ status.label }}
            </option>
          </select>
        </label>

        <label class="form-control w-full max-w-[180px]">
          <div class="label">
            <span class="label-text text-xs opacity-70">Tipo de pessoa</span>
          </div>
          <select
            class="select select-bordered select-sm"
            [value]="filtros().tipo"
            (change)="patchFiltro({ tipo: $any($event.target).value })"
          >
            <option *ngFor="let tipo of tiposPessoa" [value]="tipo.value">{{ tipo.label }}</option>
          </select>
        </label>

        <label class="form-control w-full max-w-sm">
          <div class="label">
            <span class="label-text text-xs opacity-70">Buscar</span>
          </div>
          <input
            class="input input-bordered input-sm"
            placeholder="Nome, registro ou CPF"
            [value]="filtros().termo"
            (input)="patchFiltro({ termo: $any($event.target).value })"
          />
        </label>

        <label class="label cursor-pointer gap-2 mt-6">
          <input
            type="checkbox"
            class="checkbox checkbox-xs"
            [checked]="filtros().somenteInadimplentes"
            (change)="patchFiltro({ somenteInadimplentes: $any($event.target).checked })"
          />
          <span class="label-text text-xs opacity-70">Somente inadimplentes</span>
        </label>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div class="bg-base-200 rounded-lg border border-base-100 p-4">
          <div class="text-xs uppercase opacity-60">Total a receber</div>
          <div class="text-xl font-semibold mt-1">{{ formatCurrency(totalAReceber()) }}</div>
          <div class="text-xs opacity-60">Competência {{ competenciaLabel() }}</div>
        </div>
        <div class="bg-base-200 rounded-lg border border-base-100 p-4">
          <div class="text-xs uppercase opacity-60">Total recebido</div>
          <div class="text-xl font-semibold mt-1 text-success">
            {{ formatCurrency(totalRecebido()) }}
          </div>
          <div class="text-xs opacity-60">Atualizado em {{ hoje }}</div>
        </div>
        <div class="bg-base-200 rounded-lg border border-base-100 p-4">
          <div class="text-xs uppercase opacity-60">Saldo em aberto</div>
          <div class="text-xl font-semibold mt-1 text-warning">
            {{ formatCurrency(saldoEmAberto()) }}
          </div>
          <div class="text-xs opacity-60">Clientes {{ inadimplentes().length }}</div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="table table-zebra table-sm">
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Responsável</th>
              <th>Competência</th>
              <th class="text-right">Valor devido</th>
              <th class="text-right">Valor pago</th>
              <th>Status</th>
              <th>Última cobrança</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of recebiveisFiltrados(); trackBy: trackById">
              <td>
                <div class="font-semibold">{{ item.pessoaNome }}</div>
                <div class="text-xs opacity-70">
                  {{ tipoLabel(item.pessoaTipo) }} • {{ item.registro }}
                </div>
              </td>
              <td>
                <div class="text-sm">{{ item.responsavel || '—' }}</div>
                <div class="text-xs opacity-60">{{ item.documento }}</div>
              </td>
              <td>{{ competenciaLabel(item.competencia) }}</td>
              <td class="text-right">{{ formatCurrency(item.valorDevido) }}</td>
              <td class="text-right">{{ formatCurrency(item.valorPago) }}</td>
              <td>
                <span [class]="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
              </td>
              <td>{{ formatDate(item.ultimaCobranca) }}</td>
              <td class="text-right space-x-2">
                <button class="btn btn-ghost btn-xs" (click)="onVerExtrato(item)">Ver extrato</button>
                <button class="btn btn-ghost btn-xs" (click)="onEnviarCobranca(item)">
                  Enviar cobrança
                </button>
                <button class="btn btn-ghost btn-xs text-success" (click)="onMarcarPagamento(item)">
                  Marcar pagamento
                </button>
              </td>
            </tr>
            <tr *ngIf="recebiveisFiltrados().length === 0">
              <td colspan="8" class="text-center opacity-70 py-6">Nenhum registro encontrado.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="extratoSelecionado()" class="mt-4 bg-base-200 rounded-lg border border-base-100 p-4">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-sm opacity-70">Extrato do cliente</div>
            <h3 class="text-lg font-semibold">{{ extratoSelecionado()?.pessoaNome }}</h3>
            <p class="text-xs opacity-70">
              {{ tipoLabel(extratoSelecionado()?.pessoaTipo) }} • {{ extratoSelecionado()?.documento }}
            </p>
          </div>
          <button class="btn btn-ghost btn-xs" (click)="extratoSelecionado.set(null)">Fechar</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <div class="bg-base-300 rounded-lg border border-base-100 p-3">
            <div class="text-xs uppercase opacity-60">Valor devido</div>
            <div class="text-lg font-semibold">
              {{ formatCurrency(extratoSelecionado()?.valorDevido || 0) }}
            </div>
          </div>
          <div class="bg-base-300 rounded-lg border border-base-100 p-3">
            <div class="text-xs uppercase opacity-60">Valor pago</div>
            <div class="text-lg font-semibold text-success">
              {{ formatCurrency(extratoSelecionado()?.valorPago || 0) }}
            </div>
          </div>
          <div class="bg-base-300 rounded-lg border border-base-100 p-3">
            <div class="text-xs uppercase opacity-60">Saldo</div>
            <div class="text-lg font-semibold text-warning">
              {{
                formatCurrency(
                  (extratoSelecionado()?.valorDevido || 0) - (extratoSelecionado()?.valorPago || 0)
                )
              }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      *ngIf="abaAtiva() === 'insights'"
      class="bg-base-300 rounded-lg border border-base-100 p-4 space-y-4"
    >
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div class="bg-base-200 rounded-lg border border-base-100 p-4">
          <div class="text-xs uppercase opacity-60">Total a receber (mês)</div>
          <div class="text-2xl font-semibold mt-1">{{ formatCurrency(totalAReceber()) }}</div>
          <p class="text-xs opacity-60">Competência {{ competenciaLabel() }}</p>
        </div>
        <div class="bg-base-200 rounded-lg border border-base-100 p-4">
          <div class="text-xs uppercase opacity-60">Total recebido (mês)</div>
          <div class="text-2xl font-semibold mt-1 text-success">
            {{ formatCurrency(totalRecebido()) }}
          </div>
          <p class="text-xs opacity-60">Atualização mock automática</p>
        </div>
        <div class="bg-base-200 rounded-lg border border-base-100 p-4">
          <div class="text-xs uppercase opacity-60">Saldo em aberto</div>
          <div class="text-2xl font-semibold mt-1 text-warning">
            {{ formatCurrency(saldoEmAberto()) }}
          </div>
          <p class="text-xs opacity-60">{{ inadimplentes().length }} clientes em aberto</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-base-200 rounded-lg border border-base-100 p-4">
          <div class="text-sm font-semibold mb-2">Evolução do recebimento no mês</div>
          <div class="flex items-end gap-3 h-36">
            <div *ngFor="let item of evolucaoRecebimento()" class="flex-1">
              <div
                class="bg-success/60 rounded-t-md"
                [style.height.%]="item.percentual"
                [title]="item.label + ': ' + formatCurrency(item.valor)"
              ></div>
              <div class="text-[10px] opacity-60 text-center mt-1">{{ item.label }}</div>
            </div>
          </div>
        </div>

        <div class="bg-base-200 rounded-lg border border-base-100 p-4">
          <div class="text-sm font-semibold mb-2">Top 10 devedores do mês</div>
          <ul class="space-y-2">
            <li *ngFor="let item of topDevedores()" class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold">{{ item.pessoaNome }}</div>
                <div class="text-xs opacity-60">{{ tipoLabel(item.pessoaTipo) }}</div>
              </div>
              <div class="text-sm text-warning font-semibold">
                {{ formatCurrency(item.valorDevido - item.valorPago) }}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-base-200 rounded-lg border border-base-100 p-4">
        <div class="text-sm font-semibold mb-2">Distribuição por status</div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div
            *ngFor="let item of distribuicaoStatus()"
            class="bg-base-300 rounded-lg border border-base-100 p-3"
          >
            <div class="flex items-center justify-between mb-2">
              <span [class]="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
              <span class="text-xs opacity-60">{{ item.quantidade }} clientes</span>
            </div>
            <div class="h-2 rounded-full bg-base-100">
              <div class="h-2 rounded-full bg-primary" [style.width.%]="item.percentual"></div>
            </div>
            <div class="text-xs opacity-60 mt-1">{{ item.percentual | number: '1.0-0' }}%</div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContasReceberPage {
  readonly hoje = new Date().toLocaleDateString('pt-BR');
  readonly abaAtiva = signal<'listagem' | 'insights'>('listagem');

  readonly filtros = signal<FiltroRecebiveis>({
    competencia: '2024-09',
    status: 'TODOS',
    tipo: 'TODOS',
    termo: '',
    somenteInadimplentes: false,
  });

  readonly recebiveis = signal<Recebivel[]>([
    {
      id: '1',
      pessoaNome: 'Mariana Albuquerque',
      pessoaTipo: 'ALUNO',
      responsavel: 'Carlos Albuquerque',
      documento: '123.456.789-00',
      registro: 'ALU-0231',
      competencia: '2024-09',
      valorDevido: 420,
      valorPago: 120,
      status: 'PARCIAL',
      ultimaCobranca: '2024-09-05',
    },
    {
      id: '2',
      pessoaNome: 'Paulo Henrique',
      pessoaTipo: 'PROFESSOR',
      responsavel: '—',
      documento: '987.654.321-00',
      registro: 'PRO-1802',
      competencia: '2024-09',
      valorDevido: 380,
      valorPago: 0,
      status: 'VENCIDO',
      ultimaCobranca: '2024-09-02',
    },
    {
      id: '3',
      pessoaNome: 'Beatriz Campos',
      pessoaTipo: 'ALUNO',
      responsavel: 'Rita Campos',
      documento: '234.567.890-11',
      registro: 'ALU-0844',
      competencia: '2024-09',
      valorDevido: 520,
      valorPago: 520,
      status: 'QUITADO',
      ultimaCobranca: '2024-09-01',
    },
    {
      id: '4',
      pessoaNome: 'Henrique Lopes',
      pessoaTipo: 'OUTRO',
      responsavel: '—',
      documento: '345.678.901-22',
      registro: 'OUT-0342',
      competencia: '2024-09',
      valorDevido: 260,
      valorPago: 0,
      status: 'EM_ABERTO',
      ultimaCobranca: '2024-09-08',
    },
    {
      id: '5',
      pessoaNome: 'Camila Nogueira',
      pessoaTipo: 'ALUNO',
      responsavel: 'Eduardo Nogueira',
      documento: '456.789.012-33',
      registro: 'ALU-1129',
      competencia: '2024-09',
      valorDevido: 410,
      valorPago: 250,
      status: 'PARCIAL',
      ultimaCobranca: '2024-09-09',
    },
    {
      id: '6',
      pessoaNome: 'Sofia Carvalho',
      pessoaTipo: 'PROFESSOR',
      responsavel: '—',
      documento: '567.890.123-44',
      registro: 'PRO-0723',
      competencia: '2024-09',
      valorDevido: 310,
      valorPago: 0,
      status: 'EM_ABERTO',
      ultimaCobranca: '2024-09-06',
    },
    {
      id: '7',
      pessoaNome: 'Rafael Dias',
      pessoaTipo: 'OUTRO',
      responsavel: '—',
      documento: '678.901.234-55',
      registro: 'OUT-0788',
      competencia: '2024-09',
      valorDevido: 290,
      valorPago: 100,
      status: 'PARCIAL',
      ultimaCobranca: '2024-09-07',
    },
    {
      id: '8',
      pessoaNome: 'Luciana Moraes',
      pessoaTipo: 'ALUNO',
      responsavel: 'Gustavo Moraes',
      documento: '789.012.345-66',
      registro: 'ALU-0491',
      competencia: '2024-09',
      valorDevido: 360,
      valorPago: 0,
      status: 'VENCIDO',
      ultimaCobranca: '2024-09-03',
    },
    {
      id: '9',
      pessoaNome: 'Gabriel Santos',
      pessoaTipo: 'PROFESSOR',
      responsavel: '—',
      documento: '890.123.456-77',
      registro: 'PRO-2220',
      competencia: '2024-09',
      valorDevido: 500,
      valorPago: 320,
      status: 'PARCIAL',
      ultimaCobranca: '2024-09-10',
    },
    {
      id: '10',
      pessoaNome: 'Natalia Freitas',
      pessoaTipo: 'ALUNO',
      responsavel: 'Marcos Freitas',
      documento: '901.234.567-88',
      registro: 'ALU-0670',
      competencia: '2024-09',
      valorDevido: 470,
      valorPago: 0,
      status: 'EM_ABERTO',
      ultimaCobranca: '2024-09-04',
    },
  ]);

  readonly extratoSelecionado = signal<Recebivel | null>(null);

  readonly statusOptions = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Em aberto', value: 'EM_ABERTO' },
    { label: 'Parcial', value: 'PARCIAL' },
    { label: 'Quitado', value: 'QUITADO' },
    { label: 'Vencido', value: 'VENCIDO' },
  ] as const;

  readonly tiposPessoa = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Aluno', value: 'ALUNO' },
    { label: 'Professor', value: 'PROFESSOR' },
    { label: 'Outros', value: 'OUTRO' },
  ] as const;

  readonly recebiveisFiltrados = computed(() => {
    const { competencia, status, tipo, termo, somenteInadimplentes } = this.filtros();
    const termoLower = termo.trim().toLowerCase();

    return this.recebiveis().filter((item) => {
      const mesmaCompetencia = item.competencia === competencia;
      const statusOk = status === 'TODOS' || item.status === status;
      const tipoOk = tipo === 'TODOS' || item.pessoaTipo === tipo;
      const termoOk =
        termoLower.length === 0 ||
        item.pessoaNome.toLowerCase().includes(termoLower) ||
        item.documento.toLowerCase().includes(termoLower) ||
        item.registro.toLowerCase().includes(termoLower);
      const inadimplenteOk = !somenteInadimplentes || item.status !== 'QUITADO';
      return mesmaCompetencia && statusOk && tipoOk && termoOk && inadimplenteOk;
    });
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
    const total = this.totalRecebido();
    const pesos = [0.18, 0.27, 0.3, 0.25];
    return pesos.map((peso, index) => ({
      label: `Sem ${index + 1}`,
      valor: total * peso,
      percentual: total === 0 ? 0 : peso * 100,
    }));
  });

  readonly topDevedores = computed(() =>
    [...this.inadimplentes()]
      .sort((a, b) => b.valorDevido - b.valorPago - (a.valorDevido - a.valorPago))
      .slice(0, 10)
  );

  readonly distribuicaoStatus = computed(() => {
    const total = this.recebiveisFiltrados().length || 1;
    return (['EM_ABERTO', 'PARCIAL', 'QUITADO', 'VENCIDO'] as StatusRecebivel[]).map((status) => {
      const quantidade = this.recebiveisFiltrados().filter((item) => item.status === status).length;
      return {
        status,
        quantidade,
        percentual: (quantidade / total) * 100,
      };
    });
  });

  patchFiltro(patch: Partial<FiltroRecebiveis>): void {
    this.filtros.update((atual) => ({ ...atual, ...patch }));
  }

  onVerExtrato(item: Recebivel): void {
    this.extratoSelecionado.set(item);
  }

  onEnviarCobranca(item: Recebivel): void {
    const dataHoje = new Date().toISOString().slice(0, 10);
    this.recebiveis.update((lista) =>
      lista.map((entry) => (entry.id === item.id ? { ...entry, ultimaCobranca: dataHoje } : entry))
    );
    this.extratoSelecionado.set({ ...item, ultimaCobranca: dataHoje });
  }

  onMarcarPagamento(item: Recebivel): void {
    this.recebiveis.update((lista) =>
      lista.map((entry) =>
        entry.id === item.id
          ? { ...entry, valorPago: entry.valorDevido, status: 'QUITADO' }
          : entry
      )
    );
    this.extratoSelecionado.set({ ...item, valorPago: item.valorDevido, status: 'QUITADO' });
  }

  onAtualizarMock(): void {
    this.recebiveis.update((lista) =>
      lista.map((entry, index) => ({
        ...entry,
        valorPago:
          entry.status === 'QUITADO' ? entry.valorDevido : Math.min(entry.valorDevido, entry.valorPago + (index % 3) * 30),
      }))
    );
  }

  onNovaCobranca(): void {
    this.abaAtiva.set('listagem');
  }

  statusLabel(status?: StatusRecebivel): string {
    const map: Record<StatusRecebivel, string> = {
      EM_ABERTO: 'Em aberto',
      PARCIAL: 'Parcial',
      QUITADO: 'Quitado',
      VENCIDO: 'Vencido',
    };
    return status ? map[status] : '—';
  }

  statusClass(status: StatusRecebivel): string {
    const map: Record<StatusRecebivel, string> = {
      EM_ABERTO: 'badge badge-info badge-sm',
      PARCIAL: 'badge badge-warning badge-sm',
      QUITADO: 'badge badge-success badge-sm',
      VENCIDO: 'badge badge-error badge-sm',
    };
    return map[status];
  }

  tipoLabel(tipo?: PessoaTipo): string {
    const map: Record<PessoaTipo, string> = {
      ALUNO: 'Aluno',
      PROFESSOR: 'Professor',
      OUTRO: 'Outro',
    };
    return tipo ? map[tipo] : '—';
  }

  competenciaLabel(competencia = this.filtros().competencia): string {
    const [ano, mes] = competencia.split('-');
    return `${mes}/${ano}`;
  }

  formatCurrency(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }

  formatDate(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  trackById(_: number, item: Recebivel): string {
    return item.id;
  }
}
