import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, Observable } from 'rxjs';

import { FieldErrors, ProdutoFormData, ProdutoSavePayload, ProdutoTipo } from './models';
import { ProdutosFormService } from './service';
import { formatCentsToBRL, parseBRLMoneyToCents, trimOrEmpty } from './util';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProdutosFormPage {
  private readonly service = inject(ProdutosFormService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly produtoId = signal<string | null>(null);
  readonly isEdit = computed(() => !!this.produtoId());

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly fieldErrors = signal<FieldErrors>({});

  readonly form = signal<ProdutoFormData>(this.defaultForm());

  readonly titulo = computed(() => (this.isEdit() ? 'Editar Produto' : 'Cadastro de Produto'));
  readonly descricao = computed(() => 'Preencha os dados para criar ou editar itens do cardápio.');

  readonly tipos: Array<{ label: string; value: ProdutoTipo }> = [
    { label: 'Unitário', value: 'UNITARIO' },
    { label: 'Por quilo', value: 'QUILO' },
  ];

  readonly precoInput = signal('');
  readonly isUnitario = computed(() => this.form().tipo === 'UNITARIO');
  readonly precoLabel = computed(() =>
    this.isUnitario() ? 'Preço por unitário *' : 'Preço por quilo *'
  );

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    this.produtoId.set(id);

    if (id) this.load(id);

    effect(() => {
      const f = this.form();
      if (f.tipo !== 'UNITARIO') {
        if (f.controleEstoque || f.quantidadeEstoque !== null) {
          this.form.update((cur) => ({
            ...cur,
            controleEstoque: false,
            quantidadeEstoque: null,
          }));
        }
      }

      const formatted = formatCentsToBRL(f.precoCents ?? null);
      if (this.precoInput() !== formatted) {
        this.precoInput.set(formatted);
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
            precoCents: payload.precoCents ?? null,
          });
          this.precoInput.set(formatCentsToBRL(payload.precoCents ?? null));
        },
        error: (err: unknown) => {
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao carregar registro');
        },
      });
  }

  patchForm(patch: Partial<ProdutoFormData>): void {
    this.form.update((cur) => ({ ...cur, ...patch }));
  }

  onPrecoInput(v: string): void {
    this.precoInput.set(v);
    const cents = parseBRLMoneyToCents(v);
    this.patchForm({ precoCents: cents });
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

    const id = this.produtoId();
    const req$: Observable<any> = id ? this.service.update(id, payload) : this.service.create(payload);

    req$
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/cadastros/produtos');
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

    if (f.precoCents === null || f.precoCents === undefined) {
      errors.precoCents = 'Preço é obrigatório.';
    } else if (f.precoCents <= 0) {
      errors.precoCents = 'Preço deve ser maior que zero.';
    }

    if (f.tipo === 'UNITARIO' && f.controleEstoque) {
      if (f.quantidadeEstoque === null || f.quantidadeEstoque === undefined) {
        errors.quantidadeEstoque = 'Quantidade é obrigatória.';
      } else if (f.quantidadeEstoque < 0) {
        errors.quantidadeEstoque = 'Quantidade não pode ser negativa.';
      }
    }

    const payload: ProdutoSavePayload = {
      id: f.id,
      nome,
      tipo: f.tipo,
      descricao: trimOrEmpty(f.descricao) || undefined,
      precoCents: f.precoCents ?? 0,
      controleEstoque: f.tipo === 'UNITARIO' && f.controleEstoque,
      quantidadeEstoque:
        f.tipo === 'UNITARIO' && f.controleEstoque ? f.quantidadeEstoque ?? 0 : null,
      ativo: !!f.ativo,
    };

    return { ok: Object.keys(errors).length === 0, errors, payload };
  }

  private defaultForm(): ProdutoFormData {
    return {
      nome: '',
      tipo: 'UNITARIO',
      descricao: '',
      precoCents: null,
      controleEstoque: true,
      quantidadeEstoque: 0,
      ativo: true,
    };
  }
}
