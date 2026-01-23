import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PessoaSavePayload, PlanoTipo } from './models';
import { Pessoa } from '../pessoas/models';

@Injectable({ providedIn: 'root' })
export class PessoasFormService {
  // Mock DB (ideal: compartilhar com PessoasService no futuro via repo)
  private readonly db: Pessoa[] = [
    {
      id: '1',
      tipo: 'PROFESSOR',
      nome: 'Guilherme Alonso',
      documento: '202.552.200-12',
      email: 'guilherme.alonso@email.com',
      notificacaoAtiva: true,
      ativa: true,
    },
    {
      id: '2',
      tipo: 'ALUNO',
      nome: 'Davi Borges Gama',
      documento: '531.795.586-61',
      email: 'davi.gama@email.com',
      notificacaoAtiva: false,
      ativa: true,
    },
    {
      id: '3',
      tipo: 'OUTRO',
      nome: 'Thayná Martins Pinho',
      documento: '439.681.388-05',
      email: 'thayna@email.com',
      notificacaoAtiva: true,
      ativa: false,
    },
  ];

  getById(id: string): Observable<PessoaSavePayload> {
    const item = this.db.find((x) => x.id === id);
    if (!item) return throwError(() => new Error('Pessoa não encontrada'));

    // Mock: como você ainda não guarda todos os campos no DB, retorna defaults
    return of({
      id: item.id,
      tipo: item.tipo,
      nome: item.nome,
      documento: item.documento,
      responsavelNome: '',
      email: item.email,
      telefone: '',
      nascimento: '',
      planoTipo: 'CONVENIO' as PlanoTipo,
      convenioLimiteCents: 0,
      observacoes: '',
      notificacaoEmail: item.notificacaoAtiva,
      ativa: item.ativa,
    }).pipe(delay(250));
  }

  create(payload: PessoaSavePayload): Observable<{ id: string }> {
    // Mock de regra: documento duplicado
    const doc = payload.documento;
    if (doc && this.db.some((x) => x.documento === doc)) {
      return throwError(() => new Error('Documento já cadastrado'));
    }

    const id = String(Date.now());
    this.db.push({
      id,
      tipo: payload.tipo,
      nome: payload.nome,
      documento: payload.documento,
      email: payload.email || '',
      notificacaoAtiva: payload.notificacaoEmail,
      ativa: payload.ativa,
    });

    return of({ id }).pipe(delay(400));
  }

  update(id: string, payload: PessoaSavePayload): Observable<void> {
    const idx = this.db.findIndex((x) => x.id === id);
    if (idx < 0) return throwError(() => new Error('Pessoa não encontrada'));

    // Mock de regra: documento duplicado em outro registro
    if (
      payload.documento &&
      this.db.some((x) => x.id !== id && x.documento === payload.documento)
    ) {
      return throwError(() => new Error('Documento já cadastrado'));
    }

    const current = this.db[idx];
    this.db[idx] = {
      ...current,
      tipo: payload.tipo,
      nome: payload.nome,
      documento: payload.documento,
      email: payload.email || '',
      notificacaoAtiva: payload.notificacaoEmail,
      ativa: payload.ativa,
    };

    return of(void 0).pipe(delay(350));
  }
}

