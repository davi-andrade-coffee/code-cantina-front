import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { CashDatasource } from './cash.datasource';
import {
  CashMovementType,
  CashPaymentMethod,
  CashSessionDetail,
  CashSessionFilters,
  CashSessionListItem,
  CashSessionListResponse,
} from './cash.models';

const toIso = (value: string) => new Date(value).toISOString();

const sessions: CashSessionListItem[] = [
  {
    id: 'session-001',
    code: 'CX-2026-0012',
    terminalName: 'Terminal 01',
    operatorName: 'Camila Rocha',
    openedAt: toIso('2024-09-20T08:00:00'),
    closedAt: toIso('2024-09-20T16:40:00'),
    status: 'CLOSED',
    openingBalanceCents: 5000,
    expectedCashCents: 158000,
    closingCashCents: 157500,
    differenceCents: -500,
  },
  {
    id: 'session-002',
    code: 'CX-2026-0013',
    terminalName: 'Terminal 02',
    operatorName: 'Rafael Lima',
    openedAt: toIso('2024-09-20T09:15:00'),
    closedAt: toIso('2024-09-20T17:45:00'),
    status: 'CLOSED',
    openingBalanceCents: 8000,
    expectedCashCents: 112400,
    closingCashCents: 112400,
    differenceCents: 0,
  },
  {
    id: 'session-003',
    code: 'CX-2026-0014',
    terminalName: 'Terminal 03',
    operatorName: 'Maria Santos',
    openedAt: toIso('2024-09-21T07:50:00'),
    status: 'OPEN',
    openingBalanceCents: 6000,
  },
  {
    id: 'session-004',
    code: 'CX-2026-0015',
    terminalName: 'Terminal 01',
    operatorName: 'Igor Silva',
    openedAt: toIso('2024-09-21T08:10:00'),
    closedAt: toIso('2024-09-21T15:55:00'),
    status: 'CLOSED',
    openingBalanceCents: 5000,
    expectedCashCents: 93200,
    closingCashCents: 93400,
    differenceCents: 200,
  },
  {
    id: 'session-005',
    code: 'CX-2026-0016',
    terminalName: 'Terminal 02',
    operatorName: 'Larissa Costa',
    openedAt: toIso('2024-09-21T09:00:00'),
    status: 'OPEN',
    openingBalanceCents: 4500,
  },
  {
    id: 'session-006',
    code: 'CX-2026-0017',
    terminalName: 'Terminal 04',
    operatorName: 'Bruno Alves',
    openedAt: toIso('2024-09-22T08:05:00'),
    closedAt: toIso('2024-09-22T16:20:00'),
    status: 'CLOSED',
    openingBalanceCents: 7000,
    expectedCashCents: 126500,
    closingCashCents: 126100,
    differenceCents: -400,
  },
  {
    id: 'session-007',
    code: 'CX-2026-0018',
    terminalName: 'Terminal 03',
    operatorName: 'Marina Lopes',
    openedAt: toIso('2024-09-22T09:10:00'),
    closedAt: toIso('2024-09-22T17:10:00'),
    status: 'CLOSED',
    openingBalanceCents: 6500,
    expectedCashCents: 104800,
    closingCashCents: 104800,
    differenceCents: 0,
  },
  {
    id: 'session-008',
    code: 'CX-2026-0019',
    terminalName: 'Terminal 01',
    operatorName: 'Carla Mendes',
    openedAt: toIso('2024-09-23T08:00:00'),
    closedAt: toIso('2024-09-23T16:15:00'),
    status: 'CLOSED',
    openingBalanceCents: 5200,
    expectedCashCents: 98700,
    closingCashCents: 98700,
    differenceCents: 0,
  },
  {
    id: 'session-009',
    code: 'CX-2026-0020',
    terminalName: 'Terminal 02',
    operatorName: 'Paulo Souza',
    openedAt: toIso('2024-09-23T09:20:00'),
    status: 'OPEN',
    openingBalanceCents: 4000,
  },
  {
    id: 'session-010',
    code: 'CX-2026-0021',
    terminalName: 'Terminal 04',
    operatorName: 'Fernanda Alves',
    openedAt: toIso('2024-09-24T08:05:00'),
    closedAt: toIso('2024-09-24T16:05:00'),
    status: 'CLOSED',
    openingBalanceCents: 7500,
    expectedCashCents: 139900,
    closingCashCents: 140300,
    differenceCents: 400,
  },
  {
    id: 'session-011',
    code: 'CX-2026-0022',
    terminalName: 'Terminal 03',
    operatorName: 'Helena Dias',
    openedAt: toIso('2024-09-24T09:00:00'),
    closedAt: toIso('2024-09-24T17:25:00'),
    status: 'CLOSED',
    openingBalanceCents: 6300,
    expectedCashCents: 118200,
    closingCashCents: 118000,
    differenceCents: -200,
  },
  {
    id: 'session-012',
    code: 'CX-2026-0023',
    terminalName: 'Terminal 02',
    operatorName: 'Joana Ferreira',
    openedAt: toIso('2024-09-25T08:15:00'),
    closedAt: toIso('2024-09-25T16:55:00'),
    status: 'CLOSED',
    openingBalanceCents: 8200,
    expectedCashCents: 143300,
    closingCashCents: 143300,
    differenceCents: 0,
  },
];

