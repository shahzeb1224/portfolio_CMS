import { repositories } from '@/repositories'
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
import {
  CrudService,
  OrderedCrudService,
  SlugCrudService,
  SingletonService,
} from './base'

export const profileService = new SingletonService<Profile, UpdateProfileInput>(
  repositories.profile,
)
export const settingsService = new SingletonService<SiteSettings, UpdateSettingsInput>(
  repositories.settings,
)
export const skillService = new OrderedCrudService<Skill, CreateSkillInput, UpdateSkillInput>(
  repositories.skills,
)
export const projectService = new SlugCrudService<Project, CreateProjectInput, UpdateProjectInput>(
  repositories.projects,
)
export const experienceService = new OrderedCrudService<
  Experience,
  CreateExperienceInput,
  UpdateExperienceInput
>(repositories.experience)
export const educationService = new OrderedCrudService<
  Education,
  CreateEducationInput,
  UpdateEducationInput
>(repositories.education)
export const certificationService = new OrderedCrudService<
  Certification,
  CreateCertificationInput,
  UpdateCertificationInput
>(repositories.certifications)
export const serviceService = new OrderedCrudService<Service, CreateServiceInput, UpdateServiceInput>(
  repositories.services,
)
export const testimonialService = new OrderedCrudService<
  Testimonial,
  CreateTestimonialInput,
  UpdateTestimonialInput
>(repositories.testimonials)
export const blogService = new SlugCrudService<BlogPost, CreateBlogPostInput, UpdateBlogPostInput>(
  repositories.blog,
)
export const messageService = new CrudService<
  ContactMessage,
  CreateMessageInput,
  UpdateMessageInput
>(repositories.messages)

export { imageAssetService, ImageAssetService } from './imageAssetService'
import { imageAssetService } from './imageAssetService'

export const services = {
  profile: profileService,
  settings: settingsService,
  skills: skillService,
  projects: projectService,
  experience: experienceService,
  education: educationService,
  certifications: certificationService,
  services: serviceService,
  testimonials: testimonialService,
  blog: blogService,
  messages: messageService,
  assets: imageAssetService,
} as const

export type Services = typeof services
