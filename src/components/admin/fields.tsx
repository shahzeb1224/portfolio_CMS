import {
  FormField,
  Icon,
  ImageInput,
  Input,
  Switch,
  TagInput,
  Textarea,
} from '@/components/ui'

/** Bordered row pairing a label + hint with a Switch — for featured/published flags. */
export function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background-elevated px-3.5 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-faint">{hint}</p>}
      </div>
      <Switch checked={checked} onChange={onChange} aria-label={label} />
    </div>
  )
}

/** Month picker (YYYY-MM) wrapped in a FormField. Tolerates full ISO input values. */
export function MonthField({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  hint?: string
}) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <Input
        type="month"
        value={value ? value.slice(0, 7) : ''}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        disabled={disabled}
      />
    </FormField>
  )
}

/** Lucide icon-name picker with a live preview swatch. */
export function IconField({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <FormField label="Icon" required error={error} hint="Any Lucide icon name, e.g. Code2, Database, Palette.">
      <div className="flex items-center gap-2">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-background-elevated text-accent">
          <Icon name={value || 'Sparkle'} className="h-5 w-5" />
        </div>
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Code2" error={!!error} />
      </div>
    </FormField>
  )
}

export interface SeoDraft {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
}

/** Shared SEO metadata block used by project, blog and settings editors. */
export function SeoFields({ value, onChange }: { value: SeoDraft; onChange: (value: SeoDraft) => void }) {
  const set = <K extends keyof SeoDraft>(key: K, val: SeoDraft[K]) => onChange({ ...value, [key]: val })
  return (
    <div className="space-y-4">
      <FormField label="Meta title" hint="Falls back to the title when left empty.">
        <Input value={value.metaTitle ?? ''} onChange={(e) => set('metaTitle', e.target.value)} placeholder="Custom search-result title" />
      </FormField>
      <FormField label="Meta description" hint="Around 150–160 characters works best.">
        <Textarea rows={2} value={value.metaDescription ?? ''} onChange={(e) => set('metaDescription', e.target.value)} />
      </FormField>
      <TagInput label="Keywords" value={value.keywords ?? []} onChange={(v) => set('keywords', v)} />
      <ImageInput label="Social share image" value={value.ogImage ?? ''} onChange={(v) => set('ogImage', v)} hint="Shown when the page is shared (Open Graph)." />
    </div>
  )
}
