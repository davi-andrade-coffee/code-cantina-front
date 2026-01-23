import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ADMIN_MENU } from './menu.data';
import { MenuItem, MenuSection } from './menu.model';
import { AuthService } from '../../../core/auth/auth.service';

type Theme = 'dark' | 'light';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-layout.html',
})
export class AdminLayoutComponent {
  menu: MenuSection[] = ADMIN_MENU;

  currentUrl = signal<string>('/admin');

  userEmail = this.auth.getSnapshotUser()?.email ?? '—';
  userRole = this.auth.getSnapshotUser()?.role ?? 'ADMIN';

  breadcrumbs = computed(() => this.buildBreadcrumbs(this.currentUrl()));
  theme: Theme = 'dark';

  constructor(private router: Router, private auth: AuthService) {
    this.currentUrl.set(this.router.url);
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => this.currentUrl.set(e.urlAfterRedirects));

    const saved = (localStorage.getItem('cantina.theme') as Theme) || 'dark';
    this.applyTheme(saved);
  }

  toggleTheme() {
    this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  private applyTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem('cantina.theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark'); // opcional
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }

  isActive(item: MenuItem): boolean | string {
    const p = item.path ?? '';
    return p && this.currentUrl().startsWith(p);
  }

  isOpenGroup(item: MenuItem): boolean {
    return (item.children ?? []).some((c) => this.isActive(c));
  }

  private buildBreadcrumbs(url: string): string[] {
    // Ex.: /admin/cadastros/pessoas -> ["Cadastros", "Pessoas"]
    const parts = url.replace('/admin/', '').split('/').filter(Boolean);

    const normalize = (s: string) =>
      s
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return parts.map(normalize);
  }
}

