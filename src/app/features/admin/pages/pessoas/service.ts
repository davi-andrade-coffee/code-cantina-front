import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Pessoa, PessoasFiltro } from './models';

@Injectable({ providedIn: 'root' })
export class PessoasService {
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

  list(filtro: PessoasFiltro): Observable<Pessoa[]> {
    // Mock de latência (simula rede)
    return of(this.db).pipe(
      delay(250),
      map((items) => this.applyFiltro(items, filtro))
    );
  }

  toggleNotificacao(id: string, value: boolean): Observable<void> {
    const item = this.db.find((p) => p.id === id);
    if (!item) return throwError(() => new Error('Pessoa não encontrada'));
    item.notificacaoAtiva = value;
    return of(void 0).pipe(delay(150));
  }

  toggleAtiva(id: string, value: boolean): Observable<void> {
    const item = this.db.find((p) => p.id === id);
    if (!item) return throwError(() => new Error('Pessoa não encontrada'));
    item.ativa = value;
    return of(void 0).pipe(delay(150));
  }

  delete(id: string): Observable<void> {
    const index = this.db.findIndex((p) => p.id === id);
    if (index < 0) return throwError(() => new Error('Pessoa não encontrada'));
    this.db.splice(index, 1);
    return of(void 0).pipe(delay(200));
  }

  // futuramente ser feito no backend
  private applyFiltro(items: Pessoa[], filtro: PessoasFiltro): Pessoa[] {
    const termo = (filtro.termo || '').trim().toLowerCase();

    return items.filter((p) => {
      if (filtro.somenteAtivos && !p.ativa) return false;

      if (filtro.tipo !== 'TODOS' && p.tipo !== filtro.tipo) return false;

      if (!termo) return true;

      // termo bate em nome ou documento
      return (
        p.nome.toLowerCase().includes(termo) ||
        p.documento.toLowerCase().includes(termo)
      );
    });
  }
}

