import type { ContactMessage, CreateMessageInput, UpdateMessageInput } from '@/types'
import { STORAGE_KEYS, storage, type StorageAdapter } from '@/lib/storage'
import type { MessageRepository } from '../types'
import { BaseMockRepository } from './base'

type Fields = Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>

export class MockMessageRepository
  extends BaseMockRepository<ContactMessage, CreateMessageInput, UpdateMessageInput>
  implements MessageRepository
{
  constructor(store: StorageAdapter = storage) {
    super(STORAGE_KEYS.messages, 'msg', 'Message', store)
  }

  protected prepareCreate(data: CreateMessageInput): Fields {
    return { ...data, status: data.status ?? 'unread' } as Fields
  }

  /** Newest first for the inbox. */
  protected sort(items: ContactMessage[]): ContactMessage[] {
    return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}
