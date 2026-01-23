import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, Observable } from 'rxjs';

import { ColaboradorFormData, ColaboradorSavePayload, FieldErrors } from './models';
import { ColaboradoresFormService } from './service';
import { onlyDigits, trimOrEmpty } from './util';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColaboradoresFormPage {
  private readonly service = inject(ColaboradoresFormService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly colaboradorId = signal<string | null>(null);
  readonly isEdit = computed(() => !!this.colaboradorId());

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly fieldErrors = signal<FieldErrors>({});

  readonly form = signal<ColaboradorFormData>(this.defaultForm());

  readonly titulo = computed(() => (this.isEdit() ? 'Editar Colaborador' : 'Cadastro de Colaborador'));
  readonly descricao = computed(() => 'Use este formulário para criar ou editar colaboradores.');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    this.colaboradorId.set(id);

    if (id) this.load(id);
  }

  private load(id: string): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.service
      .getById(id)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (payload) => {
          this.form.set({
            ...this.defaultForm(),
            ...payload,
            fotoFile: null,
            fotoPreviewUrl: null,
          });
        },
        error: (err: unknown) => {
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao carregar registro');
        },
      });
  }

  patchForm(patch: Partial<ColaboradorFormData>): void {
    this.form.update((cur) => ({ ...cur, ...patch }));
  }

  onFotoSelected(file: File | null): void {
    const cur = this.form();
    if (cur.fotoPreviewUrl) URL.revokeObjectURL(cur.fotoPreviewUrl);

    if (!file) {
      this.patchForm({ fotoFile: null, fotoPreviewUrl: null });
      return;
    }

    const allowed = ['image/png', 'image/jpeg'];
    if (!allowed.includes(file.type)) {
      this.errorMsg.set('Formato inválido. Utilize PNG ou JPG.');
      return;
    }

    const preview = URL.createObjectURL(file);
    this.patchForm({ fotoFile: file, fotoPreviewUrl: preview });
  }

  onExcluirImagem(): void {
    this.onFotoSelected(null);
  }

  salvar(): void {
    if (this.saving()) return;

    this.errorMsg.set(null);
    this.fieldErrors.set({});

    const { ok, errors, payload } = this.validateAndBuildPayload();
    if (!ok) {
      this.fieldErrors.set(errors);
      this.errorMsg.set('Existem inconsistências. Revise os campos.');
      return;
    }

    this.saving.set(true);

    const id = this.colaboradorId();
    const req$: Observable<any> = id ? this.service.update(id, payload) : this.service.create(payload);

    req$
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/cadastros/colaboradores');
        },
        error: (err: unknown) => {
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao salvar');
        },
      });
  }

  private validateAndBuildPayload() {
    const f = this.form();
    const errors: FieldErrors = {};

    const nome = trimOrEmpty(f.nome);
    if (!nome) errors.nome = 'Nome é obrigatório.';

    const cpfDigits = onlyDigits(f.cpf);
    if (cpfDigits.length !== 11) {
      errors.cpf = 'CPF inválido (11 dígitos).';
    }

    const email = trimOrEmpty(f.email);
    if (email && !email.includes('@')) {
      errors.email = 'E-mail inválido.';
    }

    if (f.entrada && f.nascimento && f.entrada < f.nascimento) {
      errors.entrada = 'Data de entrada não pode ser menor que nascimento.';
    }

    const payload: ColaboradorSavePayload = {
      id: f.id,
      nome,
      cpf: trimOrEmpty(f.cpf),
      email: email || undefined,
      telefone: trimOrEmpty(f.telefone) || undefined,
      nascimento: f.nascimento || undefined,
      entrada: f.entrada || undefined,
      cargo: trimOrEmpty(f.cargo) || undefined,
      matricula: trimOrEmpty(f.matricula) || undefined,
      observacoes: trimOrEmpty(f.observacoes) || undefined,
      ativa: !!f.ativa,
    };

    return { ok: Object.keys(errors).length === 0, errors, payload };
  }

  private defaultForm(): ColaboradorFormData {
    return {
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      nascimento: '',
      entrada: '',
      cargo: '',
      matricula: '',
      observacoes: '',
      ativa: true,
      fotoFile: null,
      fotoPreviewUrl: null,
    };
  }
}
