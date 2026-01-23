import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// IMPORTANTE: Importar Observable e operadores do 'rxjs' (padrão moderno)
import { finalize, Observable } from 'rxjs';

import { PessoaTipo } from '../pessoas/models';
import { FieldErrors, PessoaFormData, PessoaSavePayload, PlanoTipo } from './models';
import { PessoasFormService } from './service';
import { 
  parseBRLMoneyToCents, formatCentsToBRL,
  onlyDigits, trimOrEmpty
} from './util';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PessoasFormPage {
  private readonly service = inject(PessoasFormService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Modo da tela
  readonly pessoaId = signal<string | null>(null);
  readonly isEdit = computed(() => !!this.pessoaId());

  // Estado geral
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly fieldErrors = signal<FieldErrors>({});

  // Estado do form
  readonly form = signal<PessoaFormData>(this.defaultForm());

  // UI derivada
  readonly titulo = computed(() => (this.isEdit() ? 'Editar Pessoa' : 'Cadastro de Pessoa'));
  readonly descricao = computed(() => 'Use este formulário para criar ou editar clientes.');

  readonly tipos: Array<{ label: string; value: PessoaTipo }> = [
    { label: 'Aluno', value: 'ALUNO' },
    { label: 'Professor', value: 'PROFESSOR' },
    { label: 'Outro', value: 'OUTRO' },
  ];

  readonly planos: Array<{ label: string; value: PlanoTipo }> = [
    { label: 'Convênio', value: 'CONVENIO' },
    { label: 'Pré-pago', value: 'PRE_PAGO' },
  ];

  // Input money “de tela” (string) separado do estado em cents
  readonly convenioLimiteInput = signal<string>('');

  // Habilita/oculta limite
  readonly isConvenio = computed(() => this.form().planoTipo === 'CONVENIO');

  constructor() {
    // resolve rota
    const id = this.route.snapshot.paramMap.get('id');
    this.pessoaId.set(id);

    if (id) this.load(id);

    // Effect: sincroniza input de limite com o tipo de plano
    effect(() => {
      const f = this.form();
      // Use untracked se não quiser que o effect rode quando convenioLimiteInput mudar, 
      // mas aqui a lógica parece ok pois atualiza o signal 'form' ou 'input' condicionalmente.
      if (f.planoTipo !== 'CONVENIO') {
        // Se mudou para algo que não é convênio, limpa os cents se ainda tiver valor
        if (f.convenioLimiteCents !== null) {
            this.form.update(cur => ({ ...cur, convenioLimiteCents: null }));
            this.convenioLimiteInput.set('');
        }
      } else {
        // Se voltou para convênio e o input está vazio mas tem valor no form (carregamento), formata
        const formatted = formatCentsToBRL(f.convenioLimiteCents);
        if (this.convenioLimiteInput() !== formatted) {
             this.convenioLimiteInput.set(formatted);
        }
      }
    }, { allowSignalWrites: true }); 
  }

  // ------- Carregar edição -------
  private load(id: string): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.service.getById(id)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (payload) => {
          this.form.set({
            ...this.defaultForm(),
            ...payload,
            convenioLimiteCents: payload.convenioLimiteCents ?? null,
            fotoFile: null,
            fotoPreviewUrl: null,
          });
          // O effect cuidará de atualizar o input string, ou forçamos aqui para garantir UI imediata
          this.convenioLimiteInput.set(formatCentsToBRL(payload.convenioLimiteCents ?? null));
        },
        error: (err: unknown) => {
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao carregar registro');
        }
      });
  }

  patchForm(patch: Partial<PessoaFormData>): void {
    this.form.update(cur => ({ ...cur, ...patch }));
  }

  // ------- Tratativa de arquivo -------
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

  onConvenioLimiteInput(v: string): void {
    this.convenioLimiteInput.set(v);
    const cents = parseBRLMoneyToCents(v);
    this.patchForm({ convenioLimiteCents: cents });
  }

  // ------- Submit -------
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

    const id = this.pessoaId();

    // CORREÇÃO PRINCIPAL AQUI:
    // Tipamos req$ como Observable<any> para o TypeScript aceitar a união
    // de retornos ( {id} vs void ) no subscribe.
    const req$: Observable<any> = id 
      ? this.service.update(id, payload) 
      : this.service.create(payload);

    req$
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res) => {
          // Se for criação, 'res' tem {id}. Se for update, 'res' é void/undefined.
          // Lógica: Redirecionar para a lista em ambos os casos
          this.router.navigateByUrl('/admin/cadastros/pessoas');
        },
        error: (err: unknown) => {
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao salvar');
        }
      });
  }

  // ------- Validação e Payload -------
  private validateAndBuildPayload() {
    const f = this.form();
    const errors: FieldErrors = {};

    const nome = trimOrEmpty(f.nome);
    if (!nome) errors.nome = 'Nome é obrigatório.';

    const docDigits = onlyDigits(f.documento);
    if (docDigits && docDigits.length !== 11 && docDigits.length !== 14) {
      errors.documento = 'Documento inválido (CPF 11 ou CNPJ 14).';
    }

    const email = trimOrEmpty(f.email);
    if (email && !email.includes('@')) {
      errors.email = 'E-mail inválido.';
    }

    if (f.planoTipo === 'CONVENIO') {
      if (f.convenioLimiteCents === null || f.convenioLimiteCents === undefined) {
        errors.convenioLimiteCents = 'Limite obrigatório.';
      } else if (f.convenioLimiteCents < 0) {
        errors.convenioLimiteCents = 'Não pode ser negativo.';
      }
    }

    const payload: PessoaSavePayload = {
      id: f.id,
      tipo: f.tipo,
      nome,
      documento: trimOrEmpty(f.documento),
      responsavelNome: trimOrEmpty(f.responsavelNome) || undefined,
      email: email || undefined,
      telefone: trimOrEmpty(f.telefone) || undefined,
      nascimento: f.nascimento || undefined,
      planoTipo: f.planoTipo,
      convenioLimiteCents: f.planoTipo === 'CONVENIO' ? (f.convenioLimiteCents ?? 0) : undefined,
      observacoes: trimOrEmpty(f.observacoes) || undefined,
      notificacaoEmail: !!f.notificacaoEmail,
      ativa: !!f.ativa,
    };

    return { ok: Object.keys(errors).length === 0, errors, payload };
  }

  private defaultForm(): PessoaFormData {
    return {
      tipo: 'ALUNO',
      nome: '',
      documento: '',
      responsavelNome: '',
      email: '',
      telefone: '',
      nascimento: '',
      planoTipo: 'CONVENIO',
      convenioLimiteCents: null,
      observacoes: '',
      notificacaoEmail: true,
      ativa: true,
      fotoFile: null,
      fotoPreviewUrl: null,
    };
  }
}
