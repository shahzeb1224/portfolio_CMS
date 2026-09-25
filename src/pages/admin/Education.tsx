import type { FormEvent } from 'react'
import { GraduationCap } from 'lucide-react'
import { useData, useZodForm } from '@/hooks'
import { educationSchema, type EducationValues } from '@/schemas'
import type { Education } from '@/types'
import { formatDateRange } from '@/lib/format'
import { FormField, Input, Textarea } from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import {
  EditorActions,
  FieldGrid,
  MonthField,
  OrderedManager,
  ToggleRow,
  useSave,
} from '@/components/admin'

const EMPTY: EducationValues = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  institutionUrl: '',
}

function EducationEditor({ editing, onDone }: { editing: Education | null; onDone: () => void }) {
  const { actions } = useData()
  const { values, setField, errors, validate } = useZodForm(
    educationSchema,
    editing
      ? {
          institution: editing.institution,
          degree: editing.degree,
          field: editing.field,
          startDate: editing.startDate,
          endDate: editing.endDate,
          current: editing.current,
          description: editing.description,
          institutionUrl: editing.institutionUrl,
        }
      : EMPTY,
  )
  const { saving, run } = useSave('Education')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (!v) return
    run(!!editing, () => (editing ? actions.education.update(editing.id, v) : actions.education.create(v)), onDone)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldGrid>
        <FormField label="Institution" required error={errors.institution}>
          <Input value={values.institution} onChange={(e) => setField('institution', e.target.value)} error={!!errors.institution} />
        </FormField>
        <FormField label="Degree" required error={errors.degree}>
          <Input value={values.degree} onChange={(e) => setField('degree', e.target.value)} error={!!errors.degree} placeholder="BSc Computer Science" />
        </FormField>
      </FieldGrid>
      <FormField label="Field of study" error={errors.field}>
        <Input value={values.field ?? ''} onChange={(e) => setField('field', e.target.value)} placeholder="Software Engineering" />
      </FormField>
      <FieldGrid>
        <MonthField label="Start date" value={values.startDate ?? ''} onChange={(v) => setField('startDate', v)} error={errors.startDate} />
        <MonthField label="End date" value={values.endDate ?? ''} onChange={(v) => setField('endDate', v)} error={errors.endDate} disabled={values.current} hint={values.current ? 'Currently studying here.' : undefined} />
      </FieldGrid>
      <ToggleRow label="Currently studying" checked={values.current ?? false} onChange={(v) => setField('current', v)} />
      <FormField label="Description" error={errors.description}>
        <Textarea rows={3} value={values.description ?? ''} onChange={(e) => setField('description', e.target.value)} />
      </FormField>
      <FormField label="Institution website" error={errors.institutionUrl}>
        <Input value={values.institutionUrl} onChange={(e) => setField('institutionUrl', e.target.value)} placeholder="https://…" error={!!errors.institutionUrl} />
      </FormField>
      <EditorActions onCancel={onDone} saving={saving} submitLabel={editing ? 'Save changes' : 'Add education'} />
    </form>
  )
}

function EducationRow({ item }: { item: Education }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
        <GraduationCap className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{item.degree}</p>
        <p className="truncate text-xs text-muted">
          {item.institution} · {formatDateRange(item.startDate, item.endDate, item.current)}
        </p>
      </div>
    </div>
  )
}

export default function AdminEducation() {
  const { education, actions } = useData()
  return (
    <>
      <Seo title="Education" noindex />
      <OrderedManager<Education>
        title="Education"
        description="Degrees, courses and academic background."
        addLabel="Add education"
        items={education}
        reorder={actions.education.reorder}
        remove={actions.education.remove}
        duplicate={actions.education.duplicate}
        modalTitle={(e) => (e ? 'Edit education' : 'New education')}
        deleteLabel={(x) => x.degree}
        empty={{ icon: <GraduationCap className="h-5 w-5" />, title: 'No education yet', description: 'Add your degrees and courses.' }}
        renderRow={(x) => <EducationRow item={x} />}
        renderEditor={({ editing, onDone }) => <EducationEditor editing={editing} onDone={onDone} />}
      />
    </>
  )
}
