import { Check } from 'lucide-react'
import type { Service } from '@/types'
import { Icon } from '@/components/ui'
import { cn } from '@/lib/cn'

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-border-strong hover:shadow-card',
        className,
      )}
    >
      <div className="flex flex-1 flex-col">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent">
          <Icon name={service.icon} className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">
          {service.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>

        {service.features.length > 0 && (
          <ul className="mt-4 space-y-2">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {(service.startingPrice || service.deliveryTime) && (
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
          {service.startingPrice && (
            <div>
              <p className="text-xs text-faint">Starting at</p>
              <p className="font-semibold text-foreground">{service.startingPrice}</p>
            </div>
          )}
          {service.deliveryTime && (
            <div className="text-right">
              <p className="text-xs text-faint">Delivery</p>
              <p className="font-semibold text-foreground">{service.deliveryTime}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
