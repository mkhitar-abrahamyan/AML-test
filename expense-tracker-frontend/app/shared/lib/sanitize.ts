export function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim();
}
