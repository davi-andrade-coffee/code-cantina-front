import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

function matchPasswords(control: AbstractControl): ValidationErrors | null {
  const senha = control.get('senha')?.value as string | undefined;
  const confirmar = control.get('confirmarSenha')?.value as string | undefined;
  if (!senha || !confirmar) return null;
  return senha === confirmar ? null : { mismatch: true };
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './trocar-senha.page.html',
})
export class TrocarSenhaPage {
  loading = signal(false);
  alert = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  form = this.fb.group(
    {
      senhaTemporaria: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.pattern(strongPassword)]],
      confirmarSenha: ['', [Validators.required]],
    },
    { validators: [matchPasswords] }
  );

  constructor(private fb: FormBuilder) {}

  async onSubmit() {
    this.alert.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    this.alert.set({
      type: 'success',
      message: 'Senha atualizada com sucesso. Você já pode acessar o painel.',
    });

    this.loading.set(false);
  }
}
