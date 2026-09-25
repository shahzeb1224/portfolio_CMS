import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks'
import { DEMO_CREDENTIALS } from '@/store/AuthProvider'
import { loginSchema } from '@/schemas'
import { useZodForm } from '@/hooks'
import { toErrorMessage } from '@/lib/errors'
import { Button, Container, FormField, Input } from '@/components/ui'
import { Seo } from '@/components/common/Seo'

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  const { values, setField, errors, validate } = useZodForm(loginSchema, {
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
  })
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  if (isAuthenticated) return <Navigate to={from} replace />

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const parsed = validate()
    if (!parsed) return
    setBusy(true)
    try {
      await login(parsed)
      navigate(from, { replace: true })
    } catch (err) {
      setFormError(toErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background bg-grid px-4">
      <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-60" />
      <Seo title="Admin sign in" noindex />
      <Container width="narrow" className="relative w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-card">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-display text-xl font-semibold text-foreground">Content Studio</h1>
            <p className="mt-1 text-sm text-muted">Sign in to manage your portfolio.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <FormField label="Email" required error={errors.email}>
              <Input
                type="email"
                value={values.email}
                onChange={(e) => setField('email', e.target.value)}
                error={!!errors.email}
                autoComplete="username"
              />
            </FormField>
            <FormField label="Password" required error={errors.password}>
              <Input
                type="password"
                value={values.password}
                onChange={(e) => setField('password', e.target.value)}
                error={!!errors.password}
                autoComplete="current-password"
              />
            </FormField>

            {formError && (
              <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {formError}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={busy} leftIcon={<LogIn className="h-4 w-4" />}>
              Sign in
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-background-elevated p-3 text-xs text-muted">
            <p className="font-medium text-foreground">Demo account</p>
            <p className="mt-1">
              {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
            </p>
            <p className="mt-1 text-faint">Pre-filled above — just click Sign in.</p>
          </div>
        </div>
      </Container>
    </div>
  )
}
