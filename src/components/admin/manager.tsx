import { useMemo, useState, type ReactNode } from 'react'
import { Plus } from 'lucide-react'
import {
  Button,
  ConfirmDialog,
  EmptyState,
  Modal,
} from '@/components/ui'
import { useToast } from '@/hooks'
import { toErrorMessage } from '@/lib/errors'
import { reorderIds } from '@/lib/reorder'
import { AdminHeader, Toolbar } from './kit'
import { ListRow, ListShell, RowActions } from './list'
import { useEntityEditor } from './useEntityEditor'

interface OrderedManagerProps<T extends { id: string; sortOrder: number }> {
  title: string
  description?: string
  addLabel: string
  items: T[]
  reorder: (orderedIds: string[]) => Promise<void>
  remove: (id: string) => Promise<void>
  duplicate?: (id: string) => Promise<unknown>
  /** Return true if `item` matches the lowercased query. Omit to hide search. */
  search?: (item: T, query: string) => boolean
  renderRow: (item: T) => ReactNode
  renderEditor: (args: { editing: T | null; onDone: () => void }) => ReactNode
  modalTitle: (editing: T | null) => string
  modalSize?: 'sm' | 'md' | 'lg' | 'xl'
  deleteLabel?: (item: T) => string
  empty: { icon?: ReactNode; title: string; description?: string }
}

export function OrderedManager<T extends { id: string; sortOrder: number }>({
  title,
  description,
  addLabel,
  items,
  reorder,
  remove,
  duplicate,
  search,
  renderRow,
  renderEditor,
  modalTitle,
  modalSize = 'lg',
  deleteLabel,
  empty,
}: OrderedManagerProps<T>) {
  const editor = useEntityEditor<T>()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [deleteBusy, setDeleteBusy] = useState(false)

  const filtered = useMemo(() => {
    if (!search || !query.trim()) return items
    const q = query.trim().toLowerCase()
    return items.filter((item) => search(item, q))
  }, [items, search, query])

  const canReorder = !query.trim()

  const onReorder = async (id: string, dir: -1 | 1) => {
    try {
      await reorder(reorderIds(items, id, dir))
    } catch (err) {
      toast.error('Could not reorder', toErrorMessage(err))
    }
  }

  const onDuplicate = async (id: string) => {
    if (!duplicate) return
    try {
      await duplicate(id)
      toast.success('Duplicated')
    } catch (err) {
      toast.error('Could not duplicate', toErrorMessage(err))
    }
  }

  const onConfirmDelete = async () => {
    if (!editor.deleting) return
    setDeleteBusy(true)
    try {
      await remove(editor.deleting.id)
      toast.success('Deleted')
      editor.cancelDelete()
    } catch (err) {
      toast.error('Could not delete', toErrorMessage(err))
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <>
      <AdminHeader
        title={title}
        description={description}
        action={
          <Button onClick={editor.openCreate} leftIcon={<Plus className="h-4 w-4" />}>
            {addLabel}
          </Button>
        }
      />

      {search && <Toolbar search={query} onSearch={setQuery} placeholder={`Search ${title.toLowerCase()}…`} />}

      {filtered.length > 0 ? (
        <ListShell>
          {filtered.map((item, i) => (
            <ListRow key={item.id}>
              <div className="min-w-0 flex-1">{renderRow(item)}</div>
              <RowActions
                reorder={
                  canReorder
                    ? {
                        onUp: () => onReorder(item.id, -1),
                        onDown: () => onReorder(item.id, 1),
                        canUp: i > 0,
                        canDown: i < filtered.length - 1,
                      }
                    : undefined
                }
                onEdit={() => editor.openEdit(item)}
                onDuplicate={duplicate ? () => onDuplicate(item.id) : undefined}
                onDelete={() => editor.askDelete(item)}
              />
            </ListRow>
          ))}
        </ListShell>
      ) : (
        <EmptyState
          icon={empty.icon}
          title={query ? 'No matches' : empty.title}
          description={query ? 'Try a different search.' : empty.description}
          action={
            !query ? (
              <Button onClick={editor.openCreate} leftIcon={<Plus className="h-4 w-4" />}>
                {addLabel}
              </Button>
            ) : undefined
          }
        />
      )}

      <Modal open={editor.open} onClose={editor.close} title={modalTitle(editor.editing)} size={modalSize}>
        {editor.open && renderEditor({ editing: editor.editing, onDone: editor.close })}
      </Modal>

      <ConfirmDialog
        open={!!editor.deleting}
        onClose={editor.cancelDelete}
        onConfirm={onConfirmDelete}
        loading={deleteBusy}
        title="Delete this item?"
        description={
          editor.deleting && deleteLabel
            ? `“${deleteLabel(editor.deleting)}” will be permanently removed. This cannot be undone.`
            : 'This action cannot be undone.'
        }
        confirmLabel="Delete"
      />
    </>
  )
}
