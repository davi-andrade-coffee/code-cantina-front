//@ts-nocheck
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import {
  BillingOverview,
  Invoice,
  InvoiceFilters,
  InvoiceInsights,
  InvoiceStatus,
} from '../models/invoice.model';

const INVOICE_DATA: Invoice[] = [
  {
    id: 'inv-001',
    adminId: 'adm-001',
    adminNome: 'Cantina Alfa',
    competencia: '08/2024',
    lojasAtivas: 3,
    valor: 559,
    vencimento: '2024-09-10',
    status: 'EM_ABERTO',
  },
  {
    id: 'inv-002',
    adminId: 'adm-002',
    adminNome: 'Grupo Beta',
    competencia: '08/2024',
    lojasAtivas: 6,
    valor: 919,
    vencimento: '2024-09-10',
    status: 'VENCIDA',
  },
  {
    id: 'inv-003',
    adminId: 'adm-003',
    adminNome: 'Rede Gama',
    competencia: '07/2024',
    lojasAtivas: 1,
    valor: 319,
    vencimento: '2024-08-10',
    status: 'PAGA',
  },
  {
    id: 'inv-004',
    adminId: 'adm-004',
    adminNome: 'Cantina Delta',
    competencia: '08/2024',
    lojasAtivas: 2,
    valor: 439,
    vencimento: '2024-09-10',
    status: 'EM_ABERTO',
  },
];

@Injectable({ providedIn: 'root' })
export class BillingMockService {
  listInvoices(filters: InvoiceFilters): Observable<Invoice[]> {
    return of(INVOICE_DATA).pipe(
      delay(300),
      map((invoices) => {
        const termo = filters.termo.toLowerCase();
        return invoices.filter((invoice) => {
          const matchTermo = !termo || invoice.adminNome.toLowerCase().includes(termo);
          const matchStatus = filters.status === 'TODOS' || invoice.status === filters.status;
          const matchCompetencia = !filters.competencia || invoice.competencia === filters.competencia;
          const matchVencida = !filters.somenteVencidas || invoice.status === 'VENCIDA';
          return matchTermo && matchStatus && matchCompetencia && matchVencida;
        });
      })
    );
  }

  getInvoiceInsights(): Observable<InvoiceInsights> {
    return of(INVOICE_DATA).pipe(
      delay(300),
      map((invoices) => {
        const receitaMes = invoices.reduce((acc, inv) => acc + inv.valor, 0);
        const receitaEmAberto = invoices
          .filter((inv) => inv.status === 'EM_ABERTO')
          .reduce((acc, inv) => acc + inv.valor, 0);
        const inadimplenciaValor = invoices
          .filter((inv) => inv.status === 'VENCIDA')
          .reduce((acc, inv) => acc + inv.valor, 0);

        const total = invoices.length;
        const inadimplenciaPercentual = total ? (inadimplenciaValor / receitaMes) * 100 : 0;

        const statusResumo = (['EM_ABERTO', 'PAGA', 'VENCIDA', 'CANCELADA'] as InvoiceStatus[]).map(
          (status) => ({
            status,
            total: invoices.filter((inv) => inv.status === status).length,
          })
        );

        return {
          receitaMes,
          receitaEmAberto,
          inadimplenciaValor,
          inadimplenciaPercentual,
          receitaPorMes: [
            { mes: 'Mai', valor: 4200 },
            { mes: 'Jun', valor: 5100 },
            { mes: 'Jul', valor: 6300 },
            { mes: 'Ago', valor: 7200 },
          ],
          statusResumo,
        };
      })
    );
  }

  getBillingOverview(): Observable<BillingOverview> {
    return of(true).pipe(
      delay(300),
      map(() => ({
        receitaMes: 7200,
        receitaAno: 48200,
        adminsAtivos: 12,
        lojasAtivas: 48,
        taxaInadimplencia: 8.5,
        receitaMensal: [
          { mes: 'Mai', valor: 4200 },
          { mes: 'Jun', valor: 5100 },
          { mes: 'Jul', valor: 6300 },
          { mes: 'Ago', valor: 7200 },
        ],
        novosAdminsMensal: [
          { mes: 'Mai', total: 2 },
          { mes: 'Jun', total: 3 },
          { mes: 'Jul', total: 1 },
          { mes: 'Ago', total: 4 },
        ],
        lojasAtivasMensal: [
          { mes: 'Mai', total: 32 },
          { mes: 'Jun', total: 38 },
          { mes: 'Jul', total: 44 },
          { mes: 'Ago', total: 48 },
        ],
        inadimplenciaMensal: [
          { mes: 'Mai', valor: 4.1 },
          { mes: 'Jun', valor: 6.0 },
          { mes: 'Jul', valor: 7.2 },
          { mes: 'Ago', valor: 8.5 },
        ],
      }))
    );
  }
}
