import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Save } from 'lucide-react'
import { useData, useToast, useZodForm } from '@/hooks'
import { projectSchema, type ProjectValues } from '@/schemas'
import { PROJECT_CATEGORIES } from '@/types'
import { toErrorMessage } from '@/lib/errors'
import { slugify } from '@/lib/slug'
import {
  Button,
  FormField,
  GalleryImageInput,
  ImageInput,
  Input,
  LinkButton,
  Select,
  StringListInput,
  Tabs,
  TagInput,
  Textarea,
  type TabItem,
} from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import { AdminHeader, FieldGrid, MonthField, Panel, SeoFields, ToggleRow } from '@/components/admin'

const EMPTY: ProjectValues = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  thumbnail: '',
  images: [],
  technologies: [],
  category: 'Web App',
  features: [],
  challenges: [],
  solutions: [],
  results: [],
  githubUrl: '',
  liveUrl: '',
  client: '',
  completedAt: '',
  featured: false,
  published: true,
  seo: { metaTitle: '', metaDescription: '', keywords: [], ogImage: '', canonicalUrl: '' },
}

const TABS: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'media', label: 'Media' },
  { id: 'case', label: 'Case study' },
  { id: 'seo', label: 'SEO' },
]

const FIELD_TAB: Record<string, string> = {
  title: 'overview',
  slug: 'overview',
  category: 'overview',
  shortDescription: 'overview',
  client: 'overview',
  completedAt: 'overview',
  technologies: 'overview',
  githubUrl: 'overview',
  liveUrl: 'overview',
  thumbnail: 'media',
  images: 'media',
  description: 'case',
  features: 'case',
  challenges: 'case',
  solutions: 'case',
  results: 'case',
}

