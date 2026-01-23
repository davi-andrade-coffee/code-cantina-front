import { PessoaTipo } from '../pessoas/models';

export type PlanoTipo = 'CONVENIO' | 'PRE_PAGO'; // futuro: 'POS_PAGO'
export type MoneyCents = number; // sempre centavos

export interface PessoaFormData {
  id?: string; // presente no editar
  tipo: PessoaTipo;
  nome: string;
  documento: string; // CPF/CNPJ (string crua do input)
  responsavelNome: string;
  email: string;
  telefone: string;
  nascimento: string; // yyyy-mm-dd (input date)
  planoTipo: PlanoTipo;
  convenioLimiteCents: MoneyCents | null; // só se CONVENIO
  observacoes: string;
  notificacaoEmail: boolean;
  ativa: boolean;

  // imagem
  fotoFile: File | null;
  fotoPreviewUrl: string | null; // ObjectURL
}

// payload “sanitizado” para salvar
export interface PessoaSavePayload {
  id?: string;
  tipo: PessoaTipo;
  nome: string;
  documento: string; // formatado ou normalizado
  responsavelNome?: string;
  email?: string;
  telefone?: string;
  nascimento?: string;
  planoTipo: PlanoTipo;
  convenioLimiteCents?: MoneyCents;
  observacoes?: string;
  notificacaoEmail: boolean;
  ativa: boolean;

  // no futuro: upload separado (presigned, multipart etc)
  // foto?: ...
}

export type FieldErrors = Partial<Record<keyof PessoaFormData, string>>;

