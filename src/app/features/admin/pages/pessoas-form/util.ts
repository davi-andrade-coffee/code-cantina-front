export function parseBRLMoneyToCents(input: string): number | null {
  // Aceita "R$ 1.234,56" | "1234,56" | "1234.56" | "0" | ""
  const raw = (input || '').trim();
  if (!raw) return null;

  const cleaned = raw
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;

  return Math.round(n * 100);
}

export function formatCentsToBRL(cents: number | null): string {
  if (cents === null || cents === undefined) return '';
  const n = cents / 100;
  // sem Intl para não depender de locale; se preferir, pode usar Intl.NumberFormat
  return n.toFixed(2).replace('.', ',');
}

export function onlyDigits(v: string): string {
  return (v || '').replace(/\D/g, '');
}

export function trimOrEmpty(v: string): string {
  return (v || '').trim();
}

