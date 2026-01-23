import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ColaboradorSavePayload } from './models';

interface ColaboradorDb {
  id: string;
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
}

@Injectable({ providedIn: 'root' })
export class ColaboradoresFormService {
  private readonly db: ColaboradorDb[] = [
    {
      id: '1',
      nome: 'Mateus Torres',
      cpf: '024.889.550-11',
      email: 'mateus.torres@email.com',
      telefone: '(11) 99999-0001',
      nascimento: '1994-09-14',
      entrada: '2023-01-02',
      cargo: 'Atendimento',
      matricula: 'MAT-1023',
      observacoes: 'Atende no balcão durante a manhã.',
      ativa: true,
    },
    {
      id: '2',
      nome: 'Larissa Almeida',
      cpf: '437.912.880-30',
      email: 'larissa.almeida@email.com',
      telefone: '(11) 98888-2222',
      nascimento: '1989-06-03',
      entrada: '2021-05-18',
      cargo: 'Operações',
      matricula: 'MAT-0987',
      observacoes: 'Responsável pelo estoque.',
      ativa: false,
    },
  ];

  getById(id: string): Observable<ColaboradorSavePayload> {
    const item = this.db.find((x) => x.id === id);
    if (!item) return throwError(() => new Error('Colaborador não encontrado'));

    return of({
      id: item.id,
      nome: item.nome,
      cpf: item.cpf,
      email: item.email,
      telefone: item.telefone,
      nascimento: item.nascimento,
      entrada: item.entrada,
      cargo: item.cargo,
      matricula: item.matricula,
      observacoes: item.observacoes,
      ativa: item.ativa,
    }).pipe(delay(250));
  }

  create(payload: ColaboradorSavePayload): Observable<{ id: string }> {
    const cpf = payload.cpf;
    if (cpf && this.db.some((x) => x.cpf === cpf)) {
      return throwError(() => new Error('CPF já cadastrado'));
    }

    const id = String(Date.now());
    this.db.push({
      id,
      nome: payload.nome,
      cpf: payload.cpf,
      email: payload.email || '',
      telefone: payload.telefone || '',
      nascimento: payload.nascimento || '',
      entrada: payload.entrada || '',
      cargo: payload.cargo || '',
      matricula: payload.matricula || '',
      observacoes: payload.observacoes || '',
      ativa: payload.ativa,
    });

    return of({ id }).pipe(delay(400));
  }

  update(id: string, payload: ColaboradorSavePayload): Observable<void> {
    const idx = this.db.findIndex((x) => x.id === id);
    if (idx < 0) return throwError(() => new Error('Colaborador não encontrado'));

    if (payload.cpf && this.db.some((x) => x.id !== id && x.cpf === payload.cpf)) {
      return throwError(() => new Error('CPF já cadastrado'));
    }

    const current = this.db[idx];
    this.db[idx] = {
      ...current,
      nome: payload.nome,
      cpf: payload.cpf,
      email: payload.email || '',
      telefone: payload.telefone || '',
      nascimento: payload.nascimento || '',
      entrada: payload.entrada || '',
      cargo: payload.cargo || '',
      matricula: payload.matricula || '',
      observacoes: payload.observacoes || '',
      ativa: payload.ativa,
    };

    return of(void 0).pipe(delay(350));
  }
}
