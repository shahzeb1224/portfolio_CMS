import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import type { BlogPost } from '@/types'
import { formatLongDate } from '@/lib/format'
import { AppImage } from '@/components/ui'
import { cn } from '@/lib/cn'

export function BlogCard({ post, className }: { post: BlogPost; className?: string }) {
  const date = post.publishedAt || post.createdAt
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-border-strong hover:shadow-card-hover',
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
        <AppImage
          src={post.featuredImage}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          fallback={<div className="grid h-full w-full place-items-center text-faint">No image</div>}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs font-medium text-faint">
          {post.category && <span className="text-accent">{post.category}</span>}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime} min read
          </span>
        </div>
        <h3 className="mt-2.5 line-clamp-2 font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <p className="mt-4 text-xs text-faint">{formatLongDate(date)}</p>
      </div>
    </Link>
  )
}
