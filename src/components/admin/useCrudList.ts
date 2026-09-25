import { useState } from 'react'
import { useToast } from '@/hooks'
import { toErrorMessage } from '@/lib/errors'

interface CrudActions<T> {
  remove: (id: string) => Promise<void>
  duplicate: (id: string) => Promise<T | null>
}

/**
 * Shared state + handlers for the CRUD list pages (projects, blog): search
 * query, a status filter, duplicate, and a confirm-guarded delete. The editor
 * itself lives on a dedicated route, so this hook stays list-only.
 */
export function useCrudList<T extends { id: string }, F extends string>(
  actions: CrudActions<T>,
  opts: { label: string; initialFilter: F },
) {
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<F>(opts.initialFilter)
  const [pendingDelete, setPendingDelete] = useState<T | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const duplicate = async (id: string) => {
    try {
      await actions.duplicate(id)
      toast.success(`${opts.label} duplicated`)
    } catch (err) {
      toast.error('Could not duplicate', toErrorMessage(err))
    }
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    setDeleteBusy(true)
    try {
      await actions.remove(pendingDelete.id)
      setPendingDelete(null)
      toast.success(`${opts.label} deleted`)
    } catch (err) {
      toast.error('Could not delete', toErrorMessage(err))
    } finally {
      setDeleteBusy(false)
    }
  }

  return {
    query,
    setQuery,
    filter,
    setFilter,
    pendingDelete,
    askDelete: (item: T) => setPendingDelete(item),
    cancelDelete: () => setPendingDelete(null),
    confirmDelete,
    deleteBusy,
    duplicate,
  }
}
