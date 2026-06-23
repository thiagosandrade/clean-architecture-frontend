export function formatDateTime(value: unknown): string {

  if (typeof value !== 'string' || !value) {
    return '';
  }

  return new Date(value).toLocaleString();
}