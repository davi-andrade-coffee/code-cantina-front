export type ColaboradorStatus = 'TODOS' | 'ATIVOS' | 'INATIVOS';

export interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  nascimento: string;
  entrada: string;
  cargo: string;
  matricula: string;
  ativa: boolean;
  fotoUrl?: string | null;
}

export interface ColaboradoresFiltro {
  termo: string;
  status: ColaboradorStatus;
  // somenteAtivos: boolean;
}
