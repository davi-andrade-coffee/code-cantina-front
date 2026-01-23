import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-lg font-semibold">Colaboradores</h1>
        <p class="text-sm opacity-70">Cadastro interno de colaboradores da empresa</p>
      </div>

      <button class="btn btn-success btn-sm">+ Novo colaborador</button>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <section class="col-span-12 xl:col-span-8 bg-base-300 rounded-lg border border-base-100 p-4">
        <div class="flex flex-wrap items-end gap-3 mb-4">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text text-xs opacity-70">Buscar</span>
            </div>
            <input class="input input-bordered input-sm" placeholder="Nome, CPF ou e-mail" />
          </label>

          <label class="form-control w-full max-w-[180px]">
            <div class="label">
              <span class="label-text text-xs opacity-70">Status</span>
            </div>
            <select class="select select-bordered select-sm">
              <option>Todos</option>
              <option>Ativos</option>
              <option>Inativos</option>
            </select>
          </label>

          <button class="btn btn-primary btn-sm mt-6">Buscar</button>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-zebra table-sm">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Contato</th>
                <th>Nascimento</th>
                <th>Entrada</th>
                <th class="text-center">Ativo</th>
                <th class="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="avatar placeholder">
                    <div class="bg-base-100 text-base-content rounded-full w-8 h-8">
                      <span>MT</span>
                    </div>
                  </div>
                </td>
                <td>Mateus Torres</td>
                <td>024.889.550-11</td>
                <td class="text-xs opacity-70">
                  mateus.torres@email.com
                  <div>(11) 99999-0001</div>
                </td>
                <td>14/09/1994</td>
                <td>02/01/2023</td>
                <td class="text-center">
                  <input type="checkbox" class="toggle toggle-xs" checked />
                </td>
                <td class="text-right space-x-2">
                  <button class="btn btn-ghost btn-xs">Editar</button>
                  <button class="btn btn-ghost btn-xs text-error">Excluir</button>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="avatar placeholder">
                    <div class="bg-base-100 text-base-content rounded-full w-8 h-8">
                      <span>LA</span>
                    </div>
                  </div>
                </td>
                <td>Larissa Almeida</td>
                <td>437.912.880-30</td>
                <td class="text-xs opacity-70">
                  larissa.almeida@email.com
                  <div>(11) 98888-2222</div>
                </td>
                <td>03/06/1989</td>
                <td>18/05/2021</td>
                <td class="text-center">
                  <input type="checkbox" class="toggle toggle-xs" />
                </td>
                <td class="text-right space-x-2">
                  <button class="btn btn-ghost btn-xs">Editar</button>
                  <button class="btn btn-ghost btn-xs text-error">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside class="col-span-12 xl:col-span-4 bg-base-300 rounded-lg border border-base-100 p-4">
        <div class="text-sm opacity-70 mb-4">Adicionar colaborador</div>

        <div class="grid grid-cols-1 gap-3">
          <label class="form-control">
            <div class="label">
              <span class="label-text">Nome completo *</span>
            </div>
            <input class="input input-bordered input-sm" placeholder="Nome e sobrenome" />
          </label>

          <label class="form-control">
            <div class="label">
              <span class="label-text">CPF *</span>
            </div>
            <input class="input input-bordered input-sm" placeholder="000.000.000-00" />
          </label>

          <label class="form-control">
            <div class="label">
              <span class="label-text">E-mail</span>
            </div>
            <input class="input input-bordered input-sm" placeholder="email@empresa.com" />
          </label>

          <label class="form-control">
            <div class="label">
              <span class="label-text">Telefone</span>
            </div>
            <input class="input input-bordered input-sm" placeholder="(00) 00000-0000" />
          </label>

          <label class="form-control">
            <div class="label">
              <span class="label-text">Data de nascimento</span>
            </div>
            <input type="date" class="input input-bordered input-sm" />
          </label>

          <label class="form-control">
            <div class="label">
              <span class="label-text">Data de entrada</span>
            </div>
            <input type="date" class="input input-bordered input-sm" />
          </label>

          <label class="form-control">
            <div class="label">
              <span class="label-text">Cargo</span>
            </div>
            <input class="input input-bordered input-sm" placeholder="Ex: Atendimento" />
          </label>

          <label class="form-control">
            <div class="label">
              <span class="label-text">Matrícula</span>
            </div>
            <input class="input input-bordered input-sm" placeholder="Número de registro" />
          </label>

          <div>
            <div class="label">
              <span class="label-text">Foto do colaborador</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="avatar placeholder">
                <div class="bg-base-100 text-base-content rounded-full w-10 h-10">
                  <span>Foto</span>
                </div>
              </div>
              <input type="file" class="file-input file-input-bordered file-input-sm" />
            </div>
          </div>

          <label class="label cursor-pointer justify-start gap-2">
            <input type="checkbox" class="toggle toggle-success toggle-sm" checked />
            <span class="label-text text-xs opacity-70">Colaborador ativo</span>
          </label>

          <button class="btn btn-success btn-sm">Salvar colaborador</button>
        </div>
      </aside>
    </div>
  `,
})
export class ColaboradoresPage {}
