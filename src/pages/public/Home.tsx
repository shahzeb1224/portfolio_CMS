import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, MessageSquarePlus, Sparkles } from 'lucide-react'
import { useData } from '@/hooks'
import { compactNumber } from '@/lib/format'
import {
  AppImage,
  Badge,
  Button,
  Container,
  Icon,
  LinkButton,
  Section,
  SectionHeading,
} from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import { Reveal } from '@/components/common/Reveal'
import { SocialLinks } from '@/components/common/SocialLinks'
import { ProjectCard } from '@/components/cards/ProjectCard'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { TestimonialCard } from '@/components/cards/TestimonialCard'
import { BlogCard } from '@/components/cards/BlogCard'
import { ReviewModal } from '@/components/reviews/ReviewModal'


export default function Home() {
  const { profile, projects, services, testimonials, blog, skills } = useData()
  const hero = profile.hero

  const featuredProjects = useMemo(
    () => projects.filter((p) => p.published && p.featured).slice(0, 4),
    [projects],
  )
  const featuredServices = useMemo(
    () => [...services].filter((s) => s.published).sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3),
    [services],
  )
  const shownTestimonials = useMemo(
    () => testimonials.filter((t) => t.published).slice(0, 3),
    [testimonials],
  )
  const latestPosts = useMemo(
    () => blog.filter((p) => p.status === 'published').slice(0, 3),
    [blog],
  )
  const featuredSkills = useMemo(() => {
    const feat = skills.filter((s) => s.featured)
    return (feat.length ? feat : skills).slice(0, 12)
  }, [skills])

  const stats = [
    { label: 'Years experience', value: `${profile.yearsOfExperience}+` },
    { label: 'Projects shipped', value: `${compactNumber(profile.projectsCompleted)}+` },
    { label: 'Happy clients', value: `${compactNumber(profile.happyClients)}+` },
  ]

  return (
    <>
      <Seo path="/" />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-grid">
        <div className="pointer-events-none absolute inset-0 bg-radial-accent" />
        <Container className="relative">
          <div className="grid items-center gap-12 pt-16 pb-20 md:grid-cols-[1.15fr_0.85fr] md:pt-16 md:pb-28">
            <div>
              {hero.showGreeting && hero.greeting && (
                <Reveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    {hero.greeting}
                  </span>
                </Reveal>
              )}
              <Reveal delay={0.05}>
                <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {profile.fullName}
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-3 text-xl font-medium text-accent sm:text-2xl">
                  {profile.professionalTitle}
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                  {hero.valueProposition || profile.tagline}
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <LinkButton to={hero.primaryCtaHref || '/contact'} size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    {hero.primaryCtaLabel || 'Start a project'}
                  </LinkButton>
                  {hero.showSecondaryCta && (
                    <LinkButton to={hero.secondaryCtaHref || '/projects'} size="lg" variant="outline">
                      {hero.secondaryCtaLabel || 'View work'}
                    </LinkButton>
                  )}
                </div>
              </Reveal>
              {hero.showSocials && (
                <Reveal delay={0.25}>
                  <SocialLinks links={profile.social} className="mt-8" />
                </Reveal>
              )}
            </div>

            <Reveal delay={0.15}>
              <div className="relative mx-auto w-full max-w-sm">
                <div className="absolute -inset-4 rounded-3xl bg-accent/10 blur-2xl" />
                <div className="relative overflow-hidden rounded-3xl border border-border bg-surface">
                  <AppImage
                    src={hero.imageOverride || profile.avatar}
                    alt={profile.fullName}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                {hero.showAvailability && profile.available && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-background-elevated px-4 py-2 text-sm font-medium text-foreground shadow-card">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success" />
                    {hero.availabilityText || profile.availabilityMessage || 'Available for work'}
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 border-t border-border py-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="font-display text-3xl font-semibold text-foreground sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Tech stack */}
      {featuredSkills.length > 0 && (
        <Section spacing="md">
          <Container>
            <p className="text-center text-sm font-medium uppercase tracking-wider text-faint">
              Tools &amp; technologies I work with
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              {featuredSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-muted"
                >
                  <Icon name={skill.icon} className="h-4 w-4 text-accent" />
                  {skill.name}
                </span>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <Section spacing="md">
          <Container>
            <SectionHeading
              eyebrow="Selected work"
              title="Projects I'm proud of"
              description="A few builds that show how I think about product, craft and performance."
              actions={
                <LinkButton to="/projects" variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  All projects
                </LinkButton>
              }
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {featuredProjects.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.05} className="h-full">
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Services */}
      {featuredServices.length > 0 && (
        <Section spacing="md">
          <Container>
            <SectionHeading
              eyebrow="What I do"
              title="Services"
              description="End-to-end product engineering — from first wireframe to production deploy."
              actions={
                <LinkButton to="/services" variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  All services
                </LinkButton>
              }
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featuredServices.map((service, i) => (
                <Reveal key={service.id} delay={i * 0.05} className="h-full">
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Testimonials */}
      {shownTestimonials.length > 0 && (
        <Section spacing="md">
          <Container>
            <SectionHeading eyebrow="Kind words" title="What clients say" align="center" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {shownTestimonials.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.05} className="h-full">
                  <TestimonialCard item={item} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Blog */}
      {latestPosts.length > 0 && (
        <Section spacing="md">
          <Container>
            <SectionHeading
              eyebrow="Writing"
              title="From the blog"
              actions={
                <LinkButton to="/blog" variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  All posts
                </LinkButton>
              }
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {latestPosts.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.05} className="h-full">
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section spacing="lg">
        <Container width="narrow">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center">
            <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-60" />
            <div className="relative">
              <Badge variant="accent">Available for work</Badge>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Have a project in mind?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted">
                Let’s turn your idea into a polished, production-ready product.
              </p>
              <div className="mt-8 flex justify-center">
                <LinkButton to="/contact" size="lg" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
                  Get in touch
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
