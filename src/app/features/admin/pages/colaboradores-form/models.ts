export interface ColaboradorFormData {
  id?: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  nascimento: string;
  entrada: string;
  cargo: string;
  matricula: string;
  observacoes: string;
  ativa: boolean;

  fotoFile: File | null;
  fotoPreviewUrl: string | null;
}

export interface ColaboradorSavePayload {
  id?: string;
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  nascimento?: string;
  entrada?: string;
  cargo?: string;
  matricula?: string;
  observacoes?: string;
  ativa: boolean;
}

export type FieldErrors = Partial<Record<keyof ColaboradorFormData, string>>;
