import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TerminalPdv, TerminaisFiltro } from './models';

@Injectable({ providedIn: 'root' })
export class TerminaisService {
  private readonly db: TerminalPdv[] = [
    {
      id: '1',
      codigo: 'PDV-01',
      nome: 'PDV Principal',
      portaBalanca: 'COM1',
      impressoraFiscal: 'ELGIN-i9',
      imprimeCupom: true,
      previewCupom: true,
      modoOffline: false,
      ativo: true,
    },
    {
      id: '2',
      codigo: 'PDV-02',
      nome: 'Caixa Lateral',
      portaBalanca: '',
      impressoraFiscal: 'Bematech MP-4200',
      imprimeCupom: true,
      previewCupom: false,
      modoOffline: true,
      ativo: true,
    },
    {
      id: '3',
      codigo: 'PDV-03',
      nome: 'Autoatendimento',
      portaBalanca: '',
      impressoraFiscal: '',
      imprimeCupom: false,
      previewCupom: false,
      modoOffline: false,
      ativo: false,
    },
  ];

  list(filtro: TerminaisFiltro): Observable<TerminalPdv[]> {
    return of(this.db).pipe(
      delay(250),
      map((items) => this.applyFiltro(items, filtro))
    );
  }

  toggleAtivo(id: string, value: boolean): Observable<void> {
    const item = this.db.find((t) => t.id === id);
    if (!item) return throwError(() => new Error('Terminal não encontrado'));
    item.ativo = value;
    return of(void 0).pipe(delay(150));
  }

  delete(id: string): Observable<void> {
    const index = this.db.findIndex((t) => t.id === id);
    if (index < 0) return throwError(() => new Error('Terminal não encontrado'));
    this.db.splice(index, 1);
    return of(void 0).pipe(delay(200));
  }

  private applyFiltro(items: TerminalPdv[], filtro: TerminaisFiltro): TerminalPdv[] {
    const termo = (filtro.termo || '').trim().toLowerCase();

    return items.filter((t) => {
      if (filtro.somenteAtivos && !t.ativo) return false;

      if (filtro.status === 'ATIVOS' && !t.ativo) return false;
      if (filtro.status === 'INATIVOS' && t.ativo) return false;

      if (!termo) return true;

      return (
        t.codigo.toLowerCase().includes(termo) ||
        t.nome.toLowerCase().includes(termo) ||
        t.portaBalanca.toLowerCase().includes(termo) ||
        t.impressoraFiscal.toLowerCase().includes(termo)
      );
    });
  }
}
