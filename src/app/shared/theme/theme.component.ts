import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type Theme = 'dark' | 'light';

@Component({
  selector: "button-theme",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn btn-sm btn-ghost" (click)="toggleTheme()">
      {{ theme === 'dark' ? 'Light' : 'Dark' }}
    </button>
  `,
})
export class ThemeButtonComponent {
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

