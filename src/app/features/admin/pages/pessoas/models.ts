export type PessoaTipo = 'ALUNO' | 'PROFESSOR' | 'OUTRO';

export interface Pessoa {
  id: string;
  tipo: PessoaTipo;
  nome: string;
  documento: string; // CPF/CNPJ já formatado para exibição
  email: string;
  notificacaoAtiva: boolean;
  ativa: boolean;
}

export interface PessoasFiltro {
  termo: string;
  tipo: PessoaTipo | 'TODOS';
  somenteAtivos: boolean;
}

