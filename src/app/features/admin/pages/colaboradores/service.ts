import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Colaborador, ColaboradoresFiltro } from './models';

@Injectable({ providedIn: 'root' })
export class ColaboradoresService {
  private readonly db: Colaborador[] = [
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
      ativa: true,
      fotoUrl: null,
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
      ativa: false,
      fotoUrl: null,
    },
    {
      id: '3',
      nome: 'Bruno Siqueira',
      cpf: '121.889.330-25',
      email: 'bruno.siqueira@email.com',
      telefone: '(11) 97777-1000',
      nascimento: '1991-02-22',
      entrada: '2022-09-10',
      cargo: 'Coordenação',
      matricula: 'MAT-1130',
      ativa: true,
      fotoUrl: null,
    },
  ];

  list(filtro: ColaboradoresFiltro): Observable<Colaborador[]> {
    return of(this.db).pipe(
      delay(250),
      map((items) => this.applyFiltro(items, filtro))
    );
  }

  toggleAtiva(id: string, value: boolean): Observable<void> {
    const item = this.db.find((c) => c.id === id);
    if (!item) return throwError(() => new Error('Colaborador não encontrado'));
    item.ativa = value;
    return of(void 0).pipe(delay(150));
  }

  delete(id: string): Observable<void> {
    const index = this.db.findIndex((c) => c.id === id);
    if (index < 0) return throwError(() => new Error('Colaborador não encontrado'));
    this.db.splice(index, 1);
    return of(void 0).pipe(delay(200));
  }

  private applyFiltro(items: Colaborador[], filtro: ColaboradoresFiltro): Colaborador[] {
    const termo = (filtro.termo || '').trim().toLowerCase();

    return items.filter((c) => {
      // if (filtro.somenteAtivos && !c.ativa) return false;

      if (filtro.status === 'ATIVOS' && !c.ativa) return false;
      if (filtro.status === 'INATIVOS' && c.ativa) return false;

      if (!termo) return true;

      return (
        c.nome.toLowerCase().includes(termo) ||
        c.cpf.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo) ||
        c.telefone.toLowerCase().includes(termo) ||
        c.cargo.toLowerCase().includes(termo) ||
        c.matricula.toLowerCase().includes(termo)
      );
    });
  }
}
