import { Injectable, signal, computed, WritableSignal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { CashMovement, CashMovementType } from '../models/cash-movement';
import { CashSession } from '../models/cash-session';
import { Product } from '../models/product';
import { PaymentMethod, Sale, SaleItem } from '../models/sale';
import { Terminal } from '../models/terminal';
import {
  CloseCashSessionInput,
  CreateSaleInput,
  OpenCashSessionInput,
  RegisterCashMovementInput,
} from './pdv.datasource';
import { PdvMockService } from './pdv.mock.service';

export type OperationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface OperationState {
  status: OperationStatus;
  message?: string;
}

export interface CashSessionSummary {
  openingBalance: number;
  salesByPayment: Record<PaymentMethod, number>;
  totalSales: number;
  totalSangria: number;
  totalReforco: number;
  expectedBalance: number;
}

const STORAGE_KEY_TERMINAL = 'pdv.selectedTerminal';

@Injectable({ providedIn: 'root' })
export class PdvFacade {
  private readonly terminals = signal<Terminal[]>([]);
  private readonly selectedTerminalId = signal<string | null>(null);
  private readonly activeSession = signal<CashSession | null>(null);
  private readonly products = signal<Product[]>([]);
  private readonly cartItems = signal<SaleItem[]>([]);
  private readonly sales = signal<Sale[]>([]);
  private readonly movements = signal<CashMovement[]>([]);
  private readonly currentView = signal<'terminal' | 'cash-open' | 'sale' | 'cash-close'>('terminal');
  private readonly notice = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  readonly terminalState = signal<OperationState>({ status: 'idle' });
  readonly sessionState = signal<OperationState>({ status: 'idle' });
  readonly productState = signal<OperationState>({ status: 'idle' });
  readonly saleState = signal<OperationState>({ status: 'idle' });
  readonly movementState = signal<OperationState>({ status: 'idle' });
  readonly closeState = signal<OperationState>({ status: 'idle' });

  readonly terminalsView = this.terminals.asReadonly();
  readonly selectedTerminal = computed(() =>
    this.terminals().find(terminal => terminal.id === this.selectedTerminalId()) ?? null
  );
  readonly sessionView = this.activeSession.asReadonly();
  readonly productsView = this.products.asReadonly();
  readonly cartItemsView = this.cartItems.asReadonly();
  readonly noticeView = this.notice.asReadonly();
  readonly viewMode = this.currentView.asReadonly();
  readonly operatorName = computed(() => {
    const user = this.auth.getSnapshotUser();
    if (!user) return 'Operador';
    return user.email.split('@')[0];
  });
  readonly summaryView = computed<CashSessionSummary | null>(() => {
    const session = this.activeSession();
    if (!session) return null;
    const salesByPayment: Record<PaymentMethod, number> = {
      DINHEIRO: 0,
      SALDO: 0,
      CONVENIO: 0,
    };
    let totalSales = 0;
    this.sales().forEach(sale => {
      salesByPayment[sale.paymentMethod] += sale.total;
      totalSales += sale.total;
    });
    const totalSangria = this.movements()
      .filter(movement => movement.type === 'SANGRIA')
      .reduce((acc, movement) => acc + movement.amount, 0);
    const totalReforco = this.movements()
      .filter(movement => movement.type === 'REFORCO')
      .reduce((acc, movement) => acc + movement.amount, 0);
    const expectedBalance = session.openingBalance + totalSales + totalReforco - totalSangria;
    return {
      openingBalance: session.openingBalance,
      salesByPayment,
      totalSales,
      totalSangria,
      totalReforco,
      expectedBalance,
    };
  });

  constructor(private dataSource: PdvMockService, private auth: AuthService) {}

  async init(): Promise<void> {
    await this.loadTerminals();
    const storedTerminal = localStorage.getItem(STORAGE_KEY_TERMINAL);
    if (storedTerminal) {
      this.selectedTerminalId.set(storedTerminal);
      await this.checkOpenSession();
    }
  }

  async loadTerminals(): Promise<void> {
    await this.runOperation(this.terminalState, async () => {
      const terminals = await this.withTimeout(this.dataSource.listTerminals());
      this.terminals.set(terminals);
    });
  }

  async selectTerminal(terminalId: string): Promise<void> {
    this.selectedTerminalId.set(terminalId);
    localStorage.setItem(STORAGE_KEY_TERMINAL, terminalId);
    await this.checkOpenSession();
  }

  clearTerminal(): void {
    this.selectedTerminalId.set(null);
    this.activeSession.set(null);
    this.cartItems.set([]);
    this.products.set([]);
    this.sales.set([]);
    this.movements.set([]);
    this.currentView.set('terminal');
    localStorage.removeItem(STORAGE_KEY_TERMINAL);
  }

  async checkOpenSession(): Promise<void> {
    const terminalId = this.selectedTerminalId();
    if (!terminalId) {
      this.currentView.set('terminal');
      return;
    }
    await this.runOperation(this.sessionState, async () => {
      const session = await this.withTimeout(this.dataSource.getOpenSession(terminalId));
      this.activeSession.set(session);
      if (session) {
        await this.refreshSessionData(session.id);
        this.currentView.set('sale');
      } else {
        this.currentView.set('cash-open');
        this.sales.set([]);
        this.movements.set([]);
      }
    });
  }

  async openSession(openingBalance: number): Promise<void> {
    const terminal = this.selectedTerminal();
    if (!terminal) return;
    const user = this.auth.getSnapshotUser();
    if (!user) {
      this.setNotice('error', 'Usuário não autenticado.');
      return;
    }
    const input: OpenCashSessionInput = {
      terminalId: terminal.id,
      operatorId: user.id,
      openingBalance,
    };
    await this.runOperation(this.sessionState, async () => {
      const session = await this.withTimeout(this.dataSource.openSession(input));
      this.activeSession.set(session);
      this.currentView.set('sale');
      this.sales.set([]);
      this.movements.set([]);
      this.setNotice('success', 'Caixa aberto com sucesso.');
    });
  }

  async closeSession(countedBalance: number, note?: string): Promise<void> {
    const session = this.activeSession();
    if (!session) return;
    const input: CloseCashSessionInput = {
      sessionId: session.id,
      countedBalance,
      note,
    };
    await this.runOperation(this.closeState, async () => {
      const updated = await this.withTimeout(this.dataSource.closeSession(input));
      this.activeSession.set(updated.status === 'OPEN' ? updated : null);
      this.cartItems.set([]);
      this.products.set([]);
      this.currentView.set('cash-open');
      this.setNotice('success', 'Caixa fechado.');
    });
  }

  async searchProducts(term: string): Promise<void> {
    await this.runOperation(this.productState, async () => {
      const products = await this.withTimeout(this.dataSource.searchProducts(term));
      this.products.set(products);
    });
  }

  addItem(product: Product, quantity?: number, weight?: number): void {
    const items = this.cartItems();
    if (product.soldByWeight) {
      const safeWeight = weight && weight > 0 ? weight : 0;
      if (!safeWeight) {
        this.setNotice('error', 'Informe o peso para o produto.');
        return;
      }
      const item: SaleItem = {
        id: this.generateId('item'),
        product,
        weight: safeWeight,
        unitPrice: product.price,
        total: product.price * safeWeight,
      };
      this.cartItems.set([...items, item]);
      return;
    }
    const safeQty = quantity && quantity > 0 ? quantity : 1;
    const existingIndex = items.findIndex(item => item.product.id === product.id && !item.weight);
    if (existingIndex >= 0) {
      const updated = [...items];
      const existing = updated[existingIndex];
      const nextQty = (existing.quantity ?? 0) + safeQty;
      updated[existingIndex] = {
        ...existing,
        quantity: nextQty,
        total: nextQty * existing.unitPrice,
      };
      this.cartItems.set(updated);
      return;
    }
    const item: SaleItem = {
      id: this.generateId('item'),
      product,
      quantity: safeQty,
      unitPrice: product.price,
      total: product.price * safeQty,
    };
    this.cartItems.set([...items, item]);
  }

  updateItemQuantity(itemId: string, quantity: number): void {
    const items = this.cartItems();
    const next = items.map(item => {
      if (item.id !== itemId) return item;
      const safeQty = quantity > 0 ? quantity : 1;
      return {
        ...item,
        quantity: safeQty,
        total: safeQty * item.unitPrice,
      };
    });
    this.cartItems.set(next);
  }

  updateItemWeight(itemId: string, weight: number): void {
    const items = this.cartItems();
    const next = items.map(item => {
      if (item.id !== itemId) return item;
      const safeWeight = weight > 0 ? weight : 0;
      return {
        ...item,
        weight: safeWeight,
        total: safeWeight * item.unitPrice,
      };
    });
    this.cartItems.set(next);
  }

  removeItem(itemId: string): void {
    this.cartItems.set(this.cartItems().filter(item => item.id !== itemId));
  }

  clearSale(): void {
    this.cartItems.set([]);
    this.products.set([]);
  }

  async finalizeSale(paymentMethod: PaymentMethod): Promise<void> {
    const session = this.activeSession();
    if (!session) {
      this.setNotice('error', 'Abra o caixa antes de registrar vendas.');
      return;
    }
    const items = this.cartItems();
    if (!items.length) {
      this.setNotice('error', 'Adicione itens ao cupom.');
      return;
    }
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const input: CreateSaleInput = {
      sessionId: session.id,
      items,
      paymentMethod,
      subtotal,
      total: subtotal,
    };
    await this.runOperation(this.saleState, async () => {
      const sale = await this.withTimeout(this.dataSource.createSale(input));
      this.sales.set([...this.sales(), sale]);
      this.clearSale();
      this.setNotice('success', 'Venda registrada com sucesso.');
    });
  }

  async registerMovement(type: CashMovementType, amount: number, note?: string): Promise<void> {
    const session = this.activeSession();
    if (!session) return;
    const input: RegisterCashMovementInput = {
      sessionId: session.id,
      type,
      amount,
      note,
    };
    await this.runOperation(this.movementState, async () => {
      const movement = await this.withTimeout(this.dataSource.registerMovement(input));
      this.movements.set([...this.movements(), movement]);
      this.setNotice('success', 'Movimentação registrada.');
    });
  }

  openCashClose(): void {
    this.currentView.set('cash-close');
  }

  backToSale(): void {
    if (this.activeSession()) {
      this.currentView.set('sale');
    }
  }

  private async refreshSessionData(sessionId: string): Promise<void> {
    const [sales, movements] = await Promise.all([
      this.dataSource.listSalesBySession(sessionId),
      this.dataSource.listMovementsBySession(sessionId),
    ]);
    this.sales.set(sales);
    this.movements.set(movements);
  }

  private setNotice(type: 'success' | 'error', message: string): void {
    this.notice.set({ type, message });
    setTimeout(() => {
      if (this.notice()?.message === message) {
        this.notice.set(null);
      }
    }, 3000);
  }

  private async runOperation(
    state: WritableSignal<OperationState>,
    operation: () => Promise<void>
  ): Promise<void> {
    state.set({ status: 'loading' });
    try {
      await operation();
      state.set({ status: 'success' });
    } catch (error: any) {
      const message = error?.message ?? 'Não foi possível concluir a operação.';
      state.set({ status: 'error', message });
      this.setNotice('error', message);
    }
  }

  private async withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Tempo de resposta excedido.')), ms);
    });
    const result = await Promise.race([promise, timeout]);
    clearTimeout(timeoutId!);
    return result as T;
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
