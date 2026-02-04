import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { API_BASE_URL } from '../../../core/http/api.config';
import { ApiError } from '../../../core/http/api.model';

import { 
  Admin, AdminFilters, AdminCreate, 
  AdminListPageResult, AdminStatus,
  AdminDetail
} from '../models/admin.model'

@Injectable({ providedIn: 'root' })
export class SuperadminSource {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = API_BASE_URL; 

    private normalizeError(err: HttpErrorResponse): ApiError {
        return {
            status: err.status,
            message: err.error?.message || err.message || 'Erro inesperado',
            raw: err
        };
    }

  listAdmins(filters: AdminFilters): Observable<AdminListPageResult> {
    let params = new HttpParams()
      .set('page', String(filters.page))
      .set('pageSize', String(filters.pageSize));

    if (filters.searchTerm?.trim()) params = params.set('search', filters.searchTerm.trim());
    if (filters.status && filters.status !== AdminStatus.ALL) {
      params = params.set('isActive', AdminStatus.ACTIVE === filters.status);
    }
    
    return this.http.get<AdminListPageResult>(`${API_BASE_URL}/superadmin/admins`, { params })
        .pipe(
            catchError((err: HttpErrorResponse) => {
                return throwError(() => this.normalizeError(err));
            })
        );
  }

  getAdminById(id: string): Observable<AdminDetail> {
    return this.http.get<AdminDetail>(`${API_BASE_URL}/superadmin/admins/${id}`)
        .pipe(
            catchError((err: HttpErrorResponse) => {
                return throwError(() => this.normalizeError(err));
            })
        );
  }

  updateAdminStatus(id: string, blocked: boolean): Observable<AdminDetail> {
    return this.http.patch<AdminDetail>(`${API_BASE_URL}/superadmin/admins/${id}/block`, {
      blocked: blocked
    }).pipe(
            catchError((err: HttpErrorResponse) => {
                return throwError(() => this.normalizeError(err));
            })
        );
  }
  
  createAdmin(payload: AdminCreate) {
    return this.http.post<{adminId: string} >(`${API_BASE_URL}/superadmin/admins`, { 
      name: payload.name,
      email: payload.email
     })
        .pipe(
            catchError((err: HttpErrorResponse) => {
                return throwError(() => this.normalizeError(err));
            })
        );
  }
}

