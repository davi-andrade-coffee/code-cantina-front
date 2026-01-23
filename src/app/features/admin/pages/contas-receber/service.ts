import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Recebivel } from './models';

@Injectable({ providedIn: 'root' })
export class ContasReceberService {
  private readonly recebiveis = signal<Recebivel[]>([
    {
      id: '1',
      pessoaNome: 'Mariana Albuquerque',
      pessoaTipo: 'ALUNO',
      planoTipo: 'CONVENIO',
      responsavel: 'Carlos Albuquerque',
      documento: '123.456.789-00',
      registro: 'ALU-0231',
      competencia: '2024-09',
      valorDevido: 420,
      valorPago: 120,
      status: 'EM_ABERTO',
      ultimaCobranca: '2024-09-05',
    },
    {
      id: '2',
      pessoaNome: 'Paulo Henrique',
      pessoaTipo: 'PROFESSOR',
      planoTipo: 'CONVENIO',
      responsavel: '—',
      documento: '987.654.321-00',
      registro: 'PRO-1802',
      competencia: '2024-09',
      valorDevido: 380,
      valorPago: 0,
      status: 'VENCIDO',
      ultimaCobranca: '2024-09-02',
    },
    {
      id: '3',
      pessoaNome: 'Beatriz Campos',
      pessoaTipo: 'ALUNO',
      planoTipo: 'PRE_PAGO',
      responsavel: 'Rita Campos',
      documento: '234.567.890-11',
      registro: 'ALU-0844',
      competencia: '2024-09',
      valorDevido: 520,
      valorPago: 520,
      status: 'QUITADO',
      ultimaCobranca: '2024-09-01',
    },
    {
      id: '4',
      pessoaNome: 'Henrique Lopes',
      pessoaTipo: 'OUTRO',
      planoTipo: 'CONVENIO',
      responsavel: '—',
      documento: '345.678.901-22',
      registro: 'OUT-0342',
      competencia: '2024-09',
      valorDevido: 260,
      valorPago: 0,
      status: 'EM_ABERTO',
      ultimaCobranca: '2024-09-08',
    },
    {
      id: '5',
      pessoaNome: 'Camila Nogueira',
      pessoaTipo: 'ALUNO',
      planoTipo: 'CONVENIO',
      responsavel: 'Eduardo Nogueira',
      documento: '456.789.012-33',
      registro: 'ALU-1129',
      competencia: '2024-09',
      valorDevido: 410,
      valorPago: 250,
      status: 'EM_ABERTO',
      ultimaCobranca: '2024-09-09',
    },
    {
      id: '6',
      pessoaNome: 'Sofia Carvalho',
      pessoaTipo: 'PROFESSOR',
      planoTipo: 'PRE_PAGO',
      responsavel: '—',
      documento: '567.890.123-44',
      registro: 'PRO-0723',
      competencia: '2024-09',
      valorDevido: 310,
      valorPago: 0,
      status: 'EM_ABERTO',
      ultimaCobranca: '2024-09-06',
    },
    {
      id: '7',
      pessoaNome: 'Rafael Dias',
      pessoaTipo: 'OUTRO',
      planoTipo: 'CONVENIO',
      responsavel: '—',
      documento: '678.901.234-55',
      registro: 'OUT-0788',
      competencia: '2024-09',
      valorDevido: 290,
      valorPago: 100,
      status: 'EM_ABERTO',
      ultimaCobranca: '2024-09-07',
    },
    {
      id: '8',
      pessoaNome: 'Luciana Moraes',
      pessoaTipo: 'ALUNO',
      planoTipo: 'CONVENIO',
      responsavel: 'Gustavo Moraes',
      documento: '789.012.345-66',
      registro: 'ALU-0491',
      competencia: '2024-09',
      valorDevido: 360,
      valorPago: 0,
      status: 'VENCIDO',
      ultimaCobranca: '2024-09-03',
    },
    {
      id: '9',
      pessoaNome: 'Gabriel Santos',
      pessoaTipo: 'PROFESSOR',
      planoTipo: 'CONVENIO',
      responsavel: '—',
      documento: '890.123.456-77',
      registro: 'PRO-2220',
      competencia: '2024-09',
      valorDevido: 500,
      valorPago: 320,
      status: 'EM_ABERTO',
      ultimaCobranca: '2024-09-10',
    },
    {
      id: '10',
      pessoaNome: 'Natalia Freitas',
      pessoaTipo: 'ALUNO',
      planoTipo: 'PRE_PAGO',
      responsavel: 'Marcos Freitas',
      documento: '901.234.567-88',
      registro: 'ALU-0670',
      competencia: '2024-09',
      valorDevido: 470,
      valorPago: 0,
      status: 'EM_ABERTO',
      ultimaCobranca: '2024-09-04',
    },
    {
      id: '11',
      pessoaNome: 'João Batista',
      pessoaTipo: 'OUTRO',
      planoTipo: 'CONVENIO',
      responsavel: '—',
      documento: '018.234.567-99',
      registro: 'OUT-0991',
      competencia: '2024-09',
      valorDevido: 320,
      valorPago: 0,
      status: 'EM_ABERTO',
      ultimaCobranca: '2024-09-11',
    },
  ]);

  list(): Observable<Recebivel[]> {
    return of(this.recebiveis());
  }

  enviarCobranca(id: string, data: string): Observable<void> {
    this.recebiveis.update((lista) =>
      lista.map((item) => (item.id === id ? { ...item, ultimaCobranca: data } : item))
    );
    return of(void 0);
  }

  marcarPagamento(id: string): Observable<void> {
    this.recebiveis.update((lista) =>
      lista.map((item) =>
        item.id === id ? { ...item, valorPago: item.valorDevido, status: 'QUITADO' } : item
      )
    );
    return of(void 0);
  }

  atualizarMock(): Observable<void> {
    this.recebiveis.update((lista) =>
      lista.map((item, index) => ({
        ...item,
        valorPago:
          item.status === 'QUITADO'
            ? item.valorDevido
            : Math.min(item.valorDevido, item.valorPago + (index % 4) * 25),
      }))
    );
    return of(void 0);
  }
}
