import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs/operators'; // Import operators corretamente

import { Pessoa, PessoasFiltro, PessoaTipo } from './models';
import { PessoasService } from './service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './page.html',
  // CRUCIAL PARA PERFORMANCE: Diz ao Angular para só renderizar se um Signal mudar
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class PessoasPage implements OnInit {
  // Injeção de dependências moderna
  private readonly pessoasService = inject(PessoasService);
  private readonly destroyRef = inject(DestroyRef); // Substitui o ngOnDestroy manual

  // --- Estado ---
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  
  // Como o filtro é enviado ao backend, o resultado 'pessoas' já é a lista filtrada.
  // Não precisamos de um computed complexo duplicando a lógica.
  readonly pessoas = signal<Pessoa[]>([]);

  readonly filtro = signal<PessoasFiltro>({
    termo: '',
    tipo: 'TODOS',
    somenteAtivos: true,
  });

  // Constantes não precisam ser reativas se não mudam
  readonly tipos = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Aluno', value: 'ALUNO' },
    { label: 'Professor', value: 'PROFESSOR' },
    { label: 'Outro', value: 'OUTRO' },
  ] as const;

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    // Evita chamadas duplicadas se já estiver carregando
    if (this.loading()) return;

    this.loading.set(true);
    this.errorMsg.set(null);

    // O filtro atual é passado para o serviço
    this.pessoasService.list(this.filtro())
      .pipe(
        // Garante que o loading desligue em sucesso OU erro
        finalize(() => this.loading.set(false)),
        // Se o componente for destruído durante o request, cancela a chamada automaticamente
        takeUntilDestroyed(this.destroyRef) 
      )
      .subscribe({
        next: (items) => this.pessoas.set(items),
        error: (err: unknown) => {
          console.error(err);
          this.errorMsg.set(err instanceof Error ? err.message : 'Falha ao carregar pessoas');
        }
      });
  }

  // --- Ações do Usuário ---

  patchFiltro(patch: Partial<PessoasFiltro>): void {
    this.filtro.update((cur) => ({ ...cur, ...patch }));
    // Se quiser busca automática ao digitar, descomente abaixo:
    // this.buscar(); 
  }

  onToggleNotificacao(pessoaId: string, value: boolean): void {
    this.executarAcaoOtimista(
      pessoaId,
      p => ({ ...p, notificacaoAtiva: value }),
      () => this.pessoasService.toggleNotificacao(pessoaId, value)
    );
  }

  onToggleAtiva(pessoaId: string, value: boolean): void {
    this.executarAcaoOtimista(
      pessoaId,
      p => ({ ...p, ativa: value }),
      () => this.pessoasService.toggleAtiva(pessoaId, value)
    );
  }

  onExcluir(pessoaId: string): void {
    // Snapshot para rollback
    const snapshot = this.pessoas();
    
    // Atualização Otimista: remove da tela imediatamente
    this.pessoas.update(arr => arr.filter(p => p.id !== pessoaId));

    this.pessoasService.delete(pessoaId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          console.error(err);
          // Rollback em caso de erro
          this.pessoas.set(snapshot);
          this.errorMsg.set('Não foi possível excluir o item.');
        }
      });
  }

  // --- Helpers de UI ---
  
  // Helper para evitar repetição de código nas ações otimistas
  private executarAcaoOtimista(
    id: string, 
    updateFn: (p: Pessoa) => Pessoa, 
    serviceCall: () => any
  ) {
    const snapshot = this.pessoas();
    
    // Atualiza UI instantaneamente
    this.pessoas.update(arr => arr.map(p => p.id === id ? updateFn(p) : p));

    serviceCall()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err: unknown) => {
          console.error(err);
          // Reverte se der erro
          this.pessoas.set(snapshot);
          this.errorMsg.set('Falha ao sincronizar alteração.');
        }
      });
  }

  badgeClass(tipo: string): string {
    const map: Record<string, string> = {
      'PROFESSOR': 'badge badge-secondary badge-sm',
      'ALUNO': 'badge badge-info badge-sm',
      'OUTRO': 'badge badge-accent badge-sm'
    };
    return map[tipo] || 'badge badge-accent badge-sm';
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      'PROFESSOR': 'Professor',
      'ALUNO': 'Aluno',
      'OUTRO': 'Outro'
    };
    return map[tipo] || 'Outro';
  }

  trackById(_: number, item: Pessoa): string {
    return item.id;
  }
}
