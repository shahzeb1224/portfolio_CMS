import type { FormEvent } from 'react'
import { Award } from 'lucide-react'
import { useData, useZodForm } from '@/hooks'
import { certificationSchema, type CertificationValues } from '@/schemas'
import type { Certification } from '@/types'
import { formatMonthYear } from '@/lib/format'
import { AppImage, FormField, ImageInput, Input } from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import {
  EditorActions,
  FieldGrid,
  MonthField,
  OrderedManager,
  useSave,
} from '@/components/admin'

const EMPTY: CertificationValues = {
  name: '',
  issuer: '',
  issueDate: '',
  credentialId: '',
  credentialUrl: '',
  image: '',
}

function CertificationEditor({ editing, onDone }: { editing: Certification | null; onDone: () => void }) {
  const { actions } = useData()
  const { values, setField, errors, validate } = useZodForm(
    certificationSchema,
    editing
      ? {
          name: editing.name,
          issuer: editing.issuer,
          issueDate: editing.issueDate,
          credentialId: editing.credentialId,
          credentialUrl: editing.credentialUrl,
          image: editing.image,
        }
      : EMPTY,
  )
  const { saving, run } = useSave('Certification')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (!v) return
    run(!!editing, () => (editing ? actions.certifications.update(editing.id, v) : actions.certifications.create(v)), onDone)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldGrid>
        <FormField label="Name" required error={errors.name}>
          <Input value={values.name} onChange={(e) => setField('name', e.target.value)} error={!!errors.name} placeholder="AWS Solutions Architect" />
        </FormField>
        <FormField label="Issuer" required error={errors.issuer}>
          <Input value={values.issuer} onChange={(e) => setField('issuer', e.target.value)} error={!!errors.issuer} placeholder="Amazon Web Services" />
        </FormField>
      </FieldGrid>
      <FieldGrid>
        <MonthField label="Issue date" value={values.issueDate ?? ''} onChange={(v) => setField('issueDate', v)} error={errors.issueDate} />
        <FormField label="Credential ID" error={errors.credentialId}>
          <Input value={values.credentialId ?? ''} onChange={(e) => setField('credentialId', e.target.value)} />
        </FormField>
      </FieldGrid>
      <FormField label="Credential URL" error={errors.credentialUrl}>
        <Input value={values.credentialUrl} onChange={(e) => setField('credentialUrl', e.target.value)} placeholder="https://…" error={!!errors.credentialUrl} />
      </FormField>
      <ImageInput label="Badge / certificate image" value={values.image} onChange={(v) => setField('image', v)} aspect="square" />
      <EditorActions onCancel={onDone} saving={saving} submitLabel={editing ? 'Save changes' : 'Add certification'} />
    </form>
  )
}

function CertificationRow({ item }: { item: Certification }) {
  return (
    <div className="flex items-center gap-3">
      {item.image ? (
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2">
          <AppImage
            src={item.image}
            alt={item.name}
            className="h-full w-full object-contain p-0.5"
            fallback={
              <div className="grid h-full w-full place-items-center bg-accent-soft text-accent">
                <Award className="h-[18px] w-[18px]" />
              </div>
            }
          />
        </div>
      ) : (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
          <Award className="h-[18px] w-[18px]" />
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
        <p className="truncate text-xs text-muted">
          {item.issuer}
          {item.issueDate ? ` · ${formatMonthYear(item.issueDate)}` : ''}
        </p>
      </div>
    </div>
  )
}

export default function AdminCertifications() {
  const { certifications, actions } = useData()
  return (
    <>
      <Seo title="Certifications" noindex />
      <OrderedManager<Certification>
        title="Certifications"
        description="Professional credentials and badges."
        addLabel="Add certification"
        items={certifications}
        reorder={actions.certifications.reorder}
        remove={actions.certifications.remove}
        duplicate={actions.certifications.duplicate}
        modalTitle={(e) => (e ? 'Edit certification' : 'New certification')}
        deleteLabel={(c) => c.name}
        empty={{ icon: <Award className="h-5 w-5" />, title: 'No certifications yet', description: 'Add your professional credentials.' }}
        renderRow={(c) => <CertificationRow item={c} />}
        renderEditor={({ editing, onDone }) => <CertificationEditor editing={editing} onDone={onDone} />}
      />
    </>
  )
}
