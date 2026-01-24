import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LicencaInfo } from './models';

@Injectable({ providedIn: 'root' })
export class LicencaService {
  private readonly licenca = signal<LicencaInfo>({
    tenant: 'Escola',
    status: 'VALIDA',
    validade: '2026-02-18',
    tolerancia: '2026-03-18',
  });

  obterLicenca(): Observable<LicencaInfo> {
    return of(this.licenca());
  }
}
