import { useState, type FormEvent } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { useData, useToast, useZodForm } from '@/hooks'
import { publicReviewSchema, type PublicReviewValues } from '@/schemas'
import {
  Button,
  FormField,
  ImageInput,
  Input,
  Modal,
  Textarea,
} from '@/components/ui'

const INITIAL_VALUES: PublicReviewValues = {
  title: '',
  description: '',
  projectUrl: '',
  screenshotUrl: '',
}

interface ReviewModalProps {
  open: boolean
  onClose: () => void
}

export function ReviewModal({ open, onClose }: ReviewModalProps) {
  const { actions } = useData()
  const toast = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { values, setField, errors, validate, reset } = useZodForm(
    publicReviewSchema,
    INITIAL_VALUES,
  )

  const handleClose = () => {
    if (submitting) return
    onClose()
    setTimeout(() => {
      reset(INITIAL_VALUES)
      setSubmitted(false)
      setSubmitting(false)
    }, 200)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const validated = validate()
    if (!validated) return

    setSubmitting(true)
    try {
      await actions.testimonials.create({
        clientName: validated.title,
        clientPhoto: '',
        position: '',
        company: '',
        testimonial: validated.description,
        rating: 5,
        projectId: null,
        featured: false,
        published: false,
        status: 'pending',
        title: validated.title,
        projectUrl: validated.projectUrl?.trim() || undefined,
        screenshots: validated.screenshotUrl?.trim() ? [validated.screenshotUrl.trim()] : [],
      })

      setSubmitted(true)
      toast.success(
        'Review submitted for approval',
        'Thank you! Your feedback has been received and will appear on the site once approved by the admin.',
      )
    } catch {
      toast.error('Submission failed', 'Could not submit your review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title={submitted ? 'Thank you for your review!' : 'Leave a Review'}
      description={
        submitted
          ? 'Your review has been submitted for moderation.'
          : 'Share your feedback on our collaboration. Reviews are moderated before appearing publicly.'
      }
    >
      {submitted ? (
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            Feedback received
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            Thank you for taking the time to write a review. To maintain high credibility and prevent spam, reviews are queued for moderation and will be published once approved.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField
            label="Review Title"
            required
            error={errors.title}
            hint="A concise summary of your experience (e.g. 'Delivered robust full-stack features ahead of schedule')."
          >
            <Input
              value={values.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="e.g. Exceptional product engineering and speed"
              maxLength={100}
              error={!!errors.title}
              disabled={submitting}
              autoFocus
            />
          </FormField>

          <FormField
            label="Review Description"
            required
            error={errors.description}
            hint="Detailed feedback about the collaboration, communication, and results (10 to 2,000 characters)."
          >
            <Textarea
              rows={4}
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Share what it was like working together, key deliverables, and outcomes…"
              maxLength={2000}
              error={!!errors.description}
              disabled={submitting}
            />
          </FormField>

          <FormField
            label="Project Link"
            error={errors.projectUrl}
            hint="Optional. Live project, case study, or repository URL."
          >
            <Input
              type="url"
              value={values.projectUrl ?? ''}
              onChange={(e) => setField('projectUrl', e.target.value)}
              placeholder="https://example.com"
              error={!!errors.projectUrl}
              disabled={submitting}
            />
          </FormField>

          <div className="space-y-1">
            <ImageInput
              label="Screenshot"
              hint="Optional. Image URL of the project or deliverables."
              aspect="video"
              value={values.screenshotUrl ?? ''}
              onChange={(v) => setField('screenshotUrl', v)}
            />
            {errors.screenshotUrl && (
              <p className="text-xs text-danger">{errors.screenshotUrl}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={submitting}
              leftIcon={<Send className="h-4 w-4" />}
            >
              {submitting ? 'Submitting…' : 'Submit review'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
