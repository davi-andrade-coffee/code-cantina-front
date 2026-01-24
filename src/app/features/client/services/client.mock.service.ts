import { Injectable } from '@angular/core';
import { DashboardSummary } from '../models/dashboard.model';
import { Dependent } from '../models/dependent.model';
import {
  FinanceHistoryItem,
  FinanceSummary,
  InvoiceHistoryItem,
  WalletTransactionItem,
} from '../models/finance.model';
import { StatementEntry, StatementSummary } from '../models/statement.model';

interface PersonData {
  dashboard: DashboardSummary;
  financeSummary: FinanceSummary;
  financeHistory: FinanceHistoryItem[];
  statementSummary: StatementSummary;
  statementEntries: StatementEntry[];
}

const PEOPLE: Dependent[] = [
  { id: 'p1', name: 'Maria Silva', relation: 'Responsável' },
  { id: 'p2', name: 'Lucas Silva', relation: 'Dependente' },
];

const buildData = (): Record<string, PersonData> => ({
  p1: {
    dashboard: {
      plan: { type: 'CONVENIO', status: 'ATIVO', monthlyLimit: 450 },
      invoice: {
        competency: '09/2024',
        amount: 220.5,
        status: 'EM_ABERTO',
      },
      consumption: {
        total: 198.4,
        purchases: 18,
        averageTicket: 11.02,
      },
      pending: {
        hasOverdue: true,
        message: 'Existe fatura vencida em 07/2024.',
      },
    },
    financeSummary: {
      planType: 'CONVENIO',
      currentInvoice: {
        competency: '09/2024',
        amount: 220.5,
        dueDate: '2024-09-20',
        status: 'EM_ABERTO',
      },
    },
    financeHistory: [
      {
        id: 'inv-2024-09',
        type: 'INVOICE',
        competency: '09/2024',
        total: 220.5,
        dueDate: '2024-09-20',
        status: 'EM_ABERTO',
      },
      {
        id: 'inv-2024-08',
        type: 'INVOICE',
        competency: '08/2024',
        total: 310.75,
        dueDate: '2024-08-20',
        status: 'QUITADO',
        paidAt: '2024-08-18',
      },
      {
        id: 'inv-2024-07',
        type: 'INVOICE',
        competency: '07/2024',
        total: 280.3,
        dueDate: '2024-07-20',
        status: 'VENCIDO',
      },
    ],
    statementSummary: {
      clientName: 'Maria Silva',
      planLabel: 'Convênio pós-pago',
      periodConsumption: 198.4,
    },
    statementEntries: [
      {
        id: 'st-1',
        dateTime: '2024-09-05 10:12',
        origin: 'PDV Escola Centro',
        description: 'Compra na cantina',
        amount: 18.5,
        type: 'COMPRA',
        detail: {
          items: [
            { name: 'Suco natural', quantity: 1, price: 6.5 },
            { name: 'Salgado assado', quantity: 1, price: 12 },
          ],
          paymentMethod: 'Convênio',
          operator: 'Carla Souza',
          terminal: 'Terminal 01',
        },
      },
      {
        id: 'st-2',
        dateTime: '2024-09-03 09:40',
        origin: 'PDV Escola Centro',
        description: 'Compra na cantina',
        amount: 12.9,
        type: 'COMPRA',
        detail: {
          items: [{ name: 'Sanduíche natural', quantity: 1, price: 12.9 }],
          paymentMethod: 'Convênio',
          operator: 'Carla Souza',
          terminal: 'Terminal 01',
          notes: 'Sem maionese.',
        },
      },
    ],
  },
  p2: {
    dashboard: {
      plan: { type: 'SALDO', status: 'ATIVO' },
      balance: {
        amount: 85.2,
        lastTopup: {
          date: '2024-09-04',
          amount: 60,
        },
      },
      consumption: {
        total: 46.3,
        purchases: 12,
        averageTicket: 3.86,
      },
      pending: {
        hasOverdue: false,
        message: 'Nenhuma pendência no momento.',
      },
    },
    financeSummary: {
      planType: 'SALDO',
      balance: 85.2,
    },
    financeHistory: [
      {
        id: 'tx-1',
        type: 'TRANSACTION',
        date: '2024-09-04',
        movement: 'RECARGA',
        amount: 60,
        status: 'CONCLUIDA',
      },
      {
        id: 'tx-2',
        type: 'TRANSACTION',
        date: '2024-08-20',
        movement: 'AJUSTE',
        amount: -5,
        status: 'CONCLUIDA',
      },
      {
        id: 'tx-3',
        type: 'TRANSACTION',
        date: '2024-08-10',
        movement: 'RECARGA',
        amount: 50,
        status: 'CONCLUIDA',
      },
    ],
    statementSummary: {
      clientName: 'Lucas Silva',
      planLabel: 'Saldo pré-pago',
      balance: 85.2,
      periodConsumption: 46.3,
    },
    statementEntries: [
      {
        id: 'st-3',
        dateTime: '2024-09-05 10:12',
        origin: 'PDV Escola Centro',
        description: 'Compra na cantina',
        amount: -8.5,
        balanceAfter: 85.2,
        type: 'COMPRA',
        detail: {
          items: [{ name: 'Suco natural', quantity: 1, price: 8.5 }],
          paymentMethod: 'Saldo',
          operator: 'Carla Souza',
          terminal: 'Terminal 01',
        },
      },
      {
        id: 'st-4',
        dateTime: '2024-09-04 18:20',
        origin: 'Recarga Online',
        description: 'Recarga via Pix',
        amount: 60,
        balanceAfter: 93.7,
        type: 'RECARGA',
        detail: {
          items: [{ name: 'Recarga Pix', quantity: 1, price: 60 }],
          paymentMethod: 'Pix',
          operator: 'Sistema',
          terminal: 'Online',
        },
      },
    ],
  },
});

