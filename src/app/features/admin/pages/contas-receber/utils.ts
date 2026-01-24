import { PessoaTipo, StatusRecebivel } from './models';

export const STATUS_LABELS: Record<StatusRecebivel, string> = {
  EM_ABERTO: 'Em aberto',
  QUITADO: 'Quitado',
  VENCIDO: 'Vencido',
};

export const STATUS_CLASSES: Record<StatusRecebivel, string> = {
  EM_ABERTO: 'badge badge-info badge-sm whitespace-nowrap',
  QUITADO: 'badge badge-success badge-sm whitespace-nowrap',
  VENCIDO: 'badge badge-error badge-sm whitespace-nowrap',
};

export const PESSOA_LABELS: Record<PessoaTipo, string> = {
  ALUNO: 'Aluno',
  PROFESSOR: 'Professor',
  OUTRO: 'Outro',
};

export const formatCurrency = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

export const formatDate = (data: string): string => {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};

export const competenciaLabel = (competencia: string): string => {
  const [ano, mes] = competencia.split('-');
  return `${mes}/${ano}`;
};
