import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Produto, ProdutosFiltro } from './models';

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private readonly db: Produto[] = [
    {
      id: '1',
      nome: 'Coxinha tradicional',
      descricao: 'Salgado assado com frango desfiado',
      tipo: 'UNITARIO',
      ativo: true,
      precoCents: 650,
      controleEstoque: true,
      quantidadeEstoque: 120,
    },
    {
      id: '2',
      nome: 'Suco natural de laranja',
      descricao: 'Bebida preparada diariamente',
      tipo: 'QUILO',
      ativo: true,
      precoCents: 2290,
      controleEstoque: false,
      quantidadeEstoque: null,
    },
    {
      id: '3',
      nome: 'Bolo de cenoura',
      descricao: 'Fatia individual com cobertura de chocolate',
      tipo: 'UNITARIO',
      ativo: false,
      precoCents: 800,
      controleEstoque: false,
      quantidadeEstoque: null,
    },
  ];

  list(filtro: ProdutosFiltro): Observable<Produto[]> {
    return of(this.db).pipe(
      delay(250),
      map((items) => this.applyFiltro(items, filtro))
    );
  }

  toggleAtivo(id: string, value: boolean): Observable<void> {
    const item = this.db.find((p) => p.id === id);
    if (!item) return throwError(() => new Error('Produto não encontrado'));
    item.ativo = value;
    return of(void 0).pipe(delay(150));
  }

  delete(id: string): Observable<void> {
    const index = this.db.findIndex((p) => p.id === id);
    if (index < 0) return throwError(() => new Error('Produto não encontrado'));
    this.db.splice(index, 1);
    return of(void 0).pipe(delay(200));
  }

  private applyFiltro(items: Produto[], filtro: ProdutosFiltro): Produto[] {
    const termo = (filtro.termo || '').trim().toLowerCase();

    return items.filter((p) => {
      if (filtro.somenteAtivos && !p.ativo) return false;

      if (filtro.status === 'ATIVOS' && !p.ativo) return false;
      if (filtro.status === 'INATIVOS' && p.ativo) return false;

      if (filtro.tipo !== 'TODOS' && p.tipo !== filtro.tipo) return false;

      if (!termo) return true;

      return (
        p.nome.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo)
      );
    });
  }
}
