import { ArrowUpRight, Award, Briefcase, Download, GraduationCap } from 'lucide-react'
import { useData } from '@/hooks'
import { EMPLOYMENT_TYPE_LABELS, type EmploymentType } from '@/types'
import { formatDateRange, formatLongDate } from '@/lib/format'
import {
  AnchorButton,
  AppImage,
  Badge,
  Container,
  Section,
  SectionHeading,
} from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { Reveal } from '@/components/common/Reveal'

export default function Experience() {
  const { experience, education, certifications, profile } = useData()

  return (
    <>
      <Seo title="Experience" description="Work history, education and certifications." path="/experience" />
      <PageHeader
        eyebrow="Career"
        title="Experience"
        description="A track record of building and shipping software across teams and industries."
      >
        {profile.resumeUrl && (
          <AnchorButton
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Download résumé
          </AnchorButton>
        )}
      </PageHeader>

      {/* Work */}
      <Section spacing="md">
        <Container>
          <SectionHeading eyebrow="Work" title="Where I've worked" />
          <div className="mt-10 space-y-4">
            {experience.map((job, i) => (
              <Reveal key={job.id} delay={(i % 4) * 0.04}>
                <div className="relative rounded-2xl border border-border bg-surface p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent">
                          <Briefcase className="h-[18px] w-[18px]" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-foreground">{job.position}</h3>
                          <p className="text-sm text-muted">
                            {job.companyUrl ? (
                              <a href={job.companyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
                                {job.company}
                                <ArrowUpRight className="h-3 w-3" />
                              </a>
                            ) : (
                              job.company
                            )}
                            {job.location ? ` · ${job.location}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="muted">{EMPLOYMENT_TYPE_LABELS[job.employmentType as EmploymentType]}</Badge>
                      <p className="mt-1.5 text-xs text-faint">
                        {formatDateRange(job.startDate, job.endDate, job.current)}
                      </p>
                    </div>
                  </div>

                  {job.description && <p className="mt-4 text-sm leading-relaxed text-muted">{job.description}</p>}

                  {job.achievements.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {job.achievements.map((a, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-muted">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {job.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {job.technologies.map((tech) => (
                        <span key={tech} className="rounded-md bg-surface-2 px-2 py-1 text-xs font-medium text-muted">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Education + Certifications */}
      <Section spacing="md" className="border-t border-border">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            {education.length > 0 && (
              <div>
                <SectionHeading eyebrow="Education" title="Academic background" />
                <div className="mt-8 space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="rounded-2xl border border-border bg-surface p-5">
                      <div className="flex items-start gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                          <GraduationCap className="h-[18px] w-[18px]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                          <p className="text-sm text-muted">
                            {edu.institution}
                            {edu.field ? ` · ${edu.field}` : ''}
                          </p>
                          <p className="mt-1 text-xs text-faint">
                            {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                          </p>
                          {edu.description && <p className="mt-2 text-sm text-muted">{edu.description}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <SectionHeading eyebrow="Credentials" title="Certifications" />
                <div className="mt-8 space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5">
                      {cert.image ? (
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2">
                          <AppImage
                            src={cert.image}
                            alt={cert.name}
                            className="h-full w-full object-contain p-1"
                            fallback={
                              <div className="grid h-full w-full place-items-center bg-accent-soft text-accent">
                                <Award className="h-5 w-5" />
                              </div>
                            }
                          />
                        </div>
                      ) : (
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                          <Award className="h-[18px] w-[18px]" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{cert.name}</h3>
                        <p className="text-sm text-muted">{cert.issuer}</p>
                        <p className="mt-1 text-xs text-faint">
                          {cert.issueDate ? formatLongDate(cert.issueDate) : ''}
                          {cert.credentialId ? ` · ID ${cert.credentialId}` : ''}
                        </p>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-sm text-accent hover:underline"
                          >
                            View credential
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  )
}
