/** Typed application errors so the UI can distinguish failure modes. */

export type AppErrorKind =
  | 'validation'
  | 'not_found'
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'network'
  | 'unknown'

export class AppError extends Error {
  readonly kind: AppErrorKind
  readonly fieldErrors?: Record<string, string>

  constructor(kind: AppErrorKind, message: string, fieldErrors?: Record<string, string>) {
    super(message)
    this.name = 'AppError'
    this.kind = kind
    this.fieldErrors = fieldErrors
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, id?: string) {
    super('not_found', id ? `${entity} "${id}" was not found.` : `${entity} was not found.`)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Please fix the highlighted fields.', fieldErrors?: Record<string, string>) {
    super('validation', message, fieldErrors)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'You need to sign in to continue.') {
    super('unauthorized', message)
    this.name = 'UnauthorizedError'
  }
}

export function toErrorMessage(err: unknown): string {
  if (err instanceof AppError) return err.message
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Something went wrong. Please try again.'
}
