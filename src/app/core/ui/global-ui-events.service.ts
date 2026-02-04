import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type GlobalUiEvent =
  | { type: 'SESSION_EXPIRED' }
  | { type: 'FORBIDDEN' };

@Injectable({ providedIn: 'root' })
export class GlobalUiEventsService {
  private readonly subject = new Subject<GlobalUiEvent>();
  readonly events$ = this.subject.asObservable();

  emit(event: GlobalUiEvent): void {
    this.subject.next(event);
  }
}

