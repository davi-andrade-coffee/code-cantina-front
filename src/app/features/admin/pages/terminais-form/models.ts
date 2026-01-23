export interface TerminalFormData {
  id?: string;
  codigo: string;
  nome: string;
  portaBalanca: string;
  impressoraFiscal: string;
  imprimeCupom: boolean;
  previewCupom: boolean;
  modoOffline: boolean;
  ativo: boolean;
}

export interface TerminalSavePayload {
  id?: string;
  codigo: string;
  nome: string;
  portaBalanca?: string;
  impressoraFiscal?: string;
  imprimeCupom: boolean;
  previewCupom: boolean;
  modoOffline: boolean;
  ativo: boolean;
}

export type FieldErrors = Partial<Record<keyof TerminalFormData, string>>;
