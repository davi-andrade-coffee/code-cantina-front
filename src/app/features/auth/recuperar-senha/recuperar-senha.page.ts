import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-senha.page.html',
})
export class RecuperarSenhaPage {
  loading = signal(false);
  alert = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private fb: FormBuilder) {}

  async onSubmit() {
    this.alert.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const email = this.form.getRawValue().email ?? '';
    if (email.includes('@')) {
      this.alert.set({
        type: 'success',
        message:
          'Se o e-mail estiver cadastrado, enviamos um link de recuperação com as instruções.',
      });
    } else {
      this.alert.set({
        type: 'error',
        message: 'Não foi possível enviar. Verifique o e-mail informado.',
      });
    }

    this.loading.set(false);
  }
}
