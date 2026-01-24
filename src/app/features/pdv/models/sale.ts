import { Product } from './product';

export type PaymentMethod = 'DINHEIRO' | 'SALDO' | 'CONVENIO';

export interface SaleItem {
  id: string;
  product: Product;
  quantity?: number;
  weight?: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  sessionId: string;
  customerId: string;
  items: SaleItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
}
