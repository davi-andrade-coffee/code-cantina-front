import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientFacade } from '../services/client.facade';
import { CLIENT_MENU } from './client-menu.data';
import { ClientMenuItem } from './client-menu.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './client-layout.html',
})
export class ClientLayoutComponent {
  readonly menu = CLIENT_MENU;
  readonly currentUrl = signal<string>('/cliente');
  readonly userEmail = this.auth.getSnapshotUser()?.email ?? '—';

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
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }

  isActive(item: ClientMenuItem): boolean {
    return this.currentUrl().startsWith(item.path);
  }
}
