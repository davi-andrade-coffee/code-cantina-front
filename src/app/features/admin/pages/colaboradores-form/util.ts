export function onlyDigits(v: string): string {
  return (v || '').replace(/\D/g, '');
}

export function trimOrEmpty(v: string): string {
  return (v || '').trim();
}
