import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { useData } from '@/hooks'
import { Container, EmptyState, LinkButton, Section } from '@/components/ui'
import { Seo } from '@/components/common/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { Reveal } from '@/components/common/Reveal'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { Package } from 'lucide-react'

export default function Services() {
  const { services } = useData()

  const published = useMemo(
    () =>
      [...services]
        .filter((s) => s.published)
        .sort((a, b) => Number(b.featured) - Number(a.featured)),
    [services],
  )

  return (
    <>
      <Seo title="Services" description="Services and engagement options." path="/services" />
      <PageHeader
        eyebrow="Services"
        title="How I can help"
        description="Flexible engagements — from shipping a focused MVP to embedding with your team as a senior engineer."
      />

      <Section spacing="md">
        <Container>
          {published.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {published.map((service, i) => (
                <Reveal key={service.id} delay={(i % 3) * 0.05} className="h-full">
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Package className="h-6 w-6" />} title="No services yet" description="Services will appear here once added." />
          )}
        </Container>
      </Section>

      <Section spacing="md" className="border-t border-border">
        <Container width="narrow" className="text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Not sure which fits?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Tell me about your project and I’ll recommend the best way to work together.
          </p>
          <div className="mt-8 flex justify-center">
            <LinkButton to="/contact" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Start a conversation
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  )
}
