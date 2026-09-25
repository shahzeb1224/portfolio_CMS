import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/types'
import { AppImage, Badge } from '@/components/ui'
import { cn } from '@/lib/cn'

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-border-strong hover:shadow-card-hover',
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        <AppImage
          src={project.thumbnail}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          fallback={<div className="grid h-full w-full place-items-center text-faint">No image</div>}
        />
        <div className="absolute left-3 top-3">
          <Badge variant="default" className="bg-background/80 backdrop-blur">
            {project.category}
          </Badge>
        </div>
        <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {project.shortDescription}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-surface-2 px-2 py-1 text-xs font-medium text-muted"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="rounded-md px-2 py-1 text-xs font-medium text-faint">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
