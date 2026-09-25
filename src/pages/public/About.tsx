import { useMemo } from 'react'
import { ArrowRight, Download, MapPin, Sparkles } from 'lucide-react'
import { useData } from '@/hooks'
import { SKILL_CATEGORIES, SKILL_CATEGORY_LABELS, type SkillCategory } from '@/types'
import {
  AnchorButton,
  AppImage,
  Container,
  Icon,
  LinkButton,
  Section,
  SectionHeading,
} from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { Reveal } from '@/components/common/Reveal'
import { SocialLinks } from '@/components/common/SocialLinks'
import { TestimonialCard } from '@/components/cards/TestimonialCard'

export default function About() {
  const { profile, skills, testimonials } = useData()

  const grouped = useMemo(() => {
    return SKILL_CATEGORIES.map((category: SkillCategory) => ({
      category,
      label: SKILL_CATEGORY_LABELS[category],
      items: skills.filter((s) => s.category === category),
    })).filter((g) => g.items.length > 0)
  }, [skills])

  const shownTestimonials = testimonials.filter((t) => t.published).slice(0, 2)

  return (
    <>
      <Seo title="About" description={profile.shortBio} path="/about" />
      <PageHeader eyebrow="About me" title={`Hi, I’m ${profile.fullName.split(' ')[0]}`} description={profile.tagline}>
        <SocialLinks links={profile.social} />
      </PageHeader>

      <Section spacing="md">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-3xl border border-border bg-surface">
                  <AppImage
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <div className="mt-5 space-y-3 rounded-2xl border border-border bg-surface p-5 text-sm">
                  {profile.location && (
                    <div className="flex items-center gap-2.5 text-muted">
                      <MapPin className="h-4 w-4 text-accent" />
                      {profile.location}
                    </div>
                  )}
                  {profile.currentFocus && (
                    <div className="flex items-start gap-2.5 text-muted">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{profile.currentFocus}</span>
                    </div>
                  )}
                  {profile.resumeUrl && (
                    <AnchorButton
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      variant="outline"
                      size="sm"
                      className="mt-1 w-full"
                      leftIcon={<Download className="h-4 w-4" />}
                    >
                      Download résumé
                    </AnchorButton>
                  )}
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <div className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
                  {profile.longBio || profile.shortBio}
                </div>
              </Reveal>

              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { label: 'Years', value: `${profile.yearsOfExperience}+` },
                  { label: 'Projects', value: `${profile.projectsCompleted}+` },
                  { label: 'Clients', value: `${profile.happyClients}+` },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 text-center">
                    <p className="font-display text-2xl font-semibold text-foreground">{s.value}</p>
                    <p className="mt-1 text-xs text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Skills */}
      {grouped.length > 0 && (
        <Section spacing="md" className="border-t border-border">
          <Container>
            <SectionHeading eyebrow="Toolbox" title="Skills & expertise" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grouped.map((group, i) => (
                <Reveal key={group.category} delay={i * 0.04}>
                  <div className="rounded-2xl border border-border bg-surface p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-faint">{group.label}</h3>
                    <ul className="mt-4 space-y-3">
                      {group.items.map((skill) => (
                        <li key={skill.id}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="inline-flex items-center gap-2 font-medium text-foreground">
                              <Icon name={skill.icon} className="h-4 w-4 text-accent" />
                              {skill.name}
                            </span>
                            <span className="text-xs text-faint">{skill.proficiency}%</span>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                            <div
                              className="h-full rounded-full bg-accent"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Testimonials */}
      {shownTestimonials.length > 0 && (
        <Section spacing="md" className="border-t border-border">
          <Container>
            <SectionHeading eyebrow="Kind words" title="Trusted by great people" />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {shownTestimonials.map((item) => (
                <TestimonialCard key={item.id} item={item} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section spacing="md" className="border-t border-border">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">Let’s build something</h2>
          <p className="max-w-md text-muted">Open to freelance projects and full-time roles. Let’s talk.</p>
          <LinkButton to="/contact" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Get in touch
          </LinkButton>
        </Container>
      </Section>
    </>
  )
}
