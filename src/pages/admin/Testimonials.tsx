import type { FormEvent } from 'react'
import { Quote } from 'lucide-react'
import { useData, useZodForm } from '@/hooks'
import { testimonialSchema, type TestimonialValues } from '@/schemas'
import type { Testimonial } from '@/types'
import {
  Avatar,
  Badge,
  FormField,
  ImageInput,
  Input,
  Rating,
  Select,
  Textarea,
} from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import {
  EditorActions,
  FieldGrid,
  OrderedManager,
  StatusBadge,
  ToggleRow,
  useSave,
} from '@/components/admin'
import { REVIEW_STATUSES, type ReviewStatus } from '@/types'

const EMPTY: TestimonialValues = {
  clientName: '',
  clientPhoto: '',
  position: '',
  company: '',
  testimonial: '',
  rating: 5,
  projectId: null,
  featured: false,
  published: true,
  title: '',
  status: 'approved',
  projectUrl: '',
  screenshots: [],
}

function TestimonialEditor({ editing, onDone }: { editing: Testimonial | null; onDone: () => void }) {
  const { actions, projects } = useData()
  const { values, setField, errors, validate } = useZodForm(
    testimonialSchema,
    editing
      ? {
          clientName: editing.clientName,
          clientPhoto: editing.clientPhoto,
          position: editing.position,
          company: editing.company,
          testimonial: editing.testimonial,
          rating: editing.rating,
          projectId: editing.projectId,
          featured: editing.featured,
          published: editing.published,
          title: editing.title ?? '',
          status: editing.status ?? 'approved',
          projectUrl: editing.projectUrl ?? '',
          screenshots: editing.screenshots ?? [],
        }
      : EMPTY,
  )
  const { saving, run } = useSave('Testimonial')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (!v) return
    run(!!editing, () => (editing ? actions.testimonials.update(editing.id, v) : actions.testimonials.create(v)), onDone)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldGrid>
        <FormField label="Client name" required error={errors.clientName}>
          <Input value={values.clientName} onChange={(e) => setField('clientName', e.target.value)} error={!!errors.clientName} />
        </FormField>
        <FormField label="Review title" error={errors.title} hint="Optional headline.">
          <Input value={values.title ?? ''} onChange={(e) => setField('title', e.target.value)} placeholder="e.g. Exceptional engineering" />
        </FormField>
      </FieldGrid>
      <FieldGrid>
        <FormField label="Position" error={errors.position}>
          <Input value={values.position ?? ''} onChange={(e) => setField('position', e.target.value)} placeholder="CTO" />
        </FormField>
        <FormField label="Company" error={errors.company}>
          <Input value={values.company ?? ''} onChange={(e) => setField('company', e.target.value)} placeholder="Acme Inc." />
        </FormField>
      </FieldGrid>
      <FieldGrid>
        <FormField label="Related project" error={errors.projectId} hint="Optional.">
          <Select value={values.projectId ?? ''} onChange={(e) => setField('projectId', e.target.value || null)}>
            <option value="">None</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Moderation status" error={errors.status}>
          <Select value={values.status ?? 'approved'} onChange={(e) => setField('status', e.target.value as ReviewStatus)}>
            {REVIEW_STATUSES.map((s: ReviewStatus) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </FormField>
      </FieldGrid>
      <FormField label="Project / reference URL" error={errors.projectUrl} hint="Optional link to live project or reference.">
        <Input value={values.projectUrl ?? ''} onChange={(e) => setField('projectUrl', e.target.value)} placeholder="https://example.com" />
      </FormField>
      <ImageInput label="Client photo" aspect="square" value={values.clientPhoto} onChange={(v) => setField('clientPhoto', v)} />
      <FormField label="Testimonial" required error={errors.testimonial}>
        <Textarea rows={4} value={values.testimonial} onChange={(e) => setField('testimonial', e.target.value)} error={!!errors.testimonial} />
      </FormField>
      <FormField label="Rating" required error={errors.rating}>
        <Rating value={values.rating} size={22} onChange={(v) => setField('rating', v)} />
      </FormField>
      <FieldGrid>
        <ToggleRow label="Featured" hint="Show on the homepage." checked={values.featured ?? false} onChange={(v) => setField('featured', v)} />
        <ToggleRow label="Published" hint="Visible on the public site." checked={values.published ?? true} onChange={(v) => setField('published', v)} />
      </FieldGrid>
      <EditorActions onCancel={onDone} saving={saving} submitLabel={editing ? 'Save changes' : 'Add testimonial'} />
    </form>
  )
}

function TestimonialRow({ item }: { item: Testimonial }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={item.clientPhoto} name={item.clientName} size={40} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{item.clientName}</p>
        <p className="truncate text-xs text-muted">
          {[item.position, item.company].filter(Boolean).join(', ') || 'Client'}
        </p>
      </div>
      <Rating value={item.rating} size={14} className="hidden sm:flex" />
      {item.status && item.status !== 'approved' && (
        <Badge variant={item.status === 'pending' ? 'accent' : 'muted'} className="capitalize">
          {item.status}
        </Badge>
      )}
      <StatusBadge published={item.published} />
    </div>
  )
}

export default function AdminTestimonials() {
  const { testimonials, actions } = useData()
  return (
    <>
      <Seo title="Testimonials" noindex />
      <OrderedManager<Testimonial>
        title="Testimonials"
        description="Social proof from the people you’ve worked with."
        addLabel="Add testimonial"
        items={testimonials}
        reorder={actions.testimonials.reorder}
        remove={actions.testimonials.remove}
        duplicate={actions.testimonials.duplicate}
        search={(t, q) => t.clientName.toLowerCase().includes(q) || t.company.toLowerCase().includes(q)}
        modalTitle={(e) => (e ? 'Edit testimonial' : 'New testimonial')}
        deleteLabel={(t) => `${t.clientName}’s testimonial`}
        empty={{ icon: <Quote className="h-5 w-5" />, title: 'No testimonials yet', description: 'Add kind words from happy clients.' }}
        renderRow={(t) => <TestimonialRow item={t} />}
        renderEditor={({ editing, onDone }) => <TestimonialEditor editing={editing} onDone={onDone} />}
      />
    </>
  )
}
