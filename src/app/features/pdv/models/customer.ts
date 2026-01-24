export interface Customer {
  id: string;
  name: string;
  document: string;
  balance: number;
  blocked?: boolean;
}
