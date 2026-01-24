import { Injectable } from '@angular/core';
import {
  CloseCashSessionInput,
  CreateSaleInput,
  OpenCashSessionInput,
  PdvDataSource,
  RegisterCashMovementInput,
} from './pdv.datasource';
import { CashMovement } from '../models/cash-movement';
import { CashSession } from '../models/cash-session';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { Sale } from '../models/sale';
import { Terminal } from '../models/terminal';

const STORAGE_KEYS = {
  sessions: 'pdv.sessions',
  sales: 'pdv.sales',
  movements: 'pdv.movements',
};

const TERMINALS: Terminal[] = [
  { id: 'terminal-1', code: 'PDV-01', name: 'Escola' },
  { id: 'terminal-2', code: 'PDV-02', name: 'Cantina Central' },
  { id: 'terminal-3', code: 'PDV-03', name: 'Quadra' },
];

const PRODUCTS: Product[] = [
  { id: 'prod-1', code: '001', name: 'Coxinha', price: 7.5, soldByWeight: false, unitLabel: 'un' },
  { id: 'prod-2', code: '002', name: 'Suco Natural', price: 6.0, soldByWeight: false, unitLabel: 'un' },
  { id: 'prod-3', code: '003', name: 'Pão de Queijo', price: 4.25, soldByWeight: false, unitLabel: 'un' },
  { id: 'prod-4', code: '100', name: 'Salada Fitness', price: 39.9, soldByWeight: true, unitLabel: 'kg' },
  { id: 'prod-5', code: '101', name: 'Arroz Integral', price: 18.5, soldByWeight: true, unitLabel: 'kg' },
  { id: 'prod-6', code: '200', name: 'Água 500ml', price: 4.0, soldByWeight: false, unitLabel: 'un' },
];

const CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'João Silva', document: '123.456.789-00', balance: 25.5 },
  { id: 'cust-2', name: 'Maria Santos', document: '987.654.321-00', balance: 5.0 },
  { id: 'cust-3', name: 'Professor Lucas', document: '321.654.987-00', balance: 120.0 },
  { id: 'cust-4', name: 'Aluno Pedro', document: '111.222.333-44', balance: 0, blocked: true },
];

@Injectable({ providedIn: 'root' })
export class PdvMockService implements PdvDataSource {
  async listTerminals(): Promise<Terminal[]> {
    await this.delay();
    return TERMINALS;
  }

  async getOpenSession(terminalId: string): Promise<CashSession | null> {
    await this.delay();
    const sessions = this.readStorage<CashSession[]>(STORAGE_KEYS.sessions, []);
    return sessions.find(session => session.terminalId === terminalId && session.status === 'OPEN') ?? null;
  }

  async openSession(input: OpenCashSessionInput): Promise<CashSession> {
    await this.delay();
    const sessions = this.readStorage<CashSession[]>(STORAGE_KEYS.sessions, []);
    const session: CashSession = {
      id: this.generateId('session'),
      terminalId: input.terminalId,
      operatorId: input.operatorId,
      openedAt: new Date().toISOString(),
      openingBalance: input.openingBalance,
      status: 'OPEN',
    };
    sessions.push(session);
    this.writeStorage(STORAGE_KEYS.sessions, sessions);
    return session;
  }

  async closeSession(input: CloseCashSessionInput): Promise<CashSession> {
    await this.delay();
    const sessions = this.readStorage<CashSession[]>(STORAGE_KEYS.sessions, []);
    const index = sessions.findIndex(session => session.id === input.sessionId);
    if (index === -1) {
      throw new Error('Sessão não encontrada');
    }
    const session = sessions[index];
    const updated: CashSession = {
      ...session,
      status: 'CLOSED',
      closedAt: new Date().toISOString(),
      countedBalance: input.countedBalance,
      closingNote: input.note,
    };
    sessions[index] = updated;
    this.writeStorage(STORAGE_KEYS.sessions, sessions);
    return updated;
  }

  async searchProducts(term: string): Promise<Product[]> {
    await this.delay();
    if (!term.trim()) return [];
    const normalized = term.trim().toLowerCase();
    return PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(normalized) || product.code.includes(normalized)
    );
  }

  async searchCustomers(term: string): Promise<Customer[]> {
    await this.delay();
    if (!term.trim()) return [];
    const normalized = term.trim().toLowerCase();
    return CUSTOMERS.filter(customer =>
      customer.name.toLowerCase().includes(normalized) || customer.document.includes(normalized)
    );
  }

  async createSale(input: CreateSaleInput): Promise<Sale> {
    await this.delay();
    const sales = this.readStorage<Sale[]>(STORAGE_KEYS.sales, []);
    const sale: Sale = {
      id: this.generateId('sale'),
      sessionId: input.sessionId,
      customerId: input.customerId,
      items: input.items,
      subtotal: input.subtotal,
      total: input.total,
      paymentMethod: input.paymentMethod,
      createdAt: new Date().toISOString(),
    };
    sales.push(sale);
    this.writeStorage(STORAGE_KEYS.sales, sales);
    return sale;
  }

  async registerMovement(input: RegisterCashMovementInput): Promise<CashMovement> {
    await this.delay();
    const movements = this.readStorage<CashMovement[]>(STORAGE_KEYS.movements, []);
    const movement: CashMovement = {
      id: this.generateId('movement'),
      sessionId: input.sessionId,
      type: input.type,
      amount: input.amount,
      note: input.note,
      createdAt: new Date().toISOString(),
    };
    movements.push(movement);
    this.writeStorage(STORAGE_KEYS.movements, movements);
    return movement;
  }

  async listSalesBySession(sessionId: string): Promise<Sale[]> {
    await this.delay();
    const sales = this.readStorage<Sale[]>(STORAGE_KEYS.sales, []);
    return sales.filter(sale => sale.sessionId === sessionId);
  }

  async listMovementsBySession(sessionId: string): Promise<CashMovement[]> {
    await this.delay();
    const movements = this.readStorage<CashMovement[]>(STORAGE_KEYS.movements, []);
    return movements.filter(movement => movement.sessionId === sessionId);
  }

  private readStorage<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private writeStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private delay(ms = 350): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
