import { Download, Mail, MapPin, Phone, Printer } from 'lucide-react'
import { useData } from '@/hooks'
import { SKILL_CATEGORIES, SKILL_CATEGORY_LABELS, type SkillCategory } from '@/types'
import { formatDateRange, formatLongDate } from '@/lib/format'
import { AnchorButton, Button, Container, Section } from '@/components/ui'
import { Seo } from '@/components/common/Seo'

export default function Resume() {
  const { profile, experience, education, skills, certifications } = useData()
  const website = profile.social.find((s) => s.platform === 'website' && s.enabled)?.url

  const skillGroups = SKILL_CATEGORIES.map((category: SkillCategory) => ({
    label: SKILL_CATEGORY_LABELS[category],
    items: skills.filter((s) => s.category === category),
  })).filter((g) => g.items.length > 0)

  return (
    <>
      <Seo title="Résumé" description={`${profile.fullName} — ${profile.professionalTitle}`} path="/resume" />

      <Section spacing="md">
        <Container width="narrow">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Résumé</h1>
              <p className="text-sm text-muted">A snapshot of experience, skills and education.</p>
            </div>
            <div className="flex gap-2">
              {profile.resumeUrl && (
                <AnchorButton href={profile.resumeUrl} target="_blank" rel="noreferrer" variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                  Download PDF
                </AnchorButton>
              )}
              <Button onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
                Print
              </Button>
            </div>
          </div>

          <article className="rounded-2xl border border-border bg-surface p-8 sm:p-10 print:border-0 print:p-0">
            {/* Header */}
            <header className="border-b border-border pb-6">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">{profile.fullName}</h2>
              <p className="mt-1 text-lg text-accent">{profile.professionalTitle}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                {profile.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> {profile.email}
                  </span>
                )}
                {profile.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-4 w-4" /> {profile.phone}
                  </span>
                )}
                {profile.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {profile.location}
                  </span>
                )}
                {website && <span className="inline-flex items-center gap-1.5">{website.replace(/^https?:\/\//, '')}</span>}
              </div>
            </header>

            {/* Summary */}
            {(profile.longBio || profile.shortBio) && (
              <ResumeSection title="Summary">
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
                  {profile.longBio || profile.shortBio}
                </p>
              </ResumeSection>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <ResumeSection title="Experience">
                <div className="space-y-5">
                  {experience.map((job) => (
                    <div key={job.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-semibold text-foreground">
                          {job.position} · <span className="text-muted">{job.company}</span>
                        </h4>
                        <span className="text-xs text-faint">{formatDateRange(job.startDate, job.endDate, job.current)}</span>
                      </div>
                      {job.description && <p className="mt-1 text-sm text-muted">{job.description}</p>}
                      {job.achievements.length > 0 && (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                          {job.achievements.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </ResumeSection>
            )}

            {/* Skills */}
            {skillGroups.length > 0 && (
              <ResumeSection title="Skills">
                <div className="space-y-2 text-sm">
                  {skillGroups.map((group) => (
                    <div key={group.label} className="flex gap-2">
                      <span className="w-28 shrink-0 font-medium text-foreground">{group.label}</span>
                      <span className="text-muted">{group.items.map((s) => s.name).join(', ')}</span>
                    </div>
                  ))}
                </div>
              </ResumeSection>
            )}

            {/* Education */}
            {education.length > 0 && (
              <ResumeSection title="Education">
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                        <p className="text-sm text-muted">
                          {edu.institution}
                          {edu.field ? ` · ${edu.field}` : ''}
                        </p>
                      </div>
                      <span className="text-xs text-faint">{formatDateRange(edu.startDate, edu.endDate, edu.current)}</span>
                    </div>
                  ))}
                </div>
              </ResumeSection>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <ResumeSection title="Certifications">
                <ul className="space-y-1.5 text-sm text-muted">
                  {certifications.map((cert) => (
                    <li key={cert.id} className="flex flex-wrap items-baseline justify-between gap-2">
                      <span>
                        <span className="font-medium text-foreground">{cert.name}</span> — {cert.issuer}
                      </span>
                      {cert.issueDate && <span className="text-xs text-faint">{formatLongDate(cert.issueDate)}</span>}
                    </li>
                  ))}
                </ul>
              </ResumeSection>
            )}
          </article>
        </Container>
      </Section>
    </>
  )
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 border-t border-border pt-6 first:border-t-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent">{title}</h3>
      {children}
    </section>
  )
}
