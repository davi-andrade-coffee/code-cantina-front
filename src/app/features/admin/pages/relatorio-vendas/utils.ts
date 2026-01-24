import { FormaPagamento } from './models';

export const PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
  SALDO: 'Saldo',
  DINHEIRO: 'Dinheiro',
  CONVENIO: 'Convênio',
};

export const formatCurrency = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

export const formatDateTime = (dataHora: string): string => {
  const date = new Date(dataHora);
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};
