import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientFacade } from '../services/client.facade';
import { CLIENT_MENU } from './client-menu.data';
import { ClientMenuItem } from './client-menu.model';

type Theme = 'dark' | 'light';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './client-layout.html',
})
export class ClientLayoutComponent {
  readonly menu = CLIENT_MENU;
  readonly currentUrl = signal<string>('/cliente');
  readonly userEmail = this.auth.getSnapshotUser()?.email ?? '—';
  theme: Theme = 'dark';

  constructor(
    private router: Router,
    private auth: AuthService,
    private facade: ClientFacade
  ) {
    this.facade.init();
    this.currentUrl.set(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.currentUrl.set((event as NavigationEnd).urlAfterRedirects));

    const saved = (localStorage.getItem('cantina.theme') as Theme) || 'dark';
    this.applyTheme(saved);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }

  isActive(item: ClientMenuItem): boolean {
    return this.currentUrl().startsWith(item.path);
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

}
