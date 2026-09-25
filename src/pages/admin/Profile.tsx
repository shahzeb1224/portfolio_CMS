import { useState, type FormEvent } from 'react'
import { Save } from 'lucide-react'
import { useData, useZodForm } from '@/hooks'
import { profileSchema } from '@/schemas'
import { SOCIAL_PLATFORMS } from '@/types'
import {
  Button,
  FormField,
  ImageInput,
  Input,
  Switch,
  Textarea,
} from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import { AdminHeader, FieldGrid, Panel, ToggleRow, useSave } from '@/components/admin'

export default function AdminProfile() {
  const { profile, actions } = useData()
  const { saving, run } = useSave('Profile')
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const { values, setField, errors, validate } = useZodForm(profileSchema, {
    fullName: profile.fullName,
    professionalTitle: profile.professionalTitle,
    tagline: profile.tagline,
    avatar: profile.avatar,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    shortBio: profile.shortBio,
    longBio: profile.longBio,
    currentFocus: profile.currentFocus,
    available: profile.available,
    availabilityMessage: profile.availabilityMessage,
    yearsOfExperience: profile.yearsOfExperience,
    projectsCompleted: profile.projectsCompleted,
    happyClients: profile.happyClients,
    resumeUrl: profile.resumeUrl,
    social: SOCIAL_PLATFORMS.map((p) => {
      const found = profile.social.find((s) => s.platform === p)
      return { platform: p, url: found?.url ?? '', enabled: found?.enabled ?? false }
    }),
    hero: profile.hero,
  })

  const hero = values.hero
  const setHero = (partial: Partial<typeof hero>) => setField('hero', { ...hero, ...partial })
  const social = values.social ?? []
  const setSocial = (i: number, partial: { url?: string; enabled?: boolean }) =>
    setField(
      'social',
      social.map((s, idx) => (idx === i ? { ...s, ...partial } : s)),
    )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (!v) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    run(true, () => actions.profile.update(v), () => setSavedAt(new Date().toLocaleTimeString()))
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Seo title="Profile" noindex />
      <AdminHeader
        title="Profile"
        description={savedAt ? `Last saved at ${savedAt}` : 'Your identity — used across the entire site.'}
        action={
          <Button type="submit" loading={saving} leftIcon={<Save className="h-4 w-4" />}>
            Save changes
          </Button>
        }
      />

      <div className="space-y-6">
        <Panel title="Identity" description="Shown in the hero, navbar, footer and SEO.">
          <div className="space-y-4">
            <ImageInput label="Avatar" aspect="square" value={values.avatar} onChange={(v) => setField('avatar', v)} />
            <FieldGrid>
              <FormField label="Full name" required error={errors.fullName}>
                <Input value={values.fullName} onChange={(e) => setField('fullName', e.target.value)} error={!!errors.fullName} />
              </FormField>
              <FormField label="Professional title" required error={errors.professionalTitle}>
                <Input value={values.professionalTitle} onChange={(e) => setField('professionalTitle', e.target.value)} error={!!errors.professionalTitle} />
              </FormField>
            </FieldGrid>
            <FormField label="Tagline" error={errors.tagline} hint="A short line beneath your title.">
              <Input value={values.tagline ?? ''} onChange={(e) => setField('tagline', e.target.value)} />
            </FormField>
          </div>
        </Panel>

        <Panel title="Contact">
          <div className="space-y-4">
            <FieldGrid>
              <FormField label="Email" required error={errors.email}>
                <Input type="email" value={values.email} onChange={(e) => setField('email', e.target.value)} error={!!errors.email} />
              </FormField>
              <FormField label="Phone" error={errors.phone}>
                <Input value={values.phone ?? ''} onChange={(e) => setField('phone', e.target.value)} />
              </FormField>
            </FieldGrid>
            <FieldGrid>
              <FormField label="Location" error={errors.location}>
                <Input value={values.location ?? ''} onChange={(e) => setField('location', e.target.value)} placeholder="Remote · Berlin" />
              </FormField>
              <FormField label="Résumé URL" error={errors.resumeUrl} hint="Link to a downloadable PDF.">
                <Input value={values.resumeUrl ?? ''} onChange={(e) => setField('resumeUrl', e.target.value)} placeholder="https://…" />
              </FormField>
            </FieldGrid>
          </div>
        </Panel>

        <Panel title="About" description="Your bio and current focus.">
          <div className="space-y-4">
            <FormField label="Short bio" required error={errors.shortBio} hint="One or two sentences for cards and footers.">
              <Textarea rows={2} value={values.shortBio} onChange={(e) => setField('shortBio', e.target.value)} error={!!errors.shortBio} />
            </FormField>
            <FormField label="Long bio" error={errors.longBio} hint="Full about-page story. Line breaks are preserved.">
              <Textarea rows={6} value={values.longBio ?? ''} onChange={(e) => setField('longBio', e.target.value)} />
            </FormField>
            <FormField label="Current focus" error={errors.currentFocus}>
              <Input value={values.currentFocus ?? ''} onChange={(e) => setField('currentFocus', e.target.value)} placeholder="Building design systems with React" />
            </FormField>
          </div>
        </Panel>

        <Panel title="Highlight stats" description="The headline numbers on your home and about pages.">
          <FieldGrid className="sm:grid-cols-3">
            <FormField label="Years of experience" required error={errors.yearsOfExperience}>
              <Input type="number" min={0} max={80} value={values.yearsOfExperience} onChange={(e) => setField('yearsOfExperience', e.currentTarget.valueAsNumber || 0)} error={!!errors.yearsOfExperience} />
            </FormField>
            <FormField label="Projects completed" required error={errors.projectsCompleted}>
              <Input type="number" min={0} value={values.projectsCompleted} onChange={(e) => setField('projectsCompleted', e.currentTarget.valueAsNumber || 0)} error={!!errors.projectsCompleted} />
            </FormField>
            <FormField label="Happy clients" required error={errors.happyClients}>
              <Input type="number" min={0} value={values.happyClients} onChange={(e) => setField('happyClients', e.currentTarget.valueAsNumber || 0)} error={!!errors.happyClients} />
            </FormField>
          </FieldGrid>
        </Panel>

        <Panel title="Availability">
          <div className="space-y-4">
            <ToggleRow label="Available for work" hint="Shows an availability badge across the site." checked={values.available ?? false} onChange={(v) => setField('available', v)} />
            <FormField label="Availability message" error={errors.availabilityMessage}>
              <Input value={values.availabilityMessage ?? ''} onChange={(e) => setField('availabilityMessage', e.target.value)} placeholder="Available for freelance projects" />
            </FormField>
          </div>
        </Panel>

        <Panel title="Hero section" description="Fine-tune the homepage hero.">
          <div className="space-y-4">
            <FieldGrid>
              <FormField label="Greeting">
                <Input value={hero.greeting ?? ''} onChange={(e) => setHero({ greeting: e.target.value })} placeholder="Hi, I’m" />
              </FormField>
              <FormField label="Availability text">
                <Input value={hero.availabilityText ?? ''} onChange={(e) => setHero({ availabilityText: e.target.value })} />
              </FormField>
            </FieldGrid>
            <FormField label="Value proposition" hint="The big statement in the hero.">
              <Textarea rows={2} value={hero.valueProposition ?? ''} onChange={(e) => setHero({ valueProposition: e.target.value })} />
            </FormField>
            <FieldGrid>
              <FormField label="Primary button label">
                <Input value={hero.primaryCtaLabel ?? ''} onChange={(e) => setHero({ primaryCtaLabel: e.target.value })} />
              </FormField>
              <FormField label="Primary button link">
                <Input value={hero.primaryCtaHref ?? ''} onChange={(e) => setHero({ primaryCtaHref: e.target.value })} placeholder="/projects" />
              </FormField>
              <FormField label="Secondary button label">
                <Input value={hero.secondaryCtaLabel ?? ''} onChange={(e) => setHero({ secondaryCtaLabel: e.target.value })} />
              </FormField>
              <FormField label="Secondary button link">
                <Input value={hero.secondaryCtaHref ?? ''} onChange={(e) => setHero({ secondaryCtaHref: e.target.value })} placeholder="/contact" />
              </FormField>
            </FieldGrid>
            <ImageInput label="Hero image override" value={hero.imageOverride ?? ''} onChange={(v) => setHero({ imageOverride: v })} hint="Optional — falls back to your avatar." />
            <div className="grid gap-2 sm:grid-cols-2">
              <HeroToggle label="Show greeting" checked={hero.showGreeting ?? true} onChange={(v) => setHero({ showGreeting: v })} />
              <HeroToggle label="Show availability" checked={hero.showAvailability ?? true} onChange={(v) => setHero({ showAvailability: v })} />
              <HeroToggle label="Show secondary button" checked={hero.showSecondaryCta ?? true} onChange={(v) => setHero({ showSecondaryCta: v })} />
              <HeroToggle label="Show social links" checked={hero.showSocials ?? true} onChange={(v) => setHero({ showSocials: v })} />
            </div>
          </div>
        </Panel>

        <Panel title="Social links" description="Toggle a platform on and add its URL.">
          <div className="space-y-2.5">
            {social.map((link, i) => (
              <div key={link.platform} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm capitalize text-muted">{link.platform}</span>
                <Input value={link.url ?? ''} placeholder="https://…" onChange={(e) => setSocial(i, { url: e.target.value })} />
                <Switch checked={link.enabled ?? false} onChange={(v) => setSocial(i, { enabled: v })} aria-label={`Enable ${link.platform}`} />
              </div>
            ))}
          </div>
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

function HeroToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-border bg-background-elevated px-3.5 py-2.5">
      <Switch checked={checked} onChange={onChange} aria-label={label} />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  )
}
