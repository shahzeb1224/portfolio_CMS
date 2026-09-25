import * as Lucide from 'lucide-react'
import type { LucideProps } from 'lucide-react'

/**
 * Render a Lucide icon by its string name (as stored on Skills, Services, etc).
 * Falls back to a neutral glyph when the name is unknown so bad data never
 * crashes the UI. Imports the full icon set — fine for this app's scale.
 */
const REGISTRY = Lucide as unknown as Record<string, React.ComponentType<LucideProps>>

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = (name && REGISTRY[name]) || Lucide.Sparkle
  return <Cmp {...props} />
}

/** True when a name resolves to a real icon (used by the admin icon picker). */
export function isIconName(name: string): boolean {
  return !!name && typeof REGISTRY[name] === 'function'
}
