import type { FormEvent } from 'react'
import { Package, Star } from 'lucide-react'
import { useData, useZodForm } from '@/hooks'
import { serviceSchema, type ServiceValues } from '@/schemas'
import type { Service } from '@/types'
import { FormField, Icon, Input, StringListInput, Textarea } from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import {
  EditorActions,
  FieldGrid,
  IconField,
  OrderedManager,
  StatusBadge,
  ToggleRow,
  useSave,
} from '@/components/admin'

const EMPTY: ServiceValues = {
  title: '',
  description: '',
  icon: 'Package',
  features: [],
  startingPrice: '',
  deliveryTime: '',
  featured: false,
  published: true,
}

function ServiceEditor({ editing, onDone }: { editing: Service | null; onDone: () => void }) {
  const { actions } = useData()
  const { values, setField, errors, validate } = useZodForm(
    serviceSchema,
    editing
      ? {
          title: editing.title,
          description: editing.description,
          icon: editing.icon,
          features: editing.features,
          startingPrice: editing.startingPrice,
          deliveryTime: editing.deliveryTime,
          featured: editing.featured,
          published: editing.published,
        }
      : EMPTY,
  )
  const { saving, run } = useSave('Service')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (!v) return
    run(!!editing, () => (editing ? actions.services.update(editing.id, v) : actions.services.create(v)), onDone)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FormField label="Title" required error={errors.title}>
        <Input value={values.title} onChange={(e) => setField('title', e.target.value)} error={!!errors.title} placeholder="Web application development" />
      </FormField>
      <FormField label="Description" required error={errors.description}>
        <Textarea rows={3} value={values.description ?? ''} onChange={(e) => setField('description', e.target.value)} error={!!errors.description} />
      </FormField>
      <IconField value={values.icon} onChange={(v) => setField('icon', v)} error={errors.icon} />
      <StringListInput label="What's included" value={values.features ?? []} onChange={(v) => setField('features', v)} placeholder="Add a feature…" addLabel="Add feature" />
      <FieldGrid>
        <FormField label="Starting price" error={errors.startingPrice} hint="e.g. “From $2,500”.">
          <Input value={values.startingPrice ?? ''} onChange={(e) => setField('startingPrice', e.target.value)} placeholder="From $2,500" />
        </FormField>
        <FormField label="Delivery time" error={errors.deliveryTime} hint="e.g. “2–4 weeks”.">
          <Input value={values.deliveryTime ?? ''} onChange={(e) => setField('deliveryTime', e.target.value)} placeholder="2–4 weeks" />
        </FormField>
      </FieldGrid>
      <FieldGrid>
        <ToggleRow label="Featured" hint="Highlight on the services page." checked={values.featured ?? false} onChange={(v) => setField('featured', v)} />
        <ToggleRow label="Published" hint="Visible on the public site." checked={values.published ?? true} onChange={(v) => setField('published', v)} />
      </FieldGrid>
      <EditorActions onCancel={onDone} saving={saving} submitLabel={editing ? 'Save changes' : 'Create service'} />
    </form>
  )
}

function ServiceRow({ item }: { item: Service }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
        <Icon name={item.icon} className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
          {item.title}
          {item.featured && <Star className="h-3.5 w-3.5 fill-warning text-warning" />}
        </p>
        <p className="truncate text-xs text-muted">{item.startingPrice || item.deliveryTime || `${item.features.length} features`}</p>
      </div>
      <StatusBadge published={item.published} />
    </div>
  )
}

export default function AdminServices() {
  const { services, actions } = useData()
  return (
    <>
      <Seo title="Services" noindex />
      <OrderedManager<Service>
        title="Services"
        description="Packaged offerings shown on your services page."
        addLabel="Add service"
        items={services}
        reorder={actions.services.reorder}
        remove={actions.services.remove}
        duplicate={actions.services.duplicate}
        search={(s, q) => s.title.toLowerCase().includes(q)}
        modalTitle={(e) => (e ? 'Edit service' : 'New service')}
        deleteLabel={(s) => s.title}
        empty={{ icon: <Package className="h-5 w-5" />, title: 'No services yet', description: 'Describe the work you offer to clients.' }}
        renderRow={(s) => <ServiceRow item={s} />}
        renderEditor={({ editing, onDone }) => <ServiceEditor editing={editing} onDone={onDone} />}
      />
    </>
  )
}
