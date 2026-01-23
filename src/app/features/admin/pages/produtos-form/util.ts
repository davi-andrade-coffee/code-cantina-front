export function parseBRLMoneyToCents(input: string): number | null {
  if (!input) return null;
  const digits = input.replace(/[^\d]/g, '');
  if (!digits) return null;
  return Number(digits);
}

export function formatCentsToBRL(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const cents = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function trimOrEmpty(v: string): string {
  return (v || '').trim();
}
