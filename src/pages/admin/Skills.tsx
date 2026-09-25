import type { FormEvent } from 'react'
import { Cpu, Star } from 'lucide-react'
import { useData, useZodForm } from '@/hooks'
import { skillSchema, type SkillValues } from '@/schemas'
import {
  SKILL_CATEGORIES,
  SKILL_CATEGORY_LABELS,
  type Skill,
  type SkillCategory,
} from '@/types'
import { FormField, Icon, Input, Select } from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import {
  EditorActions,
  FieldGrid,
  IconField,
  OrderedManager,
  ToggleRow,
  useSave,
} from '@/components/admin'

const EMPTY: SkillValues = {
  name: '',
  category: 'frontend',
  icon: 'Code2',
  proficiency: 80,
  yearsOfExperience: 3,
  featured: false,
}

function SkillEditor({ editing, onDone }: { editing: Skill | null; onDone: () => void }) {
  const { actions } = useData()
  const { values, setField, errors, validate } = useZodForm(
    skillSchema,
    editing
      ? {
          name: editing.name,
          category: editing.category,
          icon: editing.icon,
          proficiency: editing.proficiency,
          yearsOfExperience: editing.yearsOfExperience,
          featured: editing.featured,
        }
      : EMPTY,
  )
  const { saving, run } = useSave('Skill')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (!v) return
    run(!!editing, () => (editing ? actions.skills.update(editing.id, v) : actions.skills.create(v)), onDone)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldGrid>
        <FormField label="Name" required error={errors.name}>
          <Input value={values.name} onChange={(e) => setField('name', e.target.value)} error={!!errors.name} placeholder="React" />
        </FormField>
        <FormField label="Category" required error={errors.category}>
          <Select value={values.category} onChange={(e) => setField('category', e.target.value as SkillCategory)}>
            {SKILL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {SKILL_CATEGORY_LABELS[c]}
              </option>
            ))}
          </Select>
        </FormField>
      </FieldGrid>

      <IconField value={values.icon} onChange={(v) => setField('icon', v)} error={errors.icon} />

      <FieldGrid>
        <FormField label="Proficiency (%)" required error={errors.proficiency} hint="A value from 0 to 100.">
          <Input
            type="number"
            min={0}
            max={100}
            value={values.proficiency}
            onChange={(e) => setField('proficiency', e.currentTarget.valueAsNumber || 0)}
            error={!!errors.proficiency}
          />
        </FormField>
        <FormField label="Years of experience" required error={errors.yearsOfExperience}>
          <Input
            type="number"
            min={0}
            max={50}
            step={0.5}
            value={values.yearsOfExperience}
            onChange={(e) => setField('yearsOfExperience', e.currentTarget.valueAsNumber || 0)}
            error={!!errors.yearsOfExperience}
          />
        </FormField>
      </FieldGrid>

      <ToggleRow
        label="Featured"
        hint="Show in the homepage tech stack."
        checked={values.featured ?? false}
        onChange={(v) => setField('featured', v)}
      />

      <EditorActions onCancel={onDone} saving={saving} submitLabel={editing ? 'Save changes' : 'Create skill'} />
    </form>
  )
}

function SkillRow({ item }: { item: Skill }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
        <Icon name={item.icon} className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
          {item.name}
          {item.featured && <Star className="h-3.5 w-3.5 fill-warning text-warning" />}
        </p>
        <p className="text-xs text-muted">
          {SKILL_CATEGORY_LABELS[item.category]} · {item.proficiency}% · {item.yearsOfExperience} yr
        </p>
      </div>
    </div>
  )
}

export default function AdminSkills() {
  const { skills, actions } = useData()
  return (
    <>
      <Seo title="Skills" noindex />
      <OrderedManager<Skill>
        title="Skills"
        description="The technologies shown across your site, grouped by category."
        addLabel="Add skill"
        items={skills}
        reorder={actions.skills.reorder}
        remove={actions.skills.remove}
        duplicate={actions.skills.duplicate}
        search={(s, q) => s.name.toLowerCase().includes(q) || s.category.includes(q)}
        modalTitle={(e) => (e ? 'Edit skill' : 'New skill')}
        deleteLabel={(s) => s.name}
        empty={{ icon: <Cpu className="h-5 w-5" />, title: 'No skills yet', description: 'Add the tools and technologies you work with.' }}
        renderRow={(s) => <SkillRow item={s} />}
        renderEditor={({ editing, onDone }) => <SkillEditor editing={editing} onDone={onDone} />}
      />
    </>
  )
}
