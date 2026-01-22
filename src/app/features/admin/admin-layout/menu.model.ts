export type MenuItem = {
  label: string;
  path?: string;        // rota clicável
  icon?: string;        // placeholder (se quiser usar ícone depois)
  children?: MenuItem[]; // subitens
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};

