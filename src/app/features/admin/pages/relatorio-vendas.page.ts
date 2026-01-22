import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-lg font-semibold">Pessoas</h1>
        <p class="text-sm opacity-70">Alunos / Professores / Outros</p>
      </div>

      <button class="btn btn-success btn-sm">+ Novo cadastro</button>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <section class="col-span-8 bg-base-300 rounded-lg border border-base-100 p-4">
        <div class="text-sm opacity-70 mb-3">Lista</div>
        <div class="h-64 opacity-60 flex items-center justify-center">
          (Tabela de pessoas aqui)
        </div>
      </section>

      <aside class="col-span-4 bg-base-300 rounded-lg border border-base-100 p-4">
        <div class="text-sm opacity-70 mb-3">Nova Pessoa</div>
        <div class="h-64 opacity-60 flex items-center justify-center">
          (Formulário aqui)
        </div>
      </aside>
    </div>
  `,
})
export class RelatorioVendasPage {}

