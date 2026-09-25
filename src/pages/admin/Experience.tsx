import type { FormEvent } from 'react'
import { Briefcase } from 'lucide-react'
import { useData, useZodForm } from '@/hooks'
import { experienceSchema, type ExperienceValues } from '@/schemas'
import {
  EMPLOYMENT_TYPES,
  EMPLOYMENT_TYPE_LABELS,
  type EmploymentType,
  type Experience,
} from '@/types'
import { formatDateRange } from '@/lib/format'
import { FormField, Input, Select, StringListInput, TagInput, Textarea } from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import {
  EditorActions,
  FieldGrid,
  MonthField,
  OrderedManager,
  ToggleRow,
  useSave,
} from '@/components/admin'

const EMPTY: ExperienceValues = {
  company: '',
  position: '',
  location: '',
  employmentType: 'full-time',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  responsibilities: [],
  achievements: [],
  technologies: [],
  companyUrl: '',
}

function ExperienceEditor({ editing, onDone }: { editing: Experience | null; onDone: () => void }) {
  const { actions } = useData()
  const { values, setField, errors, validate } = useZodForm(
    experienceSchema,
    editing
      ? {
          company: editing.company,
          position: editing.position,
          location: editing.location,
          employmentType: editing.employmentType,
          startDate: editing.startDate,
          endDate: editing.endDate,
          current: editing.current,
          description: editing.description,
          responsibilities: editing.responsibilities,
          achievements: editing.achievements,
          technologies: editing.technologies,
          companyUrl: editing.companyUrl,
        }
      : EMPTY,
  )
  const { saving, run } = useSave('Experience')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (!v) return
    run(!!editing, () => (editing ? actions.experience.update(editing.id, v) : actions.experience.create(v)), onDone)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldGrid>
        <FormField label="Position" required error={errors.position}>
          <Input value={values.position} onChange={(e) => setField('position', e.target.value)} error={!!errors.position} placeholder="Senior Frontend Engineer" />
        </FormField>
        <FormField label="Company" required error={errors.company}>
          <Input value={values.company} onChange={(e) => setField('company', e.target.value)} error={!!errors.company} />
        </FormField>
      </FieldGrid>
      <FieldGrid>
        <FormField label="Location" error={errors.location}>
          <Input value={values.location ?? ''} onChange={(e) => setField('location', e.target.value)} placeholder="Remote · Berlin" />
        </FormField>
        <FormField label="Employment type" required error={errors.employmentType}>
          <Select value={values.employmentType} onChange={(e) => setField('employmentType', e.target.value as EmploymentType)}>
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {EMPLOYMENT_TYPE_LABELS[t]}
              </option>
            ))}
          </Select>
        </FormField>
      </FieldGrid>
      <FieldGrid>
        <MonthField label="Start date" required value={values.startDate} onChange={(v) => setField('startDate', v)} error={errors.startDate} />
        <MonthField label="End date" value={values.endDate ?? ''} onChange={(v) => setField('endDate', v)} error={errors.endDate} disabled={values.current} hint={values.current ? 'Current role.' : undefined} />
      </FieldGrid>
      <ToggleRow label="I currently work here" checked={values.current ?? false} onChange={(v) => setField('current', v)} />
      <FormField label="Summary" error={errors.description}>
        <Textarea rows={3} value={values.description ?? ''} onChange={(e) => setField('description', e.target.value)} />
      </FormField>
      <StringListInput label="Responsibilities" value={values.responsibilities ?? []} onChange={(v) => setField('responsibilities', v)} placeholder="Add a responsibility…" addLabel="Add responsibility" />
      <StringListInput label="Key achievements" value={values.achievements ?? []} onChange={(v) => setField('achievements', v)} placeholder="Add an achievement…" addLabel="Add achievement" />
      <TagInput label="Technologies" value={values.technologies ?? []} onChange={(v) => setField('technologies', v)} />
      <FormField label="Company website" error={errors.companyUrl}>
        <Input value={values.companyUrl} onChange={(e) => setField('companyUrl', e.target.value)} placeholder="https://…" error={!!errors.companyUrl} />
      </FormField>
      <EditorActions onCancel={onDone} saving={saving} submitLabel={editing ? 'Save changes' : 'Add experience'} />
    </form>
  )
}

function ExperienceRow({ item }: { item: Experience }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
        <Briefcase className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {item.position} · <span className="text-muted">{item.company}</span>
        </p>
        <p className="truncate text-xs text-muted">{formatDateRange(item.startDate, item.endDate, item.current)}</p>
      </div>
    </div>
  )
}

export default function AdminExperience() {
  const { experience, actions } = useData()
  return (
    <>
      <Seo title="Experience" noindex />
      <OrderedManager<Experience>
        title="Experience"
        description="Your professional work history, newest first."
        addLabel="Add experience"
        items={experience}
        reorder={actions.experience.reorder}
        remove={actions.experience.remove}
        duplicate={actions.experience.duplicate}
        modalSize="xl"
        search={(x, q) => x.company.toLowerCase().includes(q) || x.position.toLowerCase().includes(q)}
        modalTitle={(e) => (e ? 'Edit experience' : 'New experience')}
        deleteLabel={(x) => `${x.position} at ${x.company}`}
        empty={{ icon: <Briefcase className="h-5 w-5" />, title: 'No experience yet', description: 'Add the roles you’ve held.' }}
        renderRow={(x) => <ExperienceRow item={x} />}
        renderEditor={({ editing, onDone }) => <ExperienceEditor editing={editing} onDone={onDone} />}
      />
    </>
  )
}
