export function slugify(input: string): string {
  return input
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Produce a slug that does not collide with any in `existing`.
 * Appends -2, -3, ... when needed.
 */
export function uniqueSlug(base: string, existing: string[]): string {
  const root = slugify(base) || 'item'
  const taken = new Set(existing)
  if (!taken.has(root)) return root
  let n = 2
  while (taken.has(`${root}-${n}`)) n += 1
  return `${root}-${n}`
}
