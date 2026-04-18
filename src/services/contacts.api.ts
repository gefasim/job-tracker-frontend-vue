import { httpClient } from './http-client'
import type { Contact } from '@/types/dtos/contact.dto'

export const contactApi = {
  async get(boardId: string, contactId: string): Promise<Contact> {
    const response = await httpClient.get<Contact>(`/contacts`, { params: { boardId, contactId } })
    return response.data
  },

  async getAll(boardId: string): Promise<Contact[]> {
    const response = await httpClient.get<Contact[]>(`/contacts`, { params: { boardId } })
    return response.data
  },

  async create(contact: Contact): Promise<Contact> {
    const response = await httpClient.post<Contact>(`/contacts`, contact)
    return response.data
  },

  async update(contact: Contact): Promise<Contact> {
    const response = await httpClient.put<Contact>(`/contacts`, contact)
    return response.data
  },

  async assignJobApplication(contactId: string, jobApplicationId: string): Promise<Contact> {
    const response = await httpClient.post<Contact>(`/contacts/jobApplication/assign`, {
      contactId,
      jobApplicationId,
    })
    return response.data
  },

  async unassignJobApplication(contactId: string, jobApplicationId: string): Promise<Contact> {
    const response = await httpClient.delete<Contact>(`/contacts/jobApplication/unassign`, {
      data: { contactId, jobApplicationId },
    })
    return response.data
  },

  // TODO: implement photo update
  //updateContactPhoto(contactId: string, photo: unknown): void
  async delete(contactId: string): Promise<void> {
    await httpClient.delete(`/contacts/${contactId}`)
  },
}
