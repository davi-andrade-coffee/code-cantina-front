import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import {  ThemeButtonComponent } from "../../../shared/theme/theme.component";

import { AuthService } from '../../../core/auth/auth.service';
import { SUPERADMIN_MENU } from './menu.data';
import { MenuItem, MenuSection } from './menu.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ThemeButtonComponent],
  templateUrl: './superadmin-layout.html',
})
export class SuperadminLayoutComponent {
  menu: MenuSection[] = SUPERADMIN_MENU;

  currentUrl = signal<string>('/superadmin');

  userEmail = this.auth.getSnapshotUser()?.email ?? '—';
  userRole = this.auth.getSnapshotUser()?.role ?? 'SUPER ADMIN';

  breadcrumbs = computed(() => this.buildBreadcrumbs(this.currentUrl()));

  constructor(private router: Router, private auth: AuthService) {
    this.currentUrl.set(this.router.url);
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => this.currentUrl.set(e.urlAfterRedirects));
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }

  isActive(item: MenuItem): boolean | string {
    const path = item.path ?? '';
    return path && this.currentUrl().startsWith(path);
  }

  private buildBreadcrumbs(url: string): string[] {
    const parts = url.replace('/superadmin/', '').split('/').filter(Boolean);
    const normalize = (s: string) =>
      s
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return parts.map(normalize);
  }
}
