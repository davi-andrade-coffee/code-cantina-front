export type LicencaStatus = 'VALIDA' | 'EXPIRADA' | 'TOLERANCIA';

export interface LicencaInfo {
  tenant: string;
  status: LicencaStatus;
  validade: string;
  tolerancia: string;
}
