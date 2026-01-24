import { CashMovement } from '../models/cash-movement';
import { CashSession } from '../models/cash-session';
import { Product } from '../models/product';
import { PaymentMethod, Sale, SaleItem } from '../models/sale';
import { Terminal } from '../models/terminal';

export interface OpenCashSessionInput {
  terminalId: string;
  operatorId: string;
  openingBalance: number;
}

export interface CloseCashSessionInput {
  sessionId: string;
  countedBalance: number;
  note?: string;
}

export interface CreateSaleInput {
  sessionId: string;
  items: SaleItem[];
  paymentMethod: PaymentMethod;
  subtotal: number;
  total: number;
}

export interface RegisterCashMovementInput {
  sessionId: string;
  type: CashMovement['type'];
  amount: number;
  note?: string;
}

export interface PdvDataSource {
  listTerminals(): Promise<Terminal[]>;
  getOpenSession(terminalId: string): Promise<CashSession | null>;
  openSession(input: OpenCashSessionInput): Promise<CashSession>;
  closeSession(input: CloseCashSessionInput): Promise<CashSession>;
  searchProducts(term: string): Promise<Product[]>;
  createSale(input: CreateSaleInput): Promise<Sale>;
  registerMovement(input: RegisterCashMovementInput): Promise<CashMovement>;
  listSalesBySession(sessionId: string): Promise<Sale[]>;
  listMovementsBySession(sessionId: string): Promise<CashMovement[]>;
}
