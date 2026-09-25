import { config } from '@/lib/config'
import { STORAGE_KEYS } from '@/lib/storage'
import {
  makeDefaultProfile,
  makeDefaultSettings,
} from '@/data/seed'
import type {
  Profile,
  UpdateProfileInput,
  SiteSettings,
  UpdateSettingsInput,
  Skill,
  CreateSkillInput,
  UpdateSkillInput,
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
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  ContactMessage,
  CreateMessageInput,
  UpdateMessageInput,
} from '@/types'
import type { RepositoryRegistry } from './types'
import { OrderedMockRepository, MockSingletonRepository } from './mock/base'
import { MockProjectRepository } from './mock/MockProjectRepository'
import { MockBlogRepository } from './mock/MockBlogRepository'
import { MockMessageRepository } from './mock/MockMessageRepository'
import { ApiCrudRepository, ApiSlugCrudRepository, ApiSingletonRepository } from './api/generic'
import { IndexedDbImageAssetRepository } from './mock/IndexedDbImageAssetRepository'
import { ApiImageAssetRepository } from './api/ApiImageAssetRepository'

function createMockRegistry(): RepositoryRegistry {
  return {
    profile: new MockSingletonRepository<Profile, UpdateProfileInput>(
      STORAGE_KEYS.profile,
      makeDefaultProfile,
    ),
    settings: new MockSingletonRepository<SiteSettings, UpdateSettingsInput>(
      STORAGE_KEYS.settings,
      makeDefaultSettings,
    ),
    skills: new OrderedMockRepository<Skill, CreateSkillInput, UpdateSkillInput>(
      STORAGE_KEYS.skills,
      'skill',
      'Skill',
    ),
    projects: new MockProjectRepository(),
    experience: new OrderedMockRepository<Experience, CreateExperienceInput, UpdateExperienceInput>(
      STORAGE_KEYS.experience,
      'exp',
      'Experience',
    ),
    education: new OrderedMockRepository<Education, CreateEducationInput, UpdateEducationInput>(
      STORAGE_KEYS.education,
      'edu',
      'Education',
    ),
    certifications: new OrderedMockRepository<
      Certification,
      CreateCertificationInput,
      UpdateCertificationInput
    >(STORAGE_KEYS.certifications, 'cert', 'Certification'),
    services: new OrderedMockRepository<Service, CreateServiceInput, UpdateServiceInput>(
      STORAGE_KEYS.services,
      'svc',
      'Service',
    ),
    testimonials: new OrderedMockRepository<
      Testimonial,
      CreateTestimonialInput,
      UpdateTestimonialInput
    >(STORAGE_KEYS.testimonials, 'tst', 'Testimonial'),
    blog: new MockBlogRepository(),
    messages: new MockMessageRepository(),
    assets: new IndexedDbImageAssetRepository(),
  }
}

function createApiRegistry(): RepositoryRegistry {
  return {
    profile: new ApiSingletonRepository<Profile, UpdateProfileInput>('profile'),
    settings: new ApiSingletonRepository<SiteSettings, UpdateSettingsInput>('settings'),
    skills: new ApiCrudRepository<Skill, CreateSkillInput, UpdateSkillInput>('skills'),
    projects: new ApiSlugCrudRepository<Project, CreateProjectInput, UpdateProjectInput>('projects'),
    experience: new ApiCrudRepository<Experience, CreateExperienceInput, UpdateExperienceInput>(
      'experience',
    ),
    education: new ApiCrudRepository<Education, CreateEducationInput, UpdateEducationInput>(
      'education',
    ),
    certifications: new ApiCrudRepository<
      Certification,
      CreateCertificationInput,
      UpdateCertificationInput
    >('certifications'),
    services: new ApiCrudRepository<Service, CreateServiceInput, UpdateServiceInput>('services'),
    testimonials: new ApiCrudRepository<
      Testimonial,
      CreateTestimonialInput,
      UpdateTestimonialInput
    >('testimonials'),
    blog: new ApiSlugCrudRepository<BlogPost, CreateBlogPostInput, UpdateBlogPostInput>('blog'),
    messages: new ApiCrudRepository<ContactMessage, CreateMessageInput, UpdateMessageInput>(
      'messages',
    ),
    assets: new ApiImageAssetRepository(),
  }
}

/**
 * The single place the app decides where data comes from. Flip
 * VITE_DATA_SOURCE to "api" (with VITE_API_URL set) and every consumer keeps
 * working unchanged — the critical architectural requirement.
 */
export const repositories: RepositoryRegistry =
  config.dataSource === 'api' && config.apiUrl ? createApiRegistry() : createMockRegistry()

export type { RepositoryRegistry } from './types'
