import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Eye, Pencil, Save } from 'lucide-react'
import { useData, useToast, useZodForm } from '@/hooks'
import { blogSchema, type BlogValues } from '@/schemas'
import { POST_STATUSES, type PostStatus } from '@/types'
import { toErrorMessage } from '@/lib/errors'
import { slugify } from '@/lib/slug'
import { cn } from '@/lib/cn'
import {
  Button,
  FormField,
  ImageInput,
  Input,
  LinkButton,
  Markdown,
  Textarea,
  TagInput,
} from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import { AdminHeader, Panel, SeoFields, ToggleRow } from '@/components/admin'

const EMPTY: BlogValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: '',
  tags: [],
  author: '',
  publishedAt: '',
  status: 'draft',
  featured: false,
  seo: { metaTitle: '', metaDescription: '', keywords: [], ogImage: '', canonicalUrl: '' },
}

const STATUS_LABEL: Record<PostStatus, string> = { draft: 'Draft', published: 'Published' }

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { blog, profile, actions } = useData()
  const editing = useMemo(() => (id ? blog.find((p) => p.id === id) ?? null : null), [id, blog])
  const isEdit = !!id

  const [view, setView] = useState<'write' | 'preview'>('write')
  const [saving, setSaving] = useState(false)

  const categories = useMemo(
    () => Array.from(new Set(blog.map((p) => p.category).filter(Boolean))).sort(),
    [blog],
  )

  const { values, setField, errors, validate } = useZodForm(
    blogSchema,
    editing
      ? {
          title: editing.title,
          slug: editing.slug,
          excerpt: editing.excerpt,
          content: editing.content,
          featuredImage: editing.featuredImage,
          category: editing.category,
          tags: editing.tags,
          author: editing.author,
          publishedAt: editing.publishedAt,
          status: editing.status,
          featured: editing.featured,
          seo: editing.seo,
        }
      : { ...EMPTY, author: profile.fullName },
  )

  if (isEdit && !editing) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted">That post could not be found.</p>
        <LinkButton to="/admin/blog" variant="outline" className="mt-4">
          Back to blog
        </LinkButton>
      </div>
    )
  }

  const setStatus = (status: PostStatus) => {
    setField('status', status)
    if (status === 'published' && !values.publishedAt) setField('publishedAt', todayISO())
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (!v) {
      setView('write')
      toast.error('Please fix the highlighted fields')
      return
    }
    setSaving(true)
    try {
      if (editing) await actions.blog.update(editing.id, v)
      else await actions.blog.create(v)
      toast.success(`Post ${editing ? 'updated' : 'created'}`)
      navigate('/admin/blog')
    } catch (err) {
      toast.error('Could not save', toErrorMessage(err))
      setSaving(false)
    }
  }

  const SaveButton = (
    <Button type="submit" loading={saving} leftIcon={<Save className="h-4 w-4" />}>
      {isEdit ? 'Save changes' : 'Create post'}
    </Button>
  )

  return (
    <form onSubmit={onSubmit} noValidate>
      <Seo title={isEdit ? 'Edit post' : 'New post'} noindex />
      <LinkButton to="/admin/blog" variant="ghost" size="sm" leftIcon={<ChevronLeft className="h-4 w-4" />} className="mb-3">
        Blog
      </LinkButton>
      <AdminHeader
        title={isEdit ? 'Edit post' : 'New post'}
        description={values.title || 'Write and publish an article.'}
        action={SaveButton}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Editor column */}
        <div className="space-y-4 lg:col-span-2">
          <FormField label="Title" required error={errors.title}>
            <Input
              value={values.title}
              onChange={(e) => setField('title', e.target.value)}
              error={!!errors.title}
              placeholder="A great, specific title"
              className="text-base"
            />
          </FormField>

          <div className="rounded-2xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="pl-1 text-xs font-medium uppercase tracking-wide text-faint">
                Content · Markdown
              </span>
              <div className="flex gap-1">
                <SegBtn active={view === 'write'} onClick={() => setView('write')} icon={<Pencil className="h-3.5 w-3.5" />} label="Write" />
                <SegBtn active={view === 'preview'} onClick={() => setView('preview')} icon={<Eye className="h-3.5 w-3.5" />} label="Preview" />
              </div>
            </div>
            {view === 'write' ? (
              <Textarea
                value={values.content ?? ''}
                onChange={(e) => setField('content', e.target.value)}
                rows={20}
                placeholder={'# Heading\n\nWrite your post in **Markdown**…'}
                className="rounded-none border-0 bg-transparent font-mono text-xs leading-relaxed focus-visible:ring-0"
              />
            ) : (
              <div className="min-h-[28rem] px-5 py-4">
                {values.content?.trim() ? (
                  <Markdown content={values.content} />
                ) : (
                  <p className="text-sm text-faint">Nothing to preview yet.</p>
                )}
              </div>
            )}
          </div>
          {errors.content && <p className="text-xs text-danger">{errors.content}</p>}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Panel title="Publish">
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Status</p>
                <div className="flex gap-2">
                  {POST_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={cn(
                        'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                        values.status === s
                          ? 'border-accent bg-accent-soft text-accent'
                          : 'border-border text-muted hover:text-foreground',
                      )}
                    >
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>
              <FormField label="Publish date" error={errors.publishedAt} hint="Set automatically when you publish.">
                <Input
                  type="date"
                  value={values.publishedAt ? values.publishedAt.slice(0, 10) : ''}
                  onChange={(e) => setField('publishedAt', e.target.value)}
                />
              </FormField>
              <ToggleRow
                label="Featured"
                hint="Highlight on the blog index."
                checked={values.featured ?? false}
                onChange={(v) => setField('featured', v)}
              />
              <div className="pt-1">{SaveButton}</div>
            </div>
          </Panel>

          <Panel title="Details">
            <div className="space-y-4">
              <FormField label="Slug" error={errors.slug} hint={`Auto: ${slugify(values.title || 'your-title')}`}>
                <Input value={values.slug ?? ''} onChange={(e) => setField('slug', e.target.value)} placeholder="Leave empty to auto-generate" />
              </FormField>
              <FormField label="Excerpt" required error={errors.excerpt} hint="A one or two sentence summary.">
                <Textarea rows={3} value={values.excerpt} onChange={(e) => setField('excerpt', e.target.value)} error={!!errors.excerpt} />
              </FormField>
              <FormField label="Category" error={errors.category}>
                <Input list="blog-categories" value={values.category ?? ''} onChange={(e) => setField('category', e.target.value)} placeholder="Engineering" />
                <datalist id="blog-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </FormField>
              <FormField label="Author" error={errors.author}>
                <Input value={values.author ?? ''} onChange={(e) => setField('author', e.target.value)} />
              </FormField>
              <TagInput label="Tags" value={values.tags ?? []} onChange={(v) => setField('tags', v)} />
              <ImageInput label="Featured image" value={values.featuredImage} onChange={(v) => setField('featuredImage', v)} />
            </div>
          </Panel>

          <Panel title="SEO" description="Overrides the site defaults for this post.">
            <SeoFields value={values.seo} onChange={(v) => setField('seo', v)} />
          </Panel>
        </div>
      </div>
    </form>
  )
}

function SegBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
        active ? 'bg-accent-soft text-accent' : 'text-muted hover:text-foreground',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