const paymentMethods: CashPaymentMethod[] = ['CASH', 'WALLET', 'CONVENIO', 'MIXED'];
const movementTypes: CashMovementType[] = ['REINFORCEMENT', 'WITHDRAWAL'];

const details = new Map<string, CashSessionDetail>(
  sessions.map((session, index) => {
    const movementBase = new Date(session.openedAt).getTime();
    const salesBase = movementBase + 1000 * 60 * 30;
    const movementAmount = 2000 + index * 150;
    const withdrawalAmount = 3500 + index * 200;
    const salesCash = 52000 + index * 4100;
    const salesOther = 18000 + index * 1500;
    const reinforcements = movementAmount;
    const withdrawals = withdrawalAmount;

    const detail: CashSessionDetail = {
      id: session.id,
      code: session.code,
      terminal: { id: session.terminalName.toLowerCase().replace(' ', '-'), name: session.terminalName },
      operator: { id: session.operatorName.toLowerCase().replace(' ', '-'), name: session.operatorName },
      openedAt: session.openedAt,
      closedAt: session.closedAt,
      status: session.status,
      summary: {
        openingBalanceCents: session.openingBalanceCents,
        salesCashCents: salesCash,
        salesOtherCents: salesOther,
        reinforcementsCents: reinforcements,
        withdrawalsCents: withdrawals,
        expectedCashCents: session.expectedCashCents,
        closingCashCents: session.closingCashCents,
        differenceCents: session.differenceCents,
      },
      movements: [
        {
          id: `${session.id}-mov-1`,
          type: movementTypes[index % movementTypes.length],
          amountCents: movementAmount,
          createdAt: new Date(movementBase + 1000 * 60 * 45).toISOString(),
          note: 'Reforço para troco do turno.',
        },
        {
          id: `${session.id}-mov-2`,
          type: movementTypes[(index + 1) % movementTypes.length],
          amountCents: withdrawalAmount,
          createdAt: new Date(movementBase + 1000 * 60 * 150).toISOString(),
          note: 'Sangria parcial do caixa.',
        },
      ],
      sales: [
        {
          id: `${session.id}-sale-1`,
          code: `VD-${1020 + index}`,
          createdAt: new Date(salesBase + 1000 * 60 * 20).toISOString(),
          totalCents: 15400 + index * 800,
          paymentMethod: paymentMethods[index % paymentMethods.length],
          customerName: 'Cliente balcão',
        },
        {
          id: `${session.id}-sale-2`,
          code: `VD-${1030 + index}`,
          createdAt: new Date(salesBase + 1000 * 60 * 90).toISOString(),
          totalCents: 28900 + index * 1200,
          paymentMethod: paymentMethods[(index + 1) % paymentMethods.length],
          customerName: index % 2 === 0 ? 'Convênio Alfa' : undefined,
        },
      ],
    };

    return [session.id, detail];
  })
);

@Injectable({ providedIn: 'root' })
export class CashMockService extends CashDatasource {
  listSessions(
    filters: CashSessionFilters,
    page: number,
    pageSize: number
  ): Observable<CashSessionListResponse> {
    const startDate = filters.startDate ? new Date(`${filters.startDate}T00:00:00`) : null;
    const endDate = filters.endDate ? new Date(`${filters.endDate}T23:59:59`) : null;
    const searchTerm = filters.search.trim().toLowerCase();

    const filtered = sessions.filter((session) => {
      if (startDate && new Date(session.openedAt) < startDate) {
        return false;
      }
      if (endDate && new Date(session.openedAt) > endDate) {
        return false;
      }
      if (filters.status !== 'ALL' && session.status !== filters.status) {
        return false;
      }
      if (filters.terminal !== 'ALL' && session.terminalName !== filters.terminal) {
        return false;
      }
      if (filters.operator !== 'ALL' && session.operatorName !== filters.operator) {
        return false;
      }
      if (filters.onlyDivergence) {
        if (session.status !== 'CLOSED') {
          return false;
        }
        if (!session.differenceCents) {
          return false;
        }
      }
      if (searchTerm) {
        const haystack = `${session.terminalName} ${session.operatorName} ${session.code}`.toLowerCase();
        if (!haystack.includes(searchTerm)) {
          return false;
        }
      }
      return true;
    });

    const totalItems = filtered.length;
    const startIndex = Math.max((page - 1) * pageSize, 0);
    const items = filtered.slice(startIndex, startIndex + pageSize);

    return of({
      items,
      page,
      pageSize,
      totalItems,
    }).pipe(delay(250));
  }

  getSessionDetail(id: string): Observable<CashSessionDetail> {
    const detail = details.get(id);
    if (!detail) {
      return throwError(() => new Error('Sessão não encontrada.')).pipe(delay(200));
    }
    return of(detail).pipe(delay(200));
  }
}
