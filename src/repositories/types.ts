/**
 * Repository contracts. The UI depends only on these interfaces, never on a
 * concrete implementation. Today they are backed by localStorage
 * (`repositories/mock`); tomorrow by the Express REST API (`repositories/api`).
 * Swapping one for the other must not touch a single component.
 */
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

export interface ReadRepository<T> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | null>
}

export interface CrudRepository<T, C, U> extends ReadRepository<T> {
  create(data: C): Promise<T>
  update(id: string, data: U): Promise<T>
  delete(id: string): Promise<void>
}

/** For entities that are edited in place (there is exactly one). */
export interface SingletonRepository<T, U> {
  get(): Promise<T>
  update(data: U): Promise<T>
}

export interface SlugLookup<T> {
  getBySlug(slug: string): Promise<T | null>
}

export type ProfileRepository = SingletonRepository<Profile, UpdateProfileInput>
export type SettingsRepository = SingletonRepository<SiteSettings, UpdateSettingsInput>

export type SkillRepository = CrudRepository<Skill, CreateSkillInput, UpdateSkillInput>
export interface ProjectRepository
  extends CrudRepository<Project, CreateProjectInput, UpdateProjectInput>,
    SlugLookup<Project> {}
export type ExperienceRepository = CrudRepository<
  Experience,
  CreateExperienceInput,
  UpdateExperienceInput
>
export type EducationRepository = CrudRepository<
  Education,
  CreateEducationInput,
  UpdateEducationInput
>
export type CertificationRepository = CrudRepository<
  Certification,
  CreateCertificationInput,
  UpdateCertificationInput
>
export type ServiceRepository = CrudRepository<Service, CreateServiceInput, UpdateServiceInput>
export type TestimonialRepository = CrudRepository<
  Testimonial,
  CreateTestimonialInput,
  UpdateTestimonialInput
>
export interface BlogRepository
  extends CrudRepository<BlogPost, CreateBlogPostInput, UpdateBlogPostInput>,
    SlugLookup<BlogPost> {}
export type MessageRepository = CrudRepository<
  ContactMessage,
  CreateMessageInput,
  UpdateMessageInput
>

export interface ImageAssetRepository {
  upload(file: File): Promise<string>
  resolve(reference: string): Promise<string>
  remove(reference: string): Promise<void>
  exists(reference: string): Promise<boolean>
  listAllKeys(): Promise<string[]>
}

/** The full set of repositories the app depends on. */
export interface RepositoryRegistry {
  profile: ProfileRepository
  settings: SettingsRepository
  skills: SkillRepository
  projects: ProjectRepository
  experience: ExperienceRepository
  education: EducationRepository
  certifications: CertificationRepository
  services: ServiceRepository
  testimonials: TestimonialRepository
  blog: BlogRepository
  messages: MessageRepository
  assets: ImageAssetRepository
}
