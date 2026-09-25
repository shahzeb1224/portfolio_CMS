import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react'
import { useData } from '@/hooks'
import { formatLongDate } from '@/lib/format'
import { AppImage, Avatar, Badge, Container, Markdown, Section } from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import { BlogCard } from '@/components/cards/BlogCard'
import NotFound from './NotFound'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { blog, profile } = useData()

  const published = useMemo(() => blog.filter((p) => p.status === 'published'), [blog])
  const post = published.find((p) => p.slug === slug)

  if (!post) return <NotFound />

  const related = published.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3)
  const author = post.author || profile.fullName
  const date = post.publishedAt || post.createdAt

  return (
    <>
      <Seo
        title={post.seo.metaTitle || post.title}
        description={post.seo.metaDescription || post.excerpt}
        image={post.seo.ogImage || post.featuredImage}
        path={`/blog/${post.slug}`}
        type="article"
        keywords={post.seo.keywords?.length ? post.seo.keywords : post.tags}
      />

      <Section spacing="md">
        <Container width="narrow">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            All articles
          </Link>

          <div className="mt-6">
            {post.category && <Badge variant="accent">{post.category}</Badge>}
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{post.excerpt}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-border py-4 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <Avatar src={profile.avatar} name={author} size={28} />
                {author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatLongDate(date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
            </div>
          </div>

          {post.featuredImage && (
            <AppImage
              src={post.featuredImage}
              alt={post.title}
              className="mt-8 aspect-[16/9] w-full rounded-2xl border border-border object-cover"
            />
          )}

          <div className="mt-10">
            <Markdown content={post.content} />
          </div>

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {related.length > 0 && (
        <Section spacing="md" className="border-t border-border">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Related reading</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
