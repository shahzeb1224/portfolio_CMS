import { useState } from 'react'
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useData, useToast, useZodForm } from '@/hooks'
import { messageSchema } from '@/schemas'
import { BUDGET_OPTIONS, PROJECT_TYPE_OPTIONS } from '@/types'
import { toErrorMessage } from '@/lib/errors'
import {
  Button,
  Container,
  FormField,
  Input,
  Section,
  Select,
  Textarea,
} from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { SocialLinks } from '@/components/common/SocialLinks'

const EMPTY = {
  name: '',
  email: '',
  company: '',
  website: '',
  projectType: '',
  budget: '',
  message: '',
}

export default function Contact() {
  const { profile, actions } = useData()
  const toast = useToast()
  const { values, setField, errors, validate, reset } = useZodForm(messageSchema, EMPTY)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = validate()
    if (!parsed) return
    setBusy(true)
    try {
      await actions.messages.create(parsed)
      setSent(true)
      reset(EMPTY)
      toast.success('Message sent', 'Thanks — I’ll get back to you shortly.')
    } catch (err) {
      toast.error('Could not send', toErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const contactItems = [
    profile.email && { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { icon: Phone, label: profile.phone, href: `tel:${profile.phone}` },
    profile.location && { icon: MapPin, label: profile.location, href: undefined },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href?: string }[]

  return (
    <>
      <Seo title="Contact" description="Get in touch to start a project." path="/contact" />
      <PageHeader
        eyebrow="Contact"
        title="Let’s work together"
        description="Have a project, role or idea in mind? Send a message and I’ll reply within a couple of days."
      />

      <Section spacing="md">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            {/* Info */}
            <div className="space-y-6">
              <div className="space-y-3">
                {contactItems.map((item) => {
                  const Icon = item.icon
                  const content = (
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-soft text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </div>
                  )
                  return item.href ? (
                    <a key={item.label} href={item.href} className="block transition-opacity hover:opacity-80">
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  )
                })}
              </div>

              {profile.available && (
                <div className="rounded-2xl border border-success/30 bg-success/5 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    {profile.availabilityMessage || 'Available for new projects'}
                  </p>
                </div>
              )}

              <div>
                <p className="mb-3 text-sm text-muted">Find me online</p>
                <SocialLinks links={profile.social} />
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-success/10 text-success">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Message sent!</h2>
                  <p className="mt-2 max-w-sm text-sm text-muted">
                    Thanks for reaching out. I’ll review your message and get back to you soon.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField label="Name" required error={errors.name}>
                      <Input value={values.name} onChange={(e) => setField('name', e.target.value)} error={!!errors.name} placeholder="Jane Doe" />
                    </FormField>
                    <FormField label="Email" required error={errors.email}>
                      <Input type="email" value={values.email} onChange={(e) => setField('email', e.target.value)} error={!!errors.email} placeholder="jane@company.com" />
                    </FormField>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField label="Company" error={errors.company}>
                      <Input value={values.company} onChange={(e) => setField('company', e.target.value)} placeholder="Acme Inc." />
                    </FormField>
                    <FormField label="Website" error={errors.website}>
                      <Input value={values.website} onChange={(e) => setField('website', e.target.value)} placeholder="https://…" />
                    </FormField>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField label="Project type" error={errors.projectType}>
                      <Select value={values.projectType} onChange={(e) => setField('projectType', e.target.value)}>
                        <option value="">Select…</option>
                        {PROJECT_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                    <FormField label="Budget" error={errors.budget}>
                      <Select value={values.budget} onChange={(e) => setField('budget', e.target.value)}>
                        <option value="">Select…</option>
                        {BUDGET_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                  </div>

                  <FormField label="Message" required error={errors.message}>
                    <Textarea
                      value={values.message}
                      onChange={(e) => setField('message', e.target.value)}
                      error={!!errors.message}
                      rows={6}
                      placeholder="Tell me about your project, timeline and goals…"
                    />
                  </FormField>

                  <Button type="submit" size="lg" loading={busy} rightIcon={<Send className="h-4 w-4" />}>
                    Send message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
