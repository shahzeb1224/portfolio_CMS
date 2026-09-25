import { ArrowLeft, Home } from 'lucide-react'
import { Container, LinkButton } from '@/components/ui'
import { Seo } from '@/components/common/Seo'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" noindex />
      <Container className="grid min-h-[70vh] place-items-center py-20 text-center">
        <div>
          <p className="font-display text-7xl font-bold text-accent sm:text-8xl">404</p>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground">
            This page wandered off
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <LinkButton to="/" leftIcon={<Home className="h-4 w-4" />}>
              Back home
            </LinkButton>
            <LinkButton to="/projects" variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              View work
            </LinkButton>
          </div>
        </div>
      </Container>
    </>
  )
}
