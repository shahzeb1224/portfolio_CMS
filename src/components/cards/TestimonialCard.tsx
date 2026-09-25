import { useState } from 'react'
import { ExternalLink, ImageIcon, Quote } from 'lucide-react'
import type { Testimonial } from '@/types'
import { AppImage, Avatar, Lightbox, Rating } from '@/components/ui'
import { cn } from '@/lib/cn'

export function TestimonialCard({ item, className }: { item: Testimonial; className?: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const screenshots = (item.screenshots ?? []).filter(Boolean)
  const reviewerSubtitle = [item.position, item.company].filter(Boolean).join(', ')

  return (
    <>
      <figure
        className={cn(
          'group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <Quote className="h-7 w-7 shrink-0 text-accent/40" />
          {item.rating > 0 && <Rating value={item.rating} size={14} />}
        </div>

        {item.title && (
          <h4 className="mt-3 font-display text-base font-semibold tracking-tight text-foreground">
            {item.title}
          </h4>
        )}

        <blockquote className="mt-2.5 flex-1 text-sm leading-relaxed text-foreground/90">
          “{item.testimonial}”
        </blockquote>

        {/* Optional screenshots preview */}
        {screenshots.length > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group/img relative block w-full overflow-hidden rounded-lg border border-border bg-surface-2 transition-colors hover:border-accent"
              aria-label="View screenshot"
            >
              <AppImage
                src={screenshots[0]}
                alt={item.title ? `${item.title} preview` : 'Project screenshot'}
                loading="lazy"
                className="aspect-video w-full object-cover transition-transform duration-300 group-hover/img:scale-105"
              />
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur">
                <ImageIcon className="h-3 w-3" />
                {screenshots.length > 1 ? `${screenshots.length} images` : 'Preview'}
              </span>
            </button>
          </div>
        )}

        {/* Optional project link */}
        {item.projectUrl && (
          <div className="mt-3">
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
            >
              <span>View project</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-4">
          <Avatar src={item.clientPhoto} name={item.clientName || item.title || 'Client'} size={40} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {item.clientName || 'Verified Client'}
            </p>
            {reviewerSubtitle ? (
              <p className="truncate text-xs text-muted">{reviewerSubtitle}</p>
            ) : item.title && item.clientName !== item.title ? (
              <p className="truncate text-xs text-muted">Reviewer</p>
            ) : null}
          </div>
        </figcaption>
      </figure>

      {screenshots.length > 0 && (
        <Lightbox
          images={screenshots}
          index={0}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={() => {}}
        />
      )}
    </>
  )
}

