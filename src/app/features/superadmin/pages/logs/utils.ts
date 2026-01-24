import { LogCategoria } from './models';

export const CATEGORIA_LABELS: Record<LogCategoria, string> = {
  CADASTRO_LOJA: 'Cadastro de loja',
  CADASTRO_ADMIN: 'Cadastro de admin',
  BLOQUEIO_LOJA: 'Bloqueio de loja',
  DESBLOQUEIO_LOJA: 'Desbloqueio de loja',
  BLOQUEIO_ADMIN: 'Bloqueio de admin',
  DESBLOQUEIO_ADMIN: 'Desbloqueio de admin',
  PAGAMENTO_BOLETO: 'Pagamento de boleto',
};

export const CATEGORIA_BADGES: Record<LogCategoria, string> = {
  CADASTRO_LOJA: 'badge badge-secondary badge-sm',
  CADASTRO_ADMIN: 'badge badge-secondary badge-sm',
  BLOQUEIO_LOJA: 'badge badge-error badge-sm',
  DESBLOQUEIO_LOJA: 'badge badge-success badge-sm',
  BLOQUEIO_ADMIN: 'badge badge-error badge-sm',
  DESBLOQUEIO_ADMIN: 'badge badge-success badge-sm',
  PAGAMENTO_BOLETO: 'badge badge-primary badge-sm',
};

export const ORIGEM_BADGES: Record<string, string> = {
  'Painel Superadmin': 'badge badge-outline badge-sm',
  Financeiro: 'badge badge-outline badge-sm',
  Sistema: 'badge badge-outline badge-sm',
};

export const formatDateTime = (data: string): string =>
  new Date(data).toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDateInput = (data: Date): string => {
  const year = data.getFullYear();
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const day = String(data.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
