import { useState, type FormEvent } from 'react'
import { Moon, Save, Sun } from 'lucide-react'
import { useData, useZodForm } from '@/hooks'
import { settingsSchema } from '@/schemas'
import { ACCENT_KEYS, type AccentKey, type ThemeMode } from '@/types'
import { ACCENTS } from '@/lib/theme'
import { cn } from '@/lib/cn'
import { Button, FormField, ImageInput, Input, Textarea } from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import { AdminHeader, FieldGrid, Panel, SeoFields, ToggleRow, useSave } from '@/components/admin'

export default function AdminSettings() {
  const { settings, actions } = useData()
  const { saving, run } = useSave('Settings')
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const { values, setField, errors, validate } = useZodForm(settingsSchema, {
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    logoText: settings.logoText,
    logoImageUrl: settings.logoImageUrl,
    faviconUrl: settings.faviconUrl,
    seo: settings.seo,
    appearance: settings.appearance,
  })

  const appearance = values.appearance
  const setAppearance = (partial: Partial<typeof appearance>) => setField('appearance', { ...appearance, ...partial })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (!v) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    run(true, () => actions.settings.update(v), () => setSavedAt(new Date().toLocaleTimeString()))
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Seo title="Settings" noindex />
      <AdminHeader
        title="Settings"
        description={savedAt ? `Last saved at ${savedAt}` : 'Branding, SEO defaults and appearance.'}
        action={
          <Button type="submit" loading={saving} leftIcon={<Save className="h-4 w-4" />}>
            Save changes
          </Button>
        }
      />

      <div className="space-y-6">
        <Panel title="Branding">
          <div className="space-y-4">
            <FieldGrid>
              <FormField label="Site name" required error={errors.siteName}>
                <Input value={values.siteName} onChange={(e) => setField('siteName', e.target.value)} error={!!errors.siteName} />
              </FormField>
              <FormField label="Logo text" error={errors.logoText} hint="Used when no logo image is set.">
                <Input value={values.logoText ?? ''} onChange={(e) => setField('logoText', e.target.value)} />
              </FormField>
            </FieldGrid>
            <FormField label="Site description" error={errors.siteDescription}>
              <Textarea rows={2} value={values.siteDescription ?? ''} onChange={(e) => setField('siteDescription', e.target.value)} />
            </FormField>
            <FieldGrid>
              <ImageInput label="Logo image" aspect="wide" value={values.logoImageUrl} onChange={(v) => setField('logoImageUrl', v)} />
              <ImageInput label="Favicon" aspect="square" value={values.faviconUrl} onChange={(v) => setField('faviconUrl', v)} />
            </FieldGrid>
          </div>
        </Panel>

        <Panel title="Appearance" description="Applies to the live site immediately after saving.">
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Default theme</p>
              <div className="flex gap-2">
                {(['dark', 'light'] as ThemeMode[]).map((m) => {
                  const ThemeIcon = m === 'dark' ? Moon : Sun
                  const selected = appearance.defaultTheme === m
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setAppearance({ defaultTheme: m })}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition-colors',
                        selected ? 'border-accent bg-accent-soft text-accent' : 'border-border text-muted hover:text-foreground',
                      )}
                    >
                      <ThemeIcon className="h-4 w-4" />
                      {m}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Accent color</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ACCENT_KEYS.map((k) => {
                  const selected = appearance.accent === k
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setAppearance({ accent: k as AccentKey })}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors',
                        selected ? 'border-accent ring-1 ring-accent' : 'border-border hover:border-border-strong',
                      )}
                    >
                      <span className="h-5 w-5 shrink-0 rounded-full" style={{ backgroundColor: ACCENTS[k].swatch }} />
                      <span className="text-sm font-medium text-foreground">{ACCENTS[k].label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <ToggleRow
              label="Animations"
              hint="Enable entrance and motion effects across the site."
              checked={appearance.animationsEnabled}
              onChange={(v) => setAppearance({ animationsEnabled: v })}
            />
          </div>
        </Panel>

        <Panel title="Default SEO" description="Fallback metadata for pages without their own.">
          <SeoFields value={values.seo} onChange={(v) => setField('seo', v)} />
        </Panel>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} leftIcon={<Save className="h-4 w-4" />}>
            Save changes
          </Button>
        </div>
      </div>
    </form>
  )
}
