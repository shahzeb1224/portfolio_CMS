import { Icon } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { SocialLink, SocialPlatform } from '@/types'

const ICON_BY_PLATFORM: Record<SocialPlatform, string> = {
  github: 'Github',
  linkedin: 'Linkedin',
  twitter: 'Twitter',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'Youtube',
  dribbble: 'Dribbble',
  behance: 'Palette',
  website: 'Globe',
}

interface SocialLinksProps {
  links: SocialLink[]
  className?: string
  size?: number
}

export function SocialLinks({ links, className, size = 18 }: SocialLinksProps) {
  const active = links.filter((l) => l.enabled && l.url.trim())
  if (!active.length) return null

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {active.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={link.platform}
          title={link.platform}
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          <Icon name={ICON_BY_PLATFORM[link.platform] ?? 'Globe'} style={{ width: size, height: size }} />
        </a>
      ))}
    </div>
  )
}
