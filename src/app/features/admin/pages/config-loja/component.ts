import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { ConfigLojaService } from './service';
import { LojaConfiguracao, LojaComplementar, LojaEndereco } from './models';

type ComplementarPatch = Omit<Partial<LojaComplementar>, 'endereco'> & {
  endereco?: Partial<LojaEndereco>;
};

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigLojaPage {
  private readonly service = inject(ConfigLojaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly salvando = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly sucessoMsg = signal<string | null>(null);

  readonly configuracao = signal<LojaConfiguracao | null>(null);
  readonly complementar = signal<LojaComplementar | null>(null);

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.service
      .obterConfiguracao()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (config) => {
          this.configuracao.set(config);
          this.complementar.set({
            ...config.complementar,
            endereco: { ...config.complementar.endereco },
          });
        },
        error: () => this.errorMsg.set('Não foi possível carregar os dados da loja.'),
      });
  }

  patchComplementar(patch: ComplementarPatch): void {
    const atual = this.complementar();
    if (!atual) return;
    this.complementar.set({
      ...atual,
      ...patch,
      endereco: { ...atual.endereco, ...patch.endereco },
    });
  }

  salvar(): void {
    const dados = this.complementar();
    if (!dados) return;

    this.salvando.set(true);
    this.sucessoMsg.set(null);
    this.errorMsg.set(null);

    this.service
      .atualizarComplementar(dados)
      .pipe(
        finalize(() => this.salvando.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (config) => {
          this.configuracao.set(config);
          this.sucessoMsg.set('Dados atualizados com sucesso.');
        },
        error: () => this.errorMsg.set('Não foi possível salvar os dados.'),
      });
  }
}
