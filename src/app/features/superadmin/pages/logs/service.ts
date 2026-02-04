import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API_BASE_URL } from '../../../../core/http/api.config';
import { LogCategoria, LogFiltro, LogRegistro } from './models';

interface AuditLogItem {
  id: string;
  entityType: 'ADMIN' | 'SHOP' | 'BILLING' | 'WEBHOOK' | string;
  entityId: string;
  eventType: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface AuditLogResponse {
  page: number;
  limit: number;
  total: number;
  items: AuditLogItem[];
}

@Injectable({ providedIn: 'root' })
export class SuperadminLogsService {
  constructor(private http: HttpClient) {}

  listLogs(filtro: LogFiltro): Observable<LogRegistro[]> {
    let params = new HttpParams().set('page', '1').set('limit', '100');

    if (filtro.dataInicio) params = params.set('dateFrom', filtro.dataInicio);
    if (filtro.dataFim) params = params.set('dateTo', filtro.dataFim);

    if (filtro.categoria !== 'TODOS') {
      const mapping = this.mapCategoriaToApi(filtro.categoria);
      if (mapping.entityType) params = params.set('entityType', mapping.entityType);
      if (mapping.eventType) params = params.set('eventType', mapping.eventType);
    }

    return this.http
      .get<AuditLogResponse>(`${API_BASE_URL}/superadmin/audit-logs`, { params })
      .pipe(
        map((res) => res.items.map((item) => this.mapAuditLog(item))),
        map((items) => this.filterLogs(items, filtro))
      );
  }

  private mapCategoriaToApi(categoria: LogCategoria): {
    entityType?: string;
    eventType?: string;
  } {
    switch (categoria) {
      case 'CADASTRO_LOJA':
        return { entityType: 'SHOP', eventType: 'CREATE' };
      case 'CADASTRO_ADMIN':
        return { entityType: 'ADMIN', eventType: 'CREATE' };
      case 'BLOQUEIO_LOJA':
        return { entityType: 'SHOP', eventType: 'BLOCK' };
      case 'DESBLOQUEIO_LOJA':
        return { entityType: 'SHOP', eventType: 'UNBLOCK' };
      case 'BLOQUEIO_ADMIN':
        return { entityType: 'ADMIN', eventType: 'BLOCK' };
      case 'DESBLOQUEIO_ADMIN':
        return { entityType: 'ADMIN', eventType: 'UNBLOCK' };
      case 'PAGAMENTO_BOLETO':
        return { entityType: 'BILLING', eventType: 'PAID' };
      default:
        return {};
    }
  }

  private mapAuditLog(item: AuditLogItem): LogRegistro {
    const metadata = item.metadata ?? {};
    const operator = (metadata['operator'] as string) ?? '';
    const origin = (metadata['origin'] as string) ?? '';
    const reference = (metadata['reference'] as string) ?? '';
    const terminal = (metadata['terminal'] as string) ?? '';
    const ip = (metadata['ip'] as string) ?? '';
    const description = (metadata['description'] as string) ?? '';

    return {
      id: item.id,
      dataHora: item.createdAt,
      categoria: this.mapCategoriaFromApi(item),
      operador: operator,
      terminal,
      descricao: description,
      referencia: reference,
      origem: origin,
      ip,
    };
  }

  private mapCategoriaFromApi(item: AuditLogItem): LogCategoria {
    if (item.entityType === 'ADMIN') {
      if (item.eventType === 'BLOCK') return 'BLOQUEIO_ADMIN';
      if (item.eventType === 'UNBLOCK') return 'DESBLOQUEIO_ADMIN';
      return 'CADASTRO_ADMIN';
    }

    if (item.entityType === 'SHOP') {
      if (item.eventType === 'BLOCK') return 'BLOQUEIO_LOJA';
      if (item.eventType === 'UNBLOCK') return 'DESBLOQUEIO_LOJA';
      return 'CADASTRO_LOJA';
    }

    if (item.entityType === 'BILLING') {
      return 'PAGAMENTO_BOLETO';
    }

    return 'CADASTRO_ADMIN';
  }

  private filterLogs(items: LogRegistro[], filtro: LogFiltro): LogRegistro[] {
    const termo = filtro.termo.trim().toLowerCase();
    if (!termo) return items;

    return items.filter(
      (item) =>
        item.descricao.toLowerCase().includes(termo) ||
        item.referencia.toLowerCase().includes(termo) ||
        item.operador.toLowerCase().includes(termo) ||
        item.terminal.toLowerCase().includes(termo) ||
        item.origem.toLowerCase().includes(termo) ||
        item.ip.toLowerCase().includes(termo)
    );
  }
}
