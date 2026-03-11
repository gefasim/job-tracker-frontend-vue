import type { Contact } from '@/models/contact.dto'

export interface ContactsService {
  get(boardId: string, contactId: string): Promise<Contact>
  getAll(boardId: string): Promise<Contact[]>
  create(contact: Contact): Promise<Contact>
  update(contact: Contact): Promise<Contact>
  assignJobApplication(contactId: string, jobId: string): void
  unassignJobApplication(contactId: string, jobId: string): void
  // TODO: implement photo update
  //updateContactPhoto(contactId: string, photo: unknown): void
  delete(contactId: string): void
}
