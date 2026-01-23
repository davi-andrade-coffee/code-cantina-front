import { FormaPagamento, StatusVenda } from './models';

export const STATUS_LABELS: Record<StatusVenda, string> = {
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
  ESTORNADA: 'Estornada',
};

export const STATUS_CLASSES: Record<StatusVenda, string> = {
  CONCLUIDA: 'badge badge-success badge-sm',
  CANCELADA: 'badge badge-error badge-sm',
  ESTORNADA: 'badge badge-warning badge-sm',
};

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
