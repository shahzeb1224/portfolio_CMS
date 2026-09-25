import type { ReactNode } from 'react'
import { Container, Eyebrow } from '@/components/ui'
import { Reveal } from './Reveal'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-70" />
      <Container className="relative py-16 sm:py-20">
        <div className="max-w-2xl">
          {eyebrow && (
            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
          )}
          <Reveal delay={0.05}>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
          </Reveal>
          {description && (
            <Reveal delay={0.1}>
              <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>
            </Reveal>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </Container>
    </section>
  )
}
