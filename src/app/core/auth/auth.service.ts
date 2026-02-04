import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../http/api.config';
import { AuthStorage } from './auth.storage';
import { LoginRequest, LoginResponse, AuthUser } from './auth.models';
import { Role } from './roles';
import { extractApiMessage } from '../http/http-error.util';

export class AuthApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly user$ = new BehaviorSubject<AuthUser | null>(this.storage.getUser());

  constructor(
    private http: HttpClient,
    private storage: AuthStorage
  ) {}

  currentUser() {
    return this.user$.asObservable();
  }

  getSnapshotUser(): AuthUser | null {
    return this.user$.value;
  }

  isAuthenticated(): boolean {
    return !!this.storage.getToken();
  }

  getRole(): Role | null {
    const user = this.user$.value;
    if (!user) return null;

    return user.role;
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  async login(input: LoginRequest): Promise<AuthUser> {
    try {
      const res = await firstValueFrom(
        this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, input)
      );

      this.storage.setToken(res.token);
      this.storage.setUser(res.user);
      this.user$.next(res.user);

      return res.user;
    } catch (err: any) {
      this.storage.clear();
      this.user$.next(null);

      const msg = extractApiMessage(err);
      throw new AuthApiError(msg, err?.status);
    }
  }

  async me(): Promise<AuthUser> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ user: AuthUser }>(`${API_BASE_URL}/auth/me`)
      );

      this.storage.setUser(res.user);
      this.user$.next(res.user);

      return res.user;
    } catch (err: any) {
      const msg = extractApiMessage(err);
      throw new AuthApiError(msg, err?.status);
    }
  }

  logout(): void {
    this.storage.clear();
    this.user$.next(null);
  }
  
}

