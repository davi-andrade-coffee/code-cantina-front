export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  soldByWeight: boolean;
  unitLabel?: string;
}
