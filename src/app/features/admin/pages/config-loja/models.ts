export interface LojaIdentificacao {
  codigo: string;
  nomeBase: string;
}

export interface LojaEndereco {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  complemento: string;
}

export interface LojaComplementar {
  nomeFantasia: string;
  cnpj: string;
  endereco: LojaEndereco;
  observacoes: string;
}

export interface LojaConfiguracao {
  identificacao: LojaIdentificacao;
  complementar: LojaComplementar;
}