@Injectable({ providedIn: 'root' })
export class ClientMockService {
  private data = buildData();

  listPeople(): Promise<Dependent[]> {
    return Promise.resolve(PEOPLE);
  }

  getDashboard(personId: string): Promise<DashboardSummary> {
    return Promise.resolve(this.data[personId].dashboard);
  }

  getFinanceSummary(personId: string): Promise<FinanceSummary> {
    return Promise.resolve(this.data[personId].financeSummary);
  }

  getFinanceHistory(personId: string): Promise<FinanceHistoryItem[]> {
    return Promise.resolve(this.data[personId].financeHistory);
  }

  getStatementSummary(personId: string): Promise<StatementSummary> {
    return Promise.resolve(this.data[personId].statementSummary);
  }

  getStatementEntries(personId: string): Promise<StatementEntry[]> {
    return Promise.resolve(this.data[personId].statementEntries);
  }

  createTopup(personId: string, amount: number): Promise<WalletTransactionItem> {
    const newItem: WalletTransactionItem = {
      id: `tx-${Date.now()}`,
      type: 'TRANSACTION',
      date: new Date().toISOString().slice(0, 10),
      movement: 'RECARGA',
      amount,
      status: 'PENDENTE',
    };
    const person = this.data[personId];
    person.financeHistory = [newItem, ...person.financeHistory];
    person.dashboard.balance = {
      amount: person.dashboard.balance?.amount ?? 0,
      lastTopup: { date: newItem.date, amount },
    };
    person.financeSummary.balance = person.dashboard.balance.amount;
    return Promise.resolve(newItem);
  }

  markInvoiceAsPaid(personId: string, invoiceId: string): Promise<InvoiceHistoryItem | null> {
    const person = this.data[personId];
    const invoice = person.financeHistory.find(
      item => item.type === 'INVOICE' && item.id === invoiceId
    ) as InvoiceHistoryItem | undefined;
    if (!invoice) {
      return Promise.resolve(null);
    }
    invoice.status = 'QUITADO';
    invoice.paidAt = new Date().toISOString().slice(0, 10);
    if (person.financeSummary.currentInvoice?.competency === invoice.competency) {
      person.financeSummary.currentInvoice.status = 'QUITADO';
    }
    if (person.dashboard.invoice?.competency === invoice.competency) {
      person.dashboard.invoice.status = 'QUITADO';
    }
    person.dashboard.pending = {
      hasOverdue: false,
      message: 'Nenhuma pendência no momento.',
    };
    return Promise.resolve(invoice);
  }
}
