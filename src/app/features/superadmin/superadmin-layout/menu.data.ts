import { MenuSection } from './menu.model';

export const SUPERADMIN_MENU: MenuSection[] = [
  {
    title: 'Cadastros',
    items: [
      { label: 'Admins', path: '/superadmin/admins' },
    ],
  },
  {
    title: 'Relatórios & Financeiro',
    items: [
      { label: 'Lojas', path: '/superadmin/stores' },
      { label: 'Faturas / Cobranças', path: '/superadmin/billing/invoices' },
      { label: 'Recebimentos & Indicadores', path: '/superadmin/billing/overview' },
    ],
  },
  {
    title: 'Auditoria',
    items: [
      { label: 'Logs do Sistema', path: '/superadmin/logs' },
    ],
  },
];
