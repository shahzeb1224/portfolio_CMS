import { useMemo, useState } from 'react'
import { PenLine, Search } from 'lucide-react'
import { useData } from '@/hooks'
import { Container, EmptyState, Input, Section } from '@/components/ui'
import { cn } from '@/lib/cn'
import { Seo } from '@/components/common/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { Reveal } from '@/components/common/Reveal'
import { BlogCard } from '@/components/cards/BlogCard'

export default function Blog() {
  const { blog } = useData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const posts = useMemo(
    () =>
      blog
        .filter((p) => p.status === 'published')
        .sort((a, b) => (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt)),
    [blog],
  )

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [posts])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((p) => {
      const matchCat = category === 'All' || p.category === category
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      return matchCat && matchQuery
    })
  }, [posts, query, category])

  return (
    <>
      <Seo title="Blog" description="Articles on engineering, design and building products." path="/blog" />
      <PageHeader
        eyebrow="Writing"
        title="The blog"
        description="Notes on engineering, design systems and shipping products that people love."
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
                placeholder="Search articles…"
                className="pl-9"
              />
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 0.05} className="h-full">
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-8"
              icon={<PenLine className="h-6 w-6" />}
              title="No articles found"
              description="Try a different search term or category."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
