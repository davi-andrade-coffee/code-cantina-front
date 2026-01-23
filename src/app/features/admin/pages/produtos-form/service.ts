import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProdutoSavePayload } from './models';

interface ProdutoDb {
  id: string;
  nome: string;
  tipo: 'UNITARIO' | 'QUILO';
  descricao: string;
  precoCents: number;
  controleEstoque: boolean;
  quantidadeEstoque: number | null;
  ativo: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProdutosFormService {
  private readonly db: ProdutoDb[] = [
    {
      id: '1',
      nome: 'Coxinha tradicional',
      tipo: 'UNITARIO',
      descricao: 'Salgado assado com frango desfiado',
      precoCents: 650,
      controleEstoque: true,
      quantidadeEstoque: 120,
      ativo: true,
    },
    {
      id: '2',
      nome: 'Suco natural de laranja',
      tipo: 'QUILO',
      descricao: 'Bebida preparada diariamente',
      precoCents: 2290,
      controleEstoque: false,
      quantidadeEstoque: null,
      ativo: true,
    },
  ];

  getById(id: string): Observable<ProdutoSavePayload> {
    const item = this.db.find((x) => x.id === id);
    if (!item) return throwError(() => new Error('Produto não encontrado'));

    return of({
      id: item.id,
      nome: item.nome,
      tipo: item.tipo,
      descricao: item.descricao,
      precoCents: item.precoCents,
      controleEstoque: item.controleEstoque,
      quantidadeEstoque: item.quantidadeEstoque,
      ativo: item.ativo,
    }).pipe(delay(250));
  }

  create(payload: ProdutoSavePayload): Observable<{ id: string }> {
    if (this.db.some((x) => x.nome.toLowerCase() === payload.nome.toLowerCase())) {
      return throwError(() => new Error('Produto já cadastrado'));
    }

    const id = String(Date.now());
    this.db.push({
      id,
      nome: payload.nome,
      tipo: payload.tipo,
      descricao: payload.descricao || '',
      precoCents: payload.precoCents,
      controleEstoque: payload.controleEstoque,
      quantidadeEstoque: payload.quantidadeEstoque ?? null,
      ativo: payload.ativo,
    });

    return of({ id }).pipe(delay(400));
  }

  update(id: string, payload: ProdutoSavePayload): Observable<void> {
    const idx = this.db.findIndex((x) => x.id === id);
    if (idx < 0) return throwError(() => new Error('Produto não encontrado'));

    if (
      this.db.some(
        (x) => x.id !== id && x.nome.toLowerCase() === payload.nome.toLowerCase()
      )
    ) {
      return throwError(() => new Error('Produto já cadastrado'));
    }

    const current = this.db[idx];
    this.db[idx] = {
      ...current,
      nome: payload.nome,
      tipo: payload.tipo,
      descricao: payload.descricao || '',
      precoCents: payload.precoCents,
      controleEstoque: payload.controleEstoque,
      quantidadeEstoque: payload.quantidadeEstoque ?? null,
      ativo: payload.ativo,
    };

    return of(void 0).pipe(delay(350));
  }
}
