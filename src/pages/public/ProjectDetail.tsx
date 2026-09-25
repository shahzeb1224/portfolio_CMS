import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, ExternalLink, Github, User } from 'lucide-react'
import { useData } from '@/hooks'
import { formatLongDate } from '@/lib/format'
import {
  AnchorButton,
  AppImage,
  Badge,
  Container,
  Lightbox,
  Section,
} from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import { Reveal } from '@/components/common/Reveal'
import { Markdown } from '@/components/ui'
import NotFound from './NotFound'

const LIST_SECTIONS = [
  { key: 'features', title: 'Key features' },
  { key: 'challenges', title: 'Challenges' },
  { key: 'solutions', title: 'Solutions' },
  { key: 'results', title: 'Results & impact' },
] as const

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { projects } = useData()
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 })

  const published = useMemo(() => projects.filter((p) => p.published), [projects])
  const index = published.findIndex((p) => p.slug === slug)
  const project = index >= 0 ? published[index] : undefined

  if (!project) return <NotFound />

  const prev = index > 0 ? published[index - 1] : undefined
  const next = index < published.length - 1 ? published[index + 1] : undefined
  const gallery = project.images.length ? project.images : project.thumbnail ? [project.thumbnail] : []

  return (
    <>
      <Seo
        title={project.seo.metaTitle || project.title}
        description={project.seo.metaDescription || project.shortDescription}
        image={project.seo.ogImage || project.thumbnail}
        path={`/projects/${project.slug}`}
        type="article"
        keywords={project.seo.keywords}
      />

      <Section spacing="md">
        <Container>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <Badge variant="accent">{project.category}</Badge>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{project.shortDescription}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <AnchorButton href={project.liveUrl} target="_blank" rel="noreferrer" rightIcon={<ExternalLink className="h-4 w-4" />}>
                    Live site
                  </AnchorButton>
                )}
                {project.githubUrl && (
                  <AnchorButton
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    variant="outline"
                    leftIcon={<Github className="h-4 w-4" />}
                  >
                    Source
                  </AnchorButton>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-5 text-sm">
              {project.client && (
                <div className="col-span-2 flex items-center gap-2.5">
                  <User className="h-4 w-4 text-accent" />
                  <div>
                    <dt className="text-xs text-faint">Client</dt>
                    <dd className="font-medium text-foreground">{project.client}</dd>
                  </div>
                </div>
              )}
              {project.completedAt && (
                <div className="col-span-2 flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-accent" />
                  <div>
                    <dt className="text-xs text-faint">Completed</dt>
                    <dd className="font-medium text-foreground">{formatLongDate(project.completedAt)}</dd>
                  </div>
                </div>
              )}
            </dl>
          </div>
        </Container>
      </Section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.map((src, i) => (
              <Reveal
                key={src + i}
                delay={(i % 2) * 0.05}
                className={cnFirst(i, gallery.length)}
              >
                <button
                  type="button"
                  onClick={() => setLightbox({ open: true, index: i })}
                  className="group block w-full overflow-hidden rounded-2xl border border-border bg-surface-2"
                >
                  <AppImage
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    loading="lazy"
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </Container>
      )}

      {/* Body */}
      <Section spacing="md">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              {project.description && <Markdown content={project.description} />}

              <div className="mt-10 space-y-8">
                {LIST_SECTIONS.map(({ key, title }) => {
                  const items = project[key]
                  if (!items?.length) return null
                  return (
                    <div key={key}>
                      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
                      <ul className="mt-4 space-y-2.5">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-muted">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-faint">Tech stack</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="rounded-md bg-surface-2 px-2.5 py-1.5 text-sm font-medium text-muted">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Prev / next */}
      {(prev || next) && (
        <Section spacing="sm" className="border-t border-border">
          <Container>
            <div className="flex items-center justify-between gap-4">
              {prev ? (
                <Link to={`/projects/${prev.slug}`} className="group flex items-center gap-2 text-sm text-muted hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{prev.title}</span>
                  <span className="sm:hidden">Previous</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link to={`/projects/${next.slug}`} className="group flex items-center gap-2 text-sm text-muted hover:text-foreground">
                  <span className="hidden sm:inline">{next.title}</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <span />
              )}
            </div>
          </Container>
        </Section>
      )}

      <Lightbox
        images={gallery}
        index={lightbox.index}
        open={lightbox.open}
        onClose={() => setLightbox((s) => ({ ...s, open: false }))}
        onIndexChange={(i) => setLightbox({ open: true, index: i })}
      />
    </>
  )
}

/** First gallery image spans both columns when there's an odd count > 1. */
function cnFirst(i: number, total: number) {
  return i === 0 && total > 1 && total % 2 === 1 ? 'sm:col-span-2' : ''
}
