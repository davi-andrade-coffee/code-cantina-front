import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, Observable } from 'rxjs';

import { FieldErrors, TerminalFormData, TerminalSavePayload } from './models';
import { TerminaisFormService } from './service';
import { trimOrEmpty } from './util';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminaisFormPage {
  private readonly service = inject(TerminaisFormService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly terminalId = signal<string | null>(null);
  readonly isEdit = computed(() => !!this.terminalId());

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly fieldErrors = signal<FieldErrors>({});

  readonly form = signal<TerminalFormData>(this.defaultForm());

  readonly titulo = computed(() => (this.isEdit() ? 'Editar Terminal PDV' : 'Cadastro de Terminal PDV'));
  readonly descricao = computed(() => 'Configure o caixa, dispositivos e preferências de impressão.');
  readonly previewDisponivel = computed(() => this.form().imprimeCupom);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    this.terminalId.set(id);

    if (id) this.load(id);

    effect(() => {
      const f = this.form();
      if (!f.imprimeCupom && f.previewCupom) {
        this.form.update((cur) => ({ ...cur, previewCupom: false }));
      }
    }, { allowSignalWrites: true });
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
          });
        },
        error: (err: unknown) => {
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao carregar registro');
        },
      });
  }

  patchForm(patch: Partial<TerminalFormData>): void {
    this.form.update((cur) => ({ ...cur, ...patch }));
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

    const id = this.terminalId();
    const req$: Observable<any> = id ? this.service.update(id, payload) : this.service.create(payload);

    req$
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/cadastros/terminais');
        },
        error: (err: unknown) => {
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao salvar');
        },
      });
  }

  private validateAndBuildPayload() {
    const f = this.form();
    const errors: FieldErrors = {};

    const codigo = trimOrEmpty(f.codigo);
    if (!codigo) errors.codigo = 'Código é obrigatório.';

    const nome = trimOrEmpty(f.nome);
    if (!nome) errors.nome = 'Nome é obrigatório.';

    const payload: TerminalSavePayload = {
      id: f.id,
      codigo,
      nome,
      portaBalanca: trimOrEmpty(f.portaBalanca) || undefined,
      impressoraFiscal: trimOrEmpty(f.impressoraFiscal) || undefined,
      imprimeCupom: !!f.imprimeCupom,
      previewCupom: f.imprimeCupom ? !!f.previewCupom : false,
      modoOffline: !!f.modoOffline,
      ativo: !!f.ativo,
    };

    return { ok: Object.keys(errors).length === 0, errors, payload };
  }

  private defaultForm(): TerminalFormData {
    return {
      codigo: '',
      nome: '',
      portaBalanca: '',
      impressoraFiscal: '',
      imprimeCupom: true,
      previewCupom: true,
      modoOffline: false,
      ativo: true,
    };
  }
}
