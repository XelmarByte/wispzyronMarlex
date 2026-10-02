export function getSafeRedirect(
  value: string | undefined,
  fallback = '/organizations',
): string {
  if (!value?.startsWith('/') || value.startsWith('//')) {
    return fallback
  }

  return value
}
