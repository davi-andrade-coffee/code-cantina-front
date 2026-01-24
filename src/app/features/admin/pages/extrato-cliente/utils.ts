import { FormaPagamento, PessoaTipo, PlanoTipo, TipoMovimento } from './models';

export const PESSOA_LABELS: Record<PessoaTipo, string> = {
  ALUNO: 'Aluno',
  PROFESSOR: 'Professor',
  OUTRO: 'Outro',
};

export const PLANO_LABELS: Record<PlanoTipo, string> = {
  CONVENIO: 'Convênio',
  PRE_PAGO: 'Pré-pago',
  SALDO: 'Saldo',
};

export const MOVIMENTO_LABELS: Record<TipoMovimento, string> = {
  CONSUMO: 'Consumo',
  CARGA: 'Carga',
  PAGAMENTO: 'Pagamento',
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
