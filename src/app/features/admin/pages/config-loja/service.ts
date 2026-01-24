import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LojaConfiguracao, LojaComplementar } from './models';

@Injectable({ providedIn: 'root' })
export class ConfigLojaService {
  private readonly configuracao = signal<LojaConfiguracao>({
    identificacao: {
      codigo: 'ESCOLA_001',
      nomeBase: 'Escola',
    },
    complementar: {
      nomeFantasia: 'Cantina do Colégio X',
      cnpj: '00.000.000/0000-00',
      endereco: {
        logradouro: 'Rua / Av. ...',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        cep: '00000-000',
        complemento: 'Informações adicionais...',
      },
      observacoes: 'Preencha o máximo possível para padronizar documentos.',
    },
  });

  obterConfiguracao(): Observable<LojaConfiguracao> {
    return of(this.configuracao());
  }

  atualizarComplementar(complementar: LojaComplementar): Observable<LojaConfiguracao> {
    this.configuracao.update((atual) => ({
      ...atual,
      complementar: {
        ...complementar,
        endereco: { ...complementar.endereco },
      },
    }));

    return of(this.configuracao());
  }
}
