export const digitsOnly = (value: string): string => value.replace(/\D/g, '');

export function formatCnpj(value: string): string {
  const digits = digitsOnly(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function formatPhone(value: string): string {
  const digits = digitsOnly(value).slice(0, 11);

  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatCurrency(value: string | number): string {
  const numeric = typeof value === 'number' ? value : parseCurrency(value);
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.max(0, numeric));
}

export function maskCurrencyInput(rawValue: string): string {
  const digits = digitsOnly(rawValue);
  if (!digits) return '';
  const asNumber = Number(digits) / 100;
  return formatCurrency(asNumber);
}

export function parseCurrency(value: string): number {
  if (!value) return 0;
  const normalized = value
    .trim()
    .replace(/\s+/g, '')
    .replace(/[R$]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function competenciaToDate(value: string): string {
  const match = value.trim().match(/^(\d{2})\/(\d{4})$/);
  if (!match) return '';
  return `${match[2]}-${match[1]}-01`;
}

export function dateToCompetencia(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-\d{2}$/);
  if (!match) return '';
  return `${match[2]}/${match[1]}`;
}
