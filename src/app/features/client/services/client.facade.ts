import { Injectable, signal } from '@angular/core';
import { DashboardSummary } from '../models/dashboard.model';
import { FinanceHistoryItem, FinanceSummary } from '../models/finance.model';
import { StatementEntry, StatementSummary } from '../models/statement.model';
import { ClientMockService } from './client.mock.service';

export type OperationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface OperationState {
  status: OperationStatus;
  message?: string;
}

const DEFAULT_PERSON_ID = 'p1';

@Injectable({ providedIn: 'root' })
export class ClientFacade {
  private readonly personId = signal<string>(DEFAULT_PERSON_ID);
  private readonly dashboard = signal<DashboardSummary | null>(null);
  private readonly financeSummary = signal<FinanceSummary | null>(null);
  private readonly financeHistory = signal<FinanceHistoryItem[]>([]);
  private readonly statementSummary = signal<StatementSummary | null>(null);
  private readonly statementEntries = signal<StatementEntry[]>([]);

  readonly loadingState = signal<OperationState>({ status: 'idle' });
  readonly actionState = signal<OperationState>({ status: 'idle' });

  readonly dashboardView = this.dashboard.asReadonly();
  readonly financeSummaryView = this.financeSummary.asReadonly();
  readonly financeHistoryView = this.financeHistory.asReadonly();
  readonly statementSummaryView = this.statementSummary.asReadonly();
  readonly statementEntriesView = this.statementEntries.asReadonly();

  constructor(private dataSource: ClientMockService) {}

  async init(): Promise<void> {
    if (this.loadingState().status === 'loading') return;
    this.loadingState.set({ status: 'loading' });
    await this.refreshData(this.personId());
    this.loadingState.set({ status: 'success' });
  }

  async refreshData(personId: string): Promise<void> {
    const [dashboard, financeSummary, financeHistory, statementSummary, statementEntries] =
      await Promise.all([
        this.dataSource.getDashboard(personId),
        this.dataSource.getFinanceSummary(personId),
        this.dataSource.getFinanceHistory(personId),
        this.dataSource.getStatementSummary(personId),
        this.dataSource.getStatementEntries(personId),
      ]);
    this.dashboard.set(dashboard);
    this.financeSummary.set(financeSummary);
    this.financeHistory.set(financeHistory);
    this.statementSummary.set(statementSummary);
    this.statementEntries.set(statementEntries);
  }

  async createTopup(amount: number): Promise<void> {
    const personId = this.personId();
    if (!personId) return;
    this.actionState.set({ status: 'loading' });
    await this.dataSource.createTopup(personId, amount);
    await this.refreshData(personId);
    this.actionState.set({ status: 'success', message: 'Recarga pendente registrada.' });
  }

  async markInvoiceAsPaid(invoiceId: string): Promise<void> {
    const personId = this.personId();
    if (!personId) return;
    this.actionState.set({ status: 'loading' });
    await this.dataSource.markInvoiceAsPaid(personId, invoiceId);
    await this.refreshData(personId);
    this.actionState.set({ status: 'success', message: 'Fatura marcada como paga.' });
  }
}
