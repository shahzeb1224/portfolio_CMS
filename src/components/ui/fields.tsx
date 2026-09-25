import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import {
  ArrowDown,
  ArrowUp,
  ImageIcon,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useResolvedImage } from '@/hooks/useResolvedImage'
import { imageAssetService } from '@/services/imageAssetService'
import { Button } from './button'
import { Input, Label } from './form'
import { AppImage } from './AppImage'

/* ── ImageInput: Computer File Upload + Drag & Drop + URL fallback + Live Preview ── */
export interface ImageInputProps {
  value?: string
  onChange: (value: string) => void
  label?: string
  hint?: string
  aspect?: 'video' | 'square' | 'wide'
  className?: string
  error?: string
}

const ASPECT: Record<NonNullable<ImageInputProps['aspect']>, string> = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[3/1]',
}

export function ImageInput({
  value = '',
  onChange,
  label,
  hint,
  aspect = 'video',
  className,
  error: externalError,
}: ImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [broken, setBroken] = useState(false)

  const { src: resolvedSrc, loading: resolving } = useResolvedImage(value)

  // Reset errors and broken state when value changes
  useEffect(() => {
    setBroken(false)
    setUploadError(null)
  }, [value])

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    setUploading(true)
    setUploadError(null)

    try {
      const assetRef = await imageAssetService.upload(file)
      onChange(assetRef)
      setBroken(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process image.'
      setUploadError(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    void handleFiles(e.target.files)
  }

  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!uploading) setIsDragging(true)
  }

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (!uploading && e.dataTransfer.files) {
      void handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemove = () => {
    onChange('')
    setUploadError(null)
    setBroken(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const displayError = uploadError || externalError
  const hasValue = Boolean(value && !broken)

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <Label>{label}</Label>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {/* Preview swatch / Dropzone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            'group relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-surface-2 transition-all sm:w-44',
            ASPECT[aspect],
            isDragging
              ? 'border-accent bg-accent-soft/20 shadow-sm'
              : 'border-border',
          )}
        >
          {resolving || uploading ? (
            <div className="flex flex-col items-center justify-center gap-2 p-3 text-center text-xs text-muted">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
              <span>{uploading ? 'Processing…' : 'Loading…'}</span>
            </div>
          ) : hasValue ? (
            <img
              src={resolvedSrc || value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={() => setBroken(true)}
            />
          ) : (
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-3 text-center text-xs text-faint transition-colors hover:bg-surface hover:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Upload image from computer"
            >
              <Upload className="h-6 w-6 text-muted" />
              <span className="font-medium">Choose file</span>
              <span className="text-[10px] text-faint sm:hidden md:inline">or drag & drop</span>
            </button>
          )}

          {/* Dragging overlay */}
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-accent/20 backdrop-blur-xs">
              <p className="text-xs font-semibold text-accent">Drop image here</p>
            </div>
          )}
        </div>

        {/* Controls and URL support */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={onFileInputChange}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={uploading}
              disabled={uploading}
              leftIcon={hasValue ? <RefreshCw className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
              onClick={() => fileInputRef.current?.click()}
            >
              {hasValue ? 'Replace image' : 'Upload from computer'}
            </Button>

            {hasValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={uploading}
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                className="text-muted hover:text-danger"
                onClick={handleRemove}
                aria-label="Remove image"
              >
                Remove
              </Button>
            )}

            <button
              type="button"
              onClick={() => setShowUrlInput((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
            >
              <Link2 className="h-3 w-3" />
              {showUrlInput ? 'Hide URL' : 'Use image URL'}
            </button>
          </div>

          {/* Optional manual URL input */}
          {showUrlInput && (
            <div className="mt-1 flex flex-col gap-1">
              <Input
                value={value.startsWith('asset://') ? '' : value}
                placeholder="https://example.com/image.jpg"
                onChange={(e) => {
                  setBroken(false)
                  setUploadError(null)
                  onChange(e.target.value)
                }}
              />
              <p className="text-[11px] text-faint">
                Paste a direct image link (JPEG, PNG, WebP, GIF) or upload a file above.
              </p>
            </div>
          )}

          {/* Information & Error message */}
          {displayError ? (
            <p className="text-xs font-medium text-danger">{displayError}</p>
          ) : (
            <p className="text-xs text-faint">
              {hint ?? 'Supports JPEG, PNG, WebP, and GIF up to 5 MB.'}
            </p>
          )}

          {value && value.startsWith('asset://') && (
            <p className="truncate text-[11px] text-faint">
              Stored locally as: <code className="rounded bg-surface-2 px-1 py-0.5">{value}</code>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── GalleryImageInput: Multiple image uploads + previews + reorder + URL support ── */
export interface GalleryImageInputProps {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  hint?: string
  addLabel?: string
  aspect?: 'video' | 'square' | 'wide'
  className?: string
}

export function GalleryImageInput({
  value,
  onChange,
  label,
  hint,
  addLabel = 'Add images',
  aspect = 'video',
  className,
}: GalleryImageInputProps) {
  const multiFileInputRef = useRef<HTMLInputElement>(null)
  const replaceFileInputRef = useRef<HTMLInputElement>(null)
  const replaceIndexRef = useRef<number>(-1)

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUrlAdd, setShowUrlAdd] = useState(false)
  const [urlDraft, setUrlDraft] = useState('')

  const handleUploadMultiple = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)

    const newRefs: string[] = []
    let failedCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const ref = await imageAssetService.upload(file)
        newRefs.push(ref)
      } catch (err) {
        failedCount++
        console.error('Gallery image upload failed:', err)
      }
    }

    if (newRefs.length > 0) {
      onChange([...value, ...newRefs])
    }

    if (failedCount > 0) {
      setError(
        failedCount === files.length
          ? 'Failed to upload selected image(s). Ensure valid format and size <= 5 MB.'
          : `${failedCount} image(s) could not be uploaded due to validation errors.`,
      )
    }

    setUploading(false)
    if (multiFileInputRef.current) multiFileInputRef.current.value = ''
  }

  const handleReplaceFile = async (files: FileList | null) => {
    const idx = replaceIndexRef.current
    if (!files || files.length === 0 || idx < 0 || idx >= value.length) return
    const file = files[0]
    setUploading(true)
    setError(null)

    try {
      const ref = await imageAssetService.upload(file)
      const next = [...value]
      next[idx] = ref
      onChange(next)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to replace image.'
      setError(msg)
    } finally {
      setUploading(false)
      replaceIndexRef.current = -1
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = ''
    }
  }

  const triggerReplace = (index: number) => {
    replaceIndexRef.current = index
    replaceFileInputRef.current?.click()
  }

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return
    const next = [...value]
    const item = next[from]
    next[from] = next[to]
    next[to] = item
    onChange(next)
  }

  const addUrl = () => {
    const trimmed = urlDraft.trim()
    if (!trimmed) return
    onChange([...value, trimmed])
    setUrlDraft('')
    setShowUrlAdd(false)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {label && <Label>{label}</Label>}
        <span className="text-xs text-faint">{value.length} images</span>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={multiFileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => void handleUploadMultiple(e.target.files)}
      />
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => void handleReplaceFile(e.target.files)}
      />

      {/* Gallery list */}
      {value.length > 0 && (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {value.map((src, i) => (
            <div
              key={`gallery-${i}-${src}`}
              className="flex items-center gap-3 p-3 transition-colors hover:bg-surface-2/40"
            >
              {/* Thumbnail preview */}
              <div
                className={cn(
                  'relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2',
                  ASPECT[aspect],
                )}
              >
                <AppImage
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  Image #{i + 1}
                </p>
                <p className="truncate text-[11px] text-faint">
                  {src.startsWith('asset://') ? 'Uploaded asset' : src}
                </p>
              </div>

              {/* Reorder controls */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0 || uploading}
                  aria-label={`Move image ${i + 1} up`}
                  className="text-faint transition-colors hover:text-foreground disabled:opacity-25"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === value.length - 1 || uploading}
                  aria-label={`Move image ${i + 1} down`}
                  className="text-faint transition-colors hover:text-foreground disabled:opacity-25"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Replace button */}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={uploading}
                onClick={() => triggerReplace(i)}
                aria-label={`Replace image ${i + 1}`}
                title="Replace image"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>

              {/* Remove button */}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={uploading}
                onClick={() => removeAt(i)}
                aria-label={`Remove image ${i + 1}`}
                className="text-faint transition-colors hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-xs font-medium text-danger">{error}</p>}

      {/* Add buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={uploading}
          disabled={uploading}
          leftIcon={<Upload className="h-4 w-4" />}
          onClick={() => multiFileInputRef.current?.click()}
        >
          {addLabel}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={uploading}
          leftIcon={<Link2 className="h-4 w-4" />}
          onClick={() => setShowUrlAdd((prev) => !prev)}
        >
          {showUrlAdd ? 'Cancel URL' : 'Add via URL'}
        </Button>
      </div>

      {showUrlAdd && (
        <div className="flex items-center gap-2 pt-1">
          <Input
            value={urlDraft}
            placeholder="https://example.com/screenshot.jpg"
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUrl()
              }
            }}
          />
          <Button type="button" size="sm" onClick={addUrl} disabled={!urlDraft.trim()}>
            Add
          </Button>
        </div>
      )}

      {hint && <p className="text-xs text-faint">{hint}</p>}
    </div>
  )
}

/* ── StringListInput: ordered list of free-text lines with stable ID tracking ── */
interface StringListInputProps {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  placeholder?: string
  addLabel?: string
  reorder?: boolean
}

interface KeyedItem {
  id: string
  text: string
}

let keySeq = 0
function makeStableKey() {
  keySeq += 1
  return `str_item_${keySeq}_${Date.now()}`
}

export function StringListInput({
  value,
  onChange,
  label,
  placeholder = 'Add an item…',
  addLabel = 'Add item',
  reorder = true,
}: StringListInputProps) {
  // Maintain stable IDs across reorders and deletions
  const keysRef = useRef<string[]>([])
  if (keysRef.current.length < value.length) {
    for (let k = keysRef.current.length; k < value.length; k++) {
      keysRef.current.push(makeStableKey())
    }
  } else if (keysRef.current.length > value.length) {
    keysRef.current = keysRef.current.slice(0, value.length)
  }

  const update = (i: number, next: string) => {
    onChange(value.map((v, idx) => (idx === i ? next : v)))
  }

  const remove = (i: number) => {
    keysRef.current.splice(i, 1)
    onChange(value.filter((_, idx) => idx !== i))
  }

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const copyVal = [...value]
    const copyKeys = [...keysRef.current]
    ;[copyVal[i], copyVal[j]] = [copyVal[j], copyVal[i]]
    ;[copyKeys[i], copyKeys[j]] = [copyKeys[j], copyKeys[i]]
    keysRef.current = copyKeys
    onChange(copyVal)
  }

  const addItem = () => {
    keysRef.current.push(makeStableKey())
    onChange([...value, ''])
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label>{label}</Label>}
      <div className="flex flex-col gap-2">
        {value.map((item, i) => (
          <div key={keysRef.current[i] || `item-${i}`} className="flex items-center gap-1.5">
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
            />
            {reorder && (
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-faint transition-colors hover:text-foreground disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  className="text-faint transition-colors hover:text-foreground disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-faint transition-colors hover:bg-danger/10 hover:text-danger"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={addItem}
        >
          {addLabel}
        </Button>
      </div>
    </div>
  )
}

/* ── TagInput: chips added via Enter / comma ── */
interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  placeholder?: string
}

export function TagInput({
  value,
  onChange,
  label,
  placeholder = 'Type and press Enter…',
}: TagInputProps) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const tag = draft.trim().replace(/,$/, '').trim()
    if (tag && !value.includes(tag)) onChange([...value, tag])
    setDraft('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-background-elevated p-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-xs font-medium text-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3 text-faint transition-colors hover:text-danger" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          placeholder={value.length ? '' : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm text-foreground placeholder:text-faint focus-visible:outline-none"
        />
      </div>
    </div>
  )
}
