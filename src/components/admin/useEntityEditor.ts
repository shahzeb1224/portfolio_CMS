import { useState } from 'react'

/**
 * Modal editor + delete-confirm state for a list screen. `editing === null`
 * while the modal is open means "create"; a value means "edit that row".
 */
export function useEntityEditor<T>() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [deleting, setDeleting] = useState<T | null>(null)

  return {
    open,
    editing,
    deleting,
    openCreate: () => {
      setEditing(null)
      setOpen(true)
    },
    openEdit: (item: T) => {
      setEditing(item)
      setOpen(true)
    },
    close: () => setOpen(false),
    askDelete: (item: T) => setDeleting(item),
    cancelDelete: () => setDeleting(null),
  }
}
