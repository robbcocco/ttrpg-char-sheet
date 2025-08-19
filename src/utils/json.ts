
export function normalizeEntriesToText<T>(
  entries: T
): string {
  if (!entries) return '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toLines = (e: any): string[] => {
    if (typeof e === 'string') return [e];
    if (Array.isArray(e)) return e.flatMap(toLines);
    if (typeof e === 'object' && e?.items && Array.isArray(e.items)) return e.items.map(String);
    return [];
  };
  return toLines(entries).join('\n');
}