/**
 * Given a list already in its display order, return the id order after moving
 * `id` one slot in `dir` (-1 up, 1 down). Feed the result straight into an
 * ordered service's `reorder(orderedIds)`.
 */
export function reorderIds<T extends { id: string }>(items: T[], id: string, dir: -1 | 1): string[] {
  const ids = items.map((i) => i.id)
  const idx = ids.indexOf(id)
  const next = idx + dir
  if (idx < 0 || next < 0 || next >= ids.length) return ids
  ;[ids[idx], ids[next]] = [ids[next], ids[idx]]
  return ids
}
