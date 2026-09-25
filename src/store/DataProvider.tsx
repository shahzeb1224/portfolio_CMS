import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { services as svc } from '@/services'
import { toErrorMessage } from '@/lib/errors'
import type {
  Profile,
  UpdateProfileInput,
  SiteSettings,
  UpdateSettingsInput,
  Skill,
  CreateSkillInput,
  UpdateSkillInput,
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  Experience,
  CreateExperienceInput,
  UpdateExperienceInput,
  Education,
  CreateEducationInput,
  UpdateEducationInput,
  Certification,
  CreateCertificationInput,
  UpdateCertificationInput,
  Service,
  CreateServiceInput,
  UpdateServiceInput,
  Testimonial,
  CreateTestimonialInput,
  UpdateTestimonialInput,
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  ContactMessage,
  CreateMessageInput,
  UpdateMessageInput,
} from '@/types'
import type { CrudService, OrderedCrudService } from '@/services/base'

/* ── State shape ──────────────────────────────────────────────── */
interface Collections {
  skills: Skill[]
  projects: Project[]
  experience: Experience[]
  education: Education[]
  certifications: Certification[]
  services: Service[]
  testimonials: Testimonial[]
  blog: BlogPost[]
  messages: ContactMessage[]
}
type CollectionKey = keyof Collections

interface DataState extends Collections {
  profile: Profile | null
  settings: SiteSettings | null
}

const EMPTY: DataState = {
  profile: null,
  settings: null,
  skills: [],
  projects: [],
  experience: [],
  education: [],
  certifications: [],
  services: [],
  testimonials: [],
  blog: [],
  messages: [],
}

/* ── Action bundles ───────────────────────────────────────────── */
interface Crud<T, C, U> {
  create: (data: C) => Promise<T>
  update: (id: string, data: U) => Promise<T>
  remove: (id: string) => Promise<void>
  duplicate: (id: string) => Promise<T | null>
}
type Ordered<T, C, U> = Crud<T, C, U> & { reorder: (orderedIds: string[]) => Promise<void> }

interface DataActions {
  profile: { update: (data: UpdateProfileInput) => Promise<Profile> }
  settings: { update: (data: UpdateSettingsInput) => Promise<SiteSettings> }
  skills: Ordered<Skill, CreateSkillInput, UpdateSkillInput>
  projects: Crud<Project, CreateProjectInput, UpdateProjectInput>
  experience: Ordered<Experience, CreateExperienceInput, UpdateExperienceInput>
  education: Ordered<Education, CreateEducationInput, UpdateEducationInput>
  certifications: Ordered<Certification, CreateCertificationInput, UpdateCertificationInput>
  services: Ordered<Service, CreateServiceInput, UpdateServiceInput>
  testimonials: Ordered<Testimonial, CreateTestimonialInput, UpdateTestimonialInput>
  blog: Crud<BlogPost, CreateBlogPostInput, UpdateBlogPostInput>
  messages: Crud<ContactMessage, CreateMessageInput, UpdateMessageInput>
}

export interface DataContextValue extends Collections {
  status: 'loading' | 'ready' | 'error'
  error: string | null
  profile: Profile
  settings: SiteSettings
  refresh: () => Promise<void>
  /** All mutations live here, namespaced per entity. Collections above stay read-only. */
  actions: DataActions
}

const DataContext = createContext<DataContextValue | null>(null)

/* ── Provider ─────────────────────────────────────────────────── */
export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>(EMPTY)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const [
        profile,
        settings,
        skills,
        projects,
        experience,
        education,
        certifications,
        servicesList,
        testimonials,
        blog,
        messages,
      ] = await Promise.all([
        svc.profile.get(),
        svc.settings.get(),
        svc.skills.list(),
        svc.projects.list(),
        svc.experience.list(),
        svc.education.list(),
        svc.certifications.list(),
        svc.services.list(),
        svc.testimonials.list(),
        svc.blog.list(),
        svc.messages.list(),
      ])
      setState({
        profile,
        settings,
        skills,
        projects,
        experience,
        education,
        certifications,
        services: servicesList,
        testimonials,
        blog,
        messages,
      })
      setStatus('ready')
    } catch (err) {
      setError(toErrorMessage(err))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const patch = useCallback((key: CollectionKey, list: unknown[]) => {
    setState((prev) => ({ ...prev, [key]: list }))
  }, [])

  const actions = useMemo<DataActions>(() => {
    const crud = <T extends { id: string }, C, U>(
      key: CollectionKey,
      service: CrudService<T, C, U>,
    ): Crud<T, C, U> => {
      const reload = async () => patch(key, await service.list())
      return {
        create: async (data) => {
          const created = await service.create(data)
          await reload()
          return created
        },
        update: async (id, data) => {
          const updated = await service.update(id, data)
          await reload()
          return updated
        },
        remove: async (id) => {
          await service.remove(id)
          await reload()
        },
        duplicate: async (id) => {
          const dup = await service.duplicate(id)
          await reload()
          return dup
        },
      }
    }
    const ordered = <T extends { id: string; sortOrder: number }, C, U>(
      key: CollectionKey,
      service: OrderedCrudService<T, C, U>,
    ): Ordered<T, C, U> => ({
      ...crud(key, service),
      reorder: async (orderedIds) => {
        const list = await service.reorder(orderedIds)
        patch(key, list)
      },
    })

    return {
      profile: {
        update: async (data) => {
          const p = await svc.profile.update(data)
          setState((prev) => ({ ...prev, profile: p }))
          return p
        },
      },
      settings: {
        update: async (data) => {
          const s = await svc.settings.update(data)
          setState((prev) => ({ ...prev, settings: s }))
          return s
        },
      },
      skills: ordered('skills', svc.skills),
      projects: crud('projects', svc.projects),
      experience: ordered('experience', svc.experience),
      education: ordered('education', svc.education),
      certifications: ordered('certifications', svc.certifications),
      services: ordered('services', svc.services),
      testimonials: ordered('testimonials', svc.testimonials),
      blog: crud('blog', svc.blog),
      messages: crud('messages', svc.messages),
    }
  }, [patch])

  const value = useMemo<DataContextValue | null>(() => {
    if (!state.profile || !state.settings) return null
    return {
      status,
      error,
      refresh: load,
      profile: state.profile,
      settings: state.settings,
      skills: state.skills,
      projects: state.projects,
      experience: state.experience,
      education: state.education,
      certifications: state.certifications,
      services: state.services,
      testimonials: state.testimonials,
      blog: state.blog,
      messages: state.messages,
      actions,
    }
  }, [state, status, error, load, actions])

  if (status === 'error') {
    return <BootError message={error} onRetry={load} />
  }
  if (!value) {
    return <BootSplash />
  }
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within a DataProvider')
  return ctx
}

/* ── Boot visuals (pre-router, so no shared layout available) ─── */
function BootSplash() {
  return (
    <div className="grid min-h-screen place-items-center bg-background bg-radial-accent px-6 text-center">
      <div>
        <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="text-sm text-muted">Loading…</p>
      </div>
    </div>
  )
}

function BootError({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div className="max-w-sm">
        <h1 className="font-display text-xl font-semibold text-foreground">
          Couldn’t load your data
        </h1>
        <p className="mt-2 text-sm text-muted">{message ?? 'An unexpected error occurred.'}</p>
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
