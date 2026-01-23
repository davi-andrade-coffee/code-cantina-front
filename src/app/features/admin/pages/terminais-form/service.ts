import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TerminalSavePayload } from './models';

interface TerminalDb {
  id: string;
  codigo: string;
  nome: string;
  portaBalanca: string;
  impressoraFiscal: string;
  imprimeCupom: boolean;
  previewCupom: boolean;
  modoOffline: boolean;
  ativo: boolean;
}

@Injectable({ providedIn: 'root' })
export class TerminaisFormService {
  private readonly db: TerminalDb[] = [
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
  ];

  getById(id: string): Observable<TerminalSavePayload> {
    const item = this.db.find((x) => x.id === id);
    if (!item) return throwError(() => new Error('Terminal não encontrado'));

    return of({
      id: item.id,
      codigo: item.codigo,
      nome: item.nome,
      portaBalanca: item.portaBalanca,
      impressoraFiscal: item.impressoraFiscal,
      imprimeCupom: item.imprimeCupom,
      previewCupom: item.previewCupom,
      modoOffline: item.modoOffline,
      ativo: item.ativo,
    }).pipe(delay(250));
  }

  create(payload: TerminalSavePayload): Observable<{ id: string }> {
    const codigo = payload.codigo.toLowerCase();
    if (this.db.some((x) => x.codigo.toLowerCase() === codigo)) {
      return throwError(() => new Error('Código já cadastrado'));
    }

    const id = String(Date.now());
    this.db.push({
      id,
      codigo: payload.codigo,
      nome: payload.nome,
      portaBalanca: payload.portaBalanca || '',
      impressoraFiscal: payload.impressoraFiscal || '',
      imprimeCupom: payload.imprimeCupom,
      previewCupom: payload.previewCupom,
      modoOffline: payload.modoOffline,
      ativo: payload.ativo,
    });

    return of({ id }).pipe(delay(400));
  }

  update(id: string, payload: TerminalSavePayload): Observable<void> {
    const idx = this.db.findIndex((x) => x.id === id);
    if (idx < 0) return throwError(() => new Error('Terminal não encontrado'));

    if (
      this.db.some(
        (x) => x.id !== id && x.codigo.toLowerCase() === payload.codigo.toLowerCase()
      )
    ) {
      return throwError(() => new Error('Código já cadastrado'));
    }

    const current = this.db[idx];
    this.db[idx] = {
      ...current,
      codigo: payload.codigo,
      nome: payload.nome,
      portaBalanca: payload.portaBalanca || '',
      impressoraFiscal: payload.impressoraFiscal || '',
      imprimeCupom: payload.imprimeCupom,
      previewCupom: payload.previewCupom,
      modoOffline: payload.modoOffline,
      ativo: payload.ativo,
    };

    return of(void 0).pipe(delay(350));
  }
}
