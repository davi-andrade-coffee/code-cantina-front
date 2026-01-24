import { MenuSection } from './menu.model';

export const ADMIN_MENU: MenuSection[] = [
  {
    title: 'Operação',
    items: [
      { label: 'PDV', path: '/admin/operacao/pdv' },
      {
        label: 'Caixa',
        children: [
          { label: 'Abertura', path: '/admin/operacao/caixa/abertura' },
          { label: 'Fechamento', path: '/admin/operacao/caixa/fechamento' },
          { label: 'Sessões', path: '/admin/operacao/caixa/sessoes' },
        ],
      },
    ],
  },
  {
    title: 'Cadastros',
    items: [
      { label: 'Pessoas', path: '/admin/cadastros/pessoas' },
      { label: 'Colaboradores', path: '/admin/cadastros/colaboradores' },
      { label: 'Produtos', path: '/admin/cadastros/produtos' },
      // { label: 'Lojas', path: '/admin/cadastros/lojas' },
      { label: 'Terminais PDV', path: '/admin/cadastros/terminais' },
    ],
  },
  {
    title: 'Financeiro e Relatórios',
    items: [
      { label: 'Contas a Receber', path: '/admin/financeiro/contas-a-receber' },
      { label: 'Relatório de Vendas', path: '/admin/relatorios/vendas' },
      { label: 'Extrato do Cliente', path: '/admin/relatorios/extrato-cliente' },
    ],
  },
  {
    title: 'Auditoria',
    items: [{ label: 'Logs do Sistema', path: '/admin/auditoria/logs' }],
  },
  {
    title: 'Configurações',
    items: [
      { label: 'Configurações da Loja', path: '/admin/configuracoes/loja' },
      { label: 'Licença', path: '/admin/configuracoes/licenca' },
    ],
  },
];