export default function ProjectEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { projects, actions } = useData()
  const editing = useMemo(() => (id ? projects.find((p) => p.id === id) ?? null : null), [id, projects])
  const isEdit = !!id

  const [tab, setTab] = useState('overview')
  const [saving, setSaving] = useState(false)

  const { values, setField, errors, validate } = useZodForm(
    projectSchema,
    editing
      ? {
          title: editing.title,
          slug: editing.slug,
          shortDescription: editing.shortDescription,
          description: editing.description,
          thumbnail: editing.thumbnail,
          images: editing.images,
          technologies: editing.technologies,
          category: editing.category,
          features: editing.features,
          challenges: editing.challenges,
          solutions: editing.solutions,
          results: editing.results,
          githubUrl: editing.githubUrl,
          liveUrl: editing.liveUrl,
          client: editing.client,
          completedAt: editing.completedAt,
          featured: editing.featured,
          published: editing.published,
          seo: editing.seo,
        }
      : EMPTY,
  )

  // Editing an id that no longer exists (e.g. deleted) → back to the list.
  if (isEdit && !editing) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted">That project could not be found.</p>
        <LinkButton to="/admin/projects" variant="outline" className="mt-4">
          Back to projects
        </LinkButton>
      </div>
    )
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (!v) {
      const firstError = Object.keys(errors)[0] ?? Object.keys(v ?? {})[0]
      const target = firstError && FIELD_TAB[firstError.split('.')[0]]
      if (target) setTab(target)
      toast.error('Please fix the highlighted fields')
      return
    }
    setSaving(true)
    try {
      if (editing) await actions.projects.update(editing.id, v)
      else await actions.projects.create(v)
      toast.success(`Project ${editing ? 'updated' : 'created'}`)
      navigate('/admin/projects')
    } catch (err) {
      toast.error('Could not save', toErrorMessage(err))
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Seo title={isEdit ? 'Edit project' : 'New project'} noindex />
      <LinkButton to="/admin/projects" variant="ghost" size="sm" leftIcon={<ChevronLeft className="h-4 w-4" />} className="mb-3">
        Projects
      </LinkButton>
      <AdminHeader
        title={isEdit ? 'Edit project' : 'New project'}
        description={values.title || 'Add a case study to your portfolio.'}
        action={
          <Button type="submit" loading={saving} leftIcon={<Save className="h-4 w-4" />}>
            {isEdit ? 'Save changes' : 'Create project'}
          </Button>
        }
      />

      <div className="mb-6">
        <Tabs items={TABS} value={tab} onChange={setTab} layoutId="project-editor-tabs" />
      </div>

      {tab === 'overview' && (
        <Panel title="Overview">
          <div className="space-y-4">
            <FieldGrid>
              <FormField label="Title" required error={errors.title}>
                <Input value={values.title} onChange={(e) => setField('title', e.target.value)} error={!!errors.title} />
              </FormField>
              <FormField label="Slug" error={errors.slug} hint={`Auto: ${slugify(values.title || 'your-title')}`}>
                <Input value={values.slug ?? ''} onChange={(e) => setField('slug', e.target.value)} placeholder="Leave empty to auto-generate" />
              </FormField>
            </FieldGrid>
            <FieldGrid>
              <FormField label="Category" required error={errors.category}>
                <Select value={values.category} onChange={(e) => setField('category', e.target.value)}>
                  {PROJECT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Client" error={errors.client}>
                <Input value={values.client ?? ''} onChange={(e) => setField('client', e.target.value)} />
              </FormField>
            </FieldGrid>
            <FormField label="Short description" required error={errors.shortDescription} hint="Shown on project cards.">
              <Textarea rows={2} value={values.shortDescription} onChange={(e) => setField('shortDescription', e.target.value)} error={!!errors.shortDescription} />
            </FormField>
            <TagInput label="Technologies" value={values.technologies ?? []} onChange={(v) => setField('technologies', v)} />
            <FieldGrid>
              <MonthField label="Completed" value={values.completedAt ?? ''} onChange={(v) => setField('completedAt', v)} error={errors.completedAt} />
              <FormField label="Live URL" error={errors.liveUrl}>
                <Input value={values.liveUrl} onChange={(e) => setField('liveUrl', e.target.value)} placeholder="https://…" error={!!errors.liveUrl} />
              </FormField>
            </FieldGrid>
            <FormField label="GitHub URL" error={errors.githubUrl}>
              <Input value={values.githubUrl} onChange={(e) => setField('githubUrl', e.target.value)} placeholder="https://github.com/…" error={!!errors.githubUrl} />
            </FormField>
            <FieldGrid>
              <ToggleRow label="Featured" hint="Highlight on the homepage." checked={values.featured ?? false} onChange={(v) => setField('featured', v)} />
              <ToggleRow label="Published" hint="Visible on the public site." checked={values.published ?? true} onChange={(v) => setField('published', v)} />
            </FieldGrid>
          </div>
        </Panel>
      )}

      {tab === 'media' && (
        <Panel title="Media">
          <div className="space-y-4">
            <ImageInput label="Thumbnail" value={values.thumbnail} onChange={(v) => setField('thumbnail', v)} hint="Used on cards and as the hero image." />
            <GalleryImageInput label="Gallery images" value={values.images ?? []} onChange={(v) => setField('images', v)} />
          </div>
        </Panel>
      )}

      {tab === 'case' && (
        <Panel title="Case study">
          <div className="space-y-4">
            <FormField label="Description" error={errors.description} hint="Markdown supported — the full write-up.">
              <Textarea rows={8} value={values.description ?? ''} onChange={(e) => setField('description', e.target.value)} className="font-mono text-xs" />
            </FormField>
            <StringListInput label="Key features" value={values.features ?? []} onChange={(v) => setField('features', v)} placeholder="Add a feature…" addLabel="Add feature" />
            <StringListInput label="Challenges" value={values.challenges ?? []} onChange={(v) => setField('challenges', v)} placeholder="Add a challenge…" addLabel="Add challenge" />
            <StringListInput label="Solutions" value={values.solutions ?? []} onChange={(v) => setField('solutions', v)} placeholder="Add a solution…" addLabel="Add solution" />
            <StringListInput label="Results" value={values.results ?? []} onChange={(v) => setField('results', v)} placeholder="Add a result…" addLabel="Add result" />
          </div>
        </Panel>
      )}

      {tab === 'seo' && (
        <Panel title="SEO" description="Overrides the site defaults for this project.">
          <SeoFields value={values.seo} onChange={(v) => setField('seo', v)} />
        </Panel>
      )}

      <div className="mt-6 flex justify-end">
        <Button type="submit" loading={saving} leftIcon={<Save className="h-4 w-4" />}>
          {isEdit ? 'Save changes' : 'Create project'}
        </Button>
      </div>
    </form>
  )
}
