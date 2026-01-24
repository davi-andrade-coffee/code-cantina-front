import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/auth/roles';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
})
export class LoginPage {
  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    this.error.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);

    try {
      const { email, password } = this.form.getRawValue();
      const user = await this.auth.login({ email: email!, password: password! });

      if (password == '123456') {
        this.router.navigateByUrl('/auth/trocar-senha')
      } else {
        this.redirectByRole(user.role);
      }
    } catch (e: any) {
      this.error.set(e?.message || 'Falha no login.');
    } finally {
      this.loading.set(false);
    }
  }

  private redirectByRole(role: Role) {
    switch (role) {
      case 'SUPERADMIN': this.router.navigateByUrl('/superadmin'); break;
      case 'ADMIN': this.router.navigateByUrl('/admin/selecionar-cliente'); break;
      case 'COLABORADOR': this.router.navigateByUrl('/colaborador'); break;
      default: this.router.navigateByUrl('/cliente'); break;
    }
  }
}
