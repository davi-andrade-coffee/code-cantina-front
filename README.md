# CantinaWeb

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


Segue uma proposta **organizada do menu do Admin** (dono da cantina), com **seções e funcionalidades por aba**, já alinhada ao seu documento e ao objetivo de deixar **enxuto, funcional e confiável**. Onde fizer sentido, **renomeei** itens para ficar mais claro e evitar “cadastro” virando um saco sem fundo. 

---

## 1) Visão geral do menu do Admin

### A) Operação

1. **PDV (Terminal de Vendas)**

   * Registrar venda
   * Identificar cliente (nome/biometria)
   * Selecionar forma de pagamento (saldo, convênio, dinheiro)
   * Impressão de cupom (se habilitado no terminal) 

2. **Caixa**

   * **Abertura de Caixa** (por terminal)
   * **Fechamento de Caixa** (por terminal; apuração de diferenças)
   * **Sessões de Caixa** (lista com data, terminal, operador, abertura, fechamento, status e ações) 

---

### B) Cadastros

> Aqui o princípio é: **cadastros essenciais** e com ações padronizadas (criar/editar/ativar/desativar/excluir).

1. **Pessoas (Alunos / Professores / Outros)**

   * Criar/editar/ativar/desativar/excluir
   * Campos principais: nome, email, registro único, tipo de plano (saldo/convênio)
   * Configurações: limite mensal (convênio), notificação por email, biometria
   * Envio de senha temporária no cadastro 

2. **Colaboradores (Operadores de PDV)**

   * Criar/editar/ativar/desativar/excluir
   * Campos principais: nome, email, registro único, telefone; foto opcional
   * Envio de senha temporária no cadastro 

3. **Produtos**

   * Criar/editar/ativar/desativar/excluir
   * Tipos: unitário / por peso (kg)
   * Preço unitário ou por quilo
   * Controle de estoque opcional (para produtos unitários) 

4. **Lojas**

   * Cadastro e gestão de lojas (nome, CNPJ, endereço)
   * Observação: licença ativa/inativa é controle do SuperAdmin, mas Admin pode visualizar/operar lojas que gerencia 

5. **Terminais PDV**

   * Cadastrar terminais (código, nome)
   * Configurar impressora não fiscal (opcional)
   * Opções: imprimir cupom automaticamente; ativar/desativar terminal 

---

### C) Financeiro e Relatórios

1. **Contas a Receber (Convênio)**

   * Lista de clientes convênio em aberto/não pagos
   * Ações: enviar cobrança por email; desativar cliente temporariamente 

2. **Relatório de Vendas**

   * Filtros: tipo de produto, produto, período, cliente (nome/registro) 

3. **Extrato do Cliente**

   * Histórico por pessoa: saldo, entradas, saídas, consumo mensal 

> Observação de organização: em vez de “Relatório de vendas” e “Extrato por pessoa” separados em lugares diferentes, o ideal é agrupar tudo em **Financeiro/Relatórios** com subitens.

---

### D) Auditoria e Suporte

1. **Logs do Sistema**

   * Auditoria de operações relevantes: vendas, login/logout, alterações de cadastro, abertura/fechamento de caixa
   * Finalidade: rastreabilidade e suporte 

---

### E) Configurações

1. **Configurações da Loja**

   * Dados gerais da loja atual (nome, CNPJ, endereço)
   * Preferências operacionais futuras (ex.: política de notificação padrão, parâmetros de convênio)

2. **Acesso e Segurança**

   * Troca de senha
   * Gestão de sessão (logout em todos os dispositivos, se vocês forem implementar)

---

## 2) Itens a REMOVER do menu (para manter enxuto)

Conforme o documento, **não entram nesta fase** (devem sumir do menu para não gerar débito/bug de tela incompleta): 

* **Adicionais do dia**
* **Notificações**
* **Posição de estoque**
* **Ajuste de estoque**
* **Produtos por loja**
* Cupom promocional / tipo “adicional”

E a consolidação definida:

* “Produtos por loja” vira **Produtos** com filtro por loja (quando aplicável).
* Ajustes/posição de estoque entram no fluxo de produto (quando vocês evoluírem o módulo). 

---

## 3) Sugestão de rótulos finais (menu “limpo”)

Para você literalmente copiar no front:

* **Operação**

  * PDV
  * Caixa

    * Abertura
    * Fechamento
    * Sessões

* **Cadastros**

  * Pessoas
  * Colaboradores
  * Produtos
  * Lojas
  * Terminais PDV

* **Financeiro e Relatórios**

  * Contas a Receber
  * Relatório de Vendas
  * Extrato do Cliente

* **Auditoria**

  * Logs do Sistema

* **Configurações**

  * Configurações da Loja
  * Segurança

---

Se você quiser, no próximo passo eu converto isso em **mapa de rotas do Angular** (ex.: `/admin/operacao/pdv`, `/admin/cadastros/pessoas`, etc.) e já deixo um **layout padrão** (sidebar + topbar + breadcrumbs) para você replicar em todas as features sem retrabalho.

