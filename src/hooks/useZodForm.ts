import { useState, useCallback } from 'react'
import type { z } from 'zod'

type Errors = Record<string, string>

/**
 * Minimal Zod-backed form state: holds values, validates on demand, and maps
 * Zod issues to dot-path error keys (e.g. "seo.metaTitle"). Keeps admin forms
 * dependency-free while still getting real schema validation.
 */
export function useZodForm<S extends z.ZodType>(schema: S, initial: z.input<S>) {
  const [values, setValues] = useState<z.input<S>>(initial)
  const [errors, setErrors] = useState<Errors>({})

  const setField = useCallback(<K extends keyof z.input<S>>(name: K, value: z.input<S>[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name as string]) return prev
      const next = { ...prev }
      delete next[name as string]
      return next
    })
  }, [])

  const patch = useCallback((partial: Partial<z.input<S>>) => {
    setValues((prev) => ({ ...prev, ...partial }))
  }, [])

  const validate = useCallback((): z.output<S> | null => {
    const result = schema.safeParse(values)
    if (result.success) {
      setErrors({})
      return result.data
    }
    const mapped: Errors = {}
    for (const issue of result.error.issues) {
      const key = issue.path.join('.')
      if (!mapped[key]) mapped[key] = issue.message
    }
    setErrors(mapped)
    return null
  }, [schema, values])

  const reset = useCallback((next?: z.input<S>) => {
    setValues(next ?? initial)
    setErrors({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { values, setValues, setField, patch, errors, setErrors, validate, reset }
}
