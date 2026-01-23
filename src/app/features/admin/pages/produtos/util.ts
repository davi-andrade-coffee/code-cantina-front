export function formatCentsToBRL(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'R$ 0,00';
  const cents = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(cents / 100);
}
