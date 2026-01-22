import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

type Theme = 'dark' | 'light';

@Component({
  standalone: true,
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-base-300">
      <div class="absolute top-4 right-4">
        <button class="btn btn-sm btn-ghost" (click)="toggleTheme()">
          {{ theme === 'dark' ? 'Light' : 'Dark' }}
        </button>
      </div>

      <router-outlet />
    </div>
  `,
})
export class AuthLayoutComponent {
  theme: Theme = 'dark';

  constructor() {
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
}

