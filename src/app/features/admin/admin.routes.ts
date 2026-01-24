import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
        { path: '', pathMatch: 'full', redirectTo: 'cadastros/pessoas' },
        // Operação
        { path: 'operacao/pdv', loadComponent: () => import('./pages/pdv.page').then(m => m.PdvPage) },
        { path: 'operacao/caixa/abertura', loadComponent: () => import('./pages/caixa-abertura.page').then(m => m.CaixaAberturaPage) },
        { path: 'operacao/caixa/fechamento', loadComponent: () => import('./pages/caixa-fechamento.page').then(m => m.CaixaFechamentoPage) },
        { path: 'operacao/caixa/sessoes', loadComponent: () => import('./pages/caixa-sessoes.page').then(m => m.CaixaSessoesPage) },

        // Cadastros Pessoas
        { path: 'cadastros/pessoas', loadComponent: () => import('./pages/pessoas/component').then(m => m.PessoasPage) },
        { path: 'cadastros/pessoas/novo', loadComponent: () => import('./pages/pessoas-form/component').then(m => m.PessoasFormPage) },
        { path: 'cadastros/pessoas/:id/editar', loadComponent: () => import('./pages/pessoas-form/component').then(m => m.PessoasFormPage) },

        // Cadastros
        { path: 'cadastros/colaboradores', loadComponent: () => import('./pages/colaboradores/component').then(m => m.ColaboradoresPage) },
        { path: 'cadastros/colaboradores/novo', loadComponent: () => import('./pages/colaboradores-form/component').then(m => m.ColaboradoresFormPage) },
        { path: 'cadastros/colaboradores/:id/editar', loadComponent: () => import('./pages/colaboradores-form/component').then(m => m.ColaboradoresFormPage) },
        { path: 'cadastros/produtos', loadComponent: () => import('./pages/produtos/component').then(m => m.ProdutosPage) },
        { path: 'cadastros/produtos/novo', loadComponent: () => import('./pages/produtos-form/component').then(m => m.ProdutosFormPage) },
        { path: 'cadastros/produtos/:id/editar', loadComponent: () => import('./pages/produtos-form/component').then(m => m.ProdutosFormPage) },
        { path: 'cadastros/terminais', loadComponent: () => import('./pages/terminais/component').then(m => m.TerminaisPage) },
        { path: 'cadastros/terminais/novo', loadComponent: () => import('./pages/terminais-form/component').then(m => m.TerminaisFormPage) },
        { path: 'cadastros/terminais/:id/editar', loadComponent: () => import('./pages/terminais-form/component').then(m => m.TerminaisFormPage) },

        // Financeiro e Relatórios
        { path: 'financeiro/contas-a-receber', loadComponent: () => import('./pages/contas-receber/component').then(m => m.ContasReceberPage) },
        { path: 'relatorios/vendas', loadComponent: () => import('./pages/relatorio-vendas/component').then(m => m.RelatorioVendasPage) },
        { path: 'relatorios/extrato-cliente', loadComponent: () => import('./pages/extrato-cliente/component').then(m => m.ExtratoClientePage) },

        // Auditoria
        { path: 'auditoria/logs', loadComponent: () => import('./pages/logs/component').then(m => m.LogsSistemaPage) },

        // Configurações
        { path: 'configuracoes/loja', loadComponent: () => import('./pages/config-loja.page').then(m => m.ConfigLojaPage) },
        { path: 'configuracoes/seguranca', loadComponent: () => import('./pages/seguranca.page').then(m => m.SegurancaPage) },
    ],
  },
];
