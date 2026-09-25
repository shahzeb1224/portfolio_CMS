import { useMemo, useState } from 'react'
import { Search, FolderOpen } from 'lucide-react'
import { useData } from '@/hooks'
import { Container, EmptyState, Input, Section } from '@/components/ui'
import { cn } from '@/lib/cn'
import { Seo } from '@/components/common/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { Reveal } from '@/components/common/Reveal'
import { ProjectCard } from '@/components/cards/ProjectCard'

export default function Projects() {
  const { projects } = useData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const published = useMemo(() => projects.filter((p) => p.published), [projects])

  const categories = useMemo(() => {
    const set = new Set(published.map((p) => p.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [published])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return published.filter((p) => {
      const matchCat = category === 'All' || p.category === category
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q))
      return matchCat && matchQuery
    })
  }, [published, query, category])

  return (
    <>
      <Seo title="Work" description="Selected projects and case studies." path="/projects" />
      <PageHeader
        eyebrow="Portfolio"
        title="Selected work"
        description="Case studies across web apps, dashboards and design systems — built for real users and real outcomes."
      />

      <Section spacing="md">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                    category === cat
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'border-border text-muted hover:border-border-strong hover:text-foreground',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                className="pl-9"
              />
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, i) => (
                <Reveal key={project.id} delay={(i % 3) * 0.05} className="h-full">
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-8"
              icon={<FolderOpen className="h-6 w-6" />}
              title="No projects found"
              description="Try a different search term or category filter."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
