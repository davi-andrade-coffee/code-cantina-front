import { Observable } from 'rxjs';

import { CashSessionDetail, CashSessionFilters, CashSessionListResponse } from './cash.models';

export abstract class CashDatasource {
  abstract listSessions(
    filters: CashSessionFilters,
    page: number,
    pageSize: number
  ): Observable<CashSessionListResponse>;

  abstract getSessionDetail(id: string): Observable<CashSessionDetail>;
}
