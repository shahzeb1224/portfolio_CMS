import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImageIcon, Newspaper, Plus, Star } from 'lucide-react'
import { useData } from '@/hooks'
import type { BlogPost } from '@/types'
import { formatMonthYear } from '@/lib/format'
import { AppImage, Badge, ConfirmDialog, EmptyState, LinkButton } from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import {
  AdminHeader,
  FilterTabs,
  ListRow,
  ListShell,
  RowActions,
  StatusBadge,
  Toolbar,
  useCrudList,
} from '@/components/admin'

type BlogFilter = 'all' | 'published' | 'draft' | 'featured'

const FILTERS: readonly { value: BlogFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'featured', label: 'Featured' },
]

export default function AdminBlog() {
  const { blog, actions } = useData()
  const navigate = useNavigate()
  const list = useCrudList<BlogPost, BlogFilter>(actions.blog, { label: 'Post', initialFilter: 'all' })

  const filtered = useMemo(() => {
    const q = list.query.trim().toLowerCase()
    return [...blog]
      .sort((a, b) => (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt))
      .filter((p) => {
        if (list.filter === 'published' && p.status !== 'published') return false
        if (list.filter === 'draft' && p.status !== 'draft') return false
        if (list.filter === 'featured' && !p.featured) return false
        if (!q) return true
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        )
      })
  }, [blog, list.query, list.filter])

  const publishedCount = blog.filter((p) => p.status === 'published').length

  return (
    <>
      <Seo title="Blog" noindex />
      <AdminHeader
        title="Blog"
        description={`${blog.length} total · ${publishedCount} published`}
        action={
          <LinkButton to="/admin/blog/new" leftIcon={<Plus className="h-4 w-4" />}>
            New post
          </LinkButton>
        }
      />

      <Toolbar
        search={list.query}
        onSearch={list.setQuery}
        placeholder="Search posts…"
        right={<FilterTabs options={FILTERS} value={list.filter} onChange={list.setFilter} />}
      />

      {filtered.length > 0 ? (
        <ListShell>
          {filtered.map((p) => (
            <ListRow key={p.id}>
              <button
                onClick={() => navigate(`/admin/blog/${p.id}/edit`)}
                className="flex min-w-0 flex-1 items-center gap-3.5 text-left"
              >
                <Thumb src={p.featuredImage} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
                    {p.title}
                    {p.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {p.category || 'Uncategorized'} · {p.readingTime} min read
                    {p.publishedAt && ` · ${formatMonthYear(p.publishedAt)}`}
                  </p>
                </div>
              </button>
              {p.tags.length > 0 && (
                <Badge variant="muted" className="hidden sm:inline-flex">
                  {p.tags.length} {p.tags.length === 1 ? 'tag' : 'tags'}
                </Badge>
              )}
              <StatusBadge published={p.status === 'published'} />
              <RowActions
                onEdit={() => navigate(`/admin/blog/${p.id}/edit`)}
                onDuplicate={() => list.duplicate(p.id)}
                onDelete={() => list.askDelete(p)}
              />
            </ListRow>
          ))}
        </ListShell>
      ) : (
        <EmptyState
          icon={<Newspaper className="h-5 w-5" />}
          title={list.query || list.filter !== 'all' ? 'No matching posts' : 'No posts yet'}
          description={
            list.query || list.filter !== 'all'
              ? 'Try a different search or filter.'
              : 'Write your first article to share what you’re learning.'
          }
          action={
            !list.query && list.filter === 'all' ? (
              <LinkButton to="/admin/blog/new" leftIcon={<Plus className="h-4 w-4" />}>
                New post
              </LinkButton>
            ) : undefined
          }
        />
      )}

      <ConfirmDialog
        open={!!list.pendingDelete}
        onClose={list.cancelDelete}
        onConfirm={list.confirmDelete}
        loading={list.deleteBusy}
        title="Delete this post?"
        description={list.pendingDelete ? `“${list.pendingDelete.title}” will be permanently removed.` : undefined}
        confirmLabel="Delete"
      />
    </>
  )
}

function Thumb({ src }: { src?: string }) {
  return (
    <div className="relative hidden h-11 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-surface-2 sm:block">
      <AppImage
        src={src}
        alt=""
        className="h-full w-full object-cover"
        fallback={
          <div className="grid h-full w-full place-items-center text-faint">
            <ImageIcon className="h-4 w-4" />
          </div>
        }
      />
    </div>
  )
}
