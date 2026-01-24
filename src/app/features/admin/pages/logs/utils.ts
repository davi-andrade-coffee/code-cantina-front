import { LogCategoria } from './models';

export const CATEGORIA_LABELS: Record<LogCategoria, string> = {
  VENDA_FINALIZADA: 'Venda finalizada',
  ABERTURA_CAIXA: 'Abertura de caixa',
  FECHAMENTO_CAIXA: 'Fechamento de caixa',
  CADASTRO_COLABORADOR: 'Cadastro de colaboradores',
  CADASTRO_PESSOA: 'Cadastro de pessoas',
  CADASTRO_TERMINAL: 'Cadastro de terminal',
  CADASTRO_PRODUTO: 'Cadastro de produtos',
  AJUDA_COLABORADOR: 'Ajuda de colaboradores',
  AJUSTE_PESSOA: 'Ajuste de pessoas',
  AJUSTE_TERMINAL: 'Ajuste de terminal',
  AJUSTE_PRODUTO: 'Ajuste de produtos',
  PAGAMENTO_CONVENIO: 'Pagamento de convênio',
  ADICAO_SALDO: 'Adição de saldo',
};

export const CATEGORIA_BADGES: Record<LogCategoria, string> = {
  VENDA_FINALIZADA: 'badge badge-success badge-sm',
  ABERTURA_CAIXA: 'badge badge-info badge-sm',
  FECHAMENTO_CAIXA: 'badge badge-info badge-sm',
  CADASTRO_COLABORADOR: 'badge badge-secondary badge-sm',
  CADASTRO_PESSOA: 'badge badge-secondary badge-sm',
  CADASTRO_TERMINAL: 'badge badge-secondary badge-sm',
  CADASTRO_PRODUTO: 'badge badge-secondary badge-sm',
  AJUDA_COLABORADOR: 'badge badge-accent badge-sm',
  AJUSTE_PESSOA: 'badge badge-warning badge-sm',
  AJUSTE_TERMINAL: 'badge badge-warning badge-sm',
  AJUSTE_PRODUTO: 'badge badge-warning badge-sm',
  PAGAMENTO_CONVENIO: 'badge badge-primary badge-sm',
  ADICAO_SALDO: 'badge badge-primary badge-sm',
};

export const ORIGEM_BADGES: Record<string, string> = {
  'Painel Admin': 'badge badge-outline badge-sm',
  PDV: 'badge badge-outline badge-sm',
  'App Cliente': 'badge badge-outline badge-sm',
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
