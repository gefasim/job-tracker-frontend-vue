import axios from 'axios'
import type { JobApplication } from '../models/job-application.dto'
import type { JobApplicationsService } from './job-applications.service.interface'
import type { BoardsService } from './boards.service.interface'
import type { Board } from '@/models/board.dto'
import type { AuthService } from './auth.service.interface'
import type { User } from '@/models/user.dto'
import type { JobApplicationNotesService } from './job-notes.service.interface'
import type { JobApplicationNote } from '@/models/job-application-note.dto'
import type { ContactsService } from './contacts.service.interface'
import type { Contact } from '@/models/contact.dto'
import type { DocumentsService } from './documents.service.interface'
import type { Document } from '@/models/document.dto'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// interceptors for expired JWT ACCESS_TOKEN
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Checks if it is a 401 error, and if we have not already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await axios.post(
          import.meta.env.VITE_API_URL + '/auth/refresh',
          {},
          { withCredentials: true },
        )

        return httpClient(originalRequest)
      } catch (refreshError) {
        // TODO: verify with JWT with 1m expiration time
        console.error('Session ended. Login required.')
        // window.location.href = '/login';
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

const authApi: AuthService = {
  async login(email, password): Promise<User> {
    const response = await httpClient.post(`/auth/login`, { email, password })
    return response.data
  },
}

const boardApi: BoardsService = {
  async getAll(): Promise<Board[]> {
    const response = await httpClient.get<Board[]>(`/boards`)
    return response.data
  },
  async get(boardId: string): Promise<Board> {
    const response = await httpClient.get<Board>(`/boards/${boardId}`)
    return response.data
  },
}

const jobApplicationApi: JobApplicationsService = {
  async update(data: JobApplication): Promise<JobApplication> {
    const response = await httpClient.put<JobApplication>(`/job-applications/${data.id}`, data)
    return response.data
  },
  async updatePartial(id: string, data: JobApplication): Promise<JobApplication> {
    const response = await httpClient.patch<JobApplication>(`/job-applications/${id}`, data)
    return response.data
  },
}

const jobApplicationNoteApi: JobApplicationNotesService = {
  async get(jobId: string): Promise<JobApplicationNote> {
    const response = await httpClient.get<JobApplicationNote>(`/job-application-notes/${jobId}`)
    return response.data
  },
  async create(jobId: string, content: string): Promise<JobApplicationNote> {
    const response = await httpClient.post<JobApplicationNote>(`/job-application-notes`, {
      content,
      jobApplicationId: jobId,
    })
    return response.data
  },
  async update(jobId: string, content: string): Promise<JobApplicationNote> {
    const response = await httpClient.put<JobApplicationNote>(`/job-application-notes/${jobId}`, {
      content,
    })
    return response.data
  },
  async delete(noteId: string): Promise<void> {
    await httpClient.delete<JobApplicationNote>(`/job-application-notes/${noteId}`)
  },
}

const contactApi: ContactsService = {
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
  async assignJobApplication(contactId: string, jobApplicationId: string): Promise<void> {
    await httpClient.post(`/contacts/jobApplication/assign`, {
      contactId,
      jobApplicationId,
    })
  },
  async unassignJobApplication(contactId: string, jobApplicationId: string): Promise<void> {
    await httpClient.delete(`/contacts/jobApplication/unassign`, {
      data: { contactId, jobApplicationId },
    })
  },
  // TODO: implement photo update
  //updateContactPhoto(contactId: string, photo: unknown): void
  async delete(contactId: string): Promise<void> {
    await httpClient.delete(`/contacts/${contactId}`)
  },
}

const documentApi: DocumentsService = {
  async get(documentId: string): Promise<Document> {
    const response = await httpClient.get<Document>(`/documents/${documentId}`)
    return response.data
  },
  async getAll(boardId: string): Promise<Document[]> {
    const response = await httpClient.get<Document[]>(`/documents/board/${boardId}`)
    return response.data
  },
  async create(boardId: string, file: File, document: Document): Promise<Document> {
    const formData = new FormData()
    formData.append('title', document.title)
    formData.append('category', document.category)
    formData.append('boardId', boardId)
    formData.append('file', file)
    if (document.description) formData.append('description', document.description)
    debugger
    const response = await httpClient.post<Document>(`/documents/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  async update(file: File, document: Document): Promise<Document> {
    const formData = new FormData()
    formData.append('title', document.title)
    formData.append('category', document.category)
    formData.append('file', file)
    if (document.description) formData.append('description', document.description)
    const response = await httpClient.put<Document>(`/documents/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  async assignJobApplication(documentId: string, jobId: string): Promise<void> {
    await httpClient.post(`/documents/${documentId}/jobApplication/${jobId}/attach`, {
      documentId,
      jobId,
    })
  },
  async unassignJobApplication(documentId: string, jobId: string): Promise<void> {
    await httpClient.post(`/documents/${documentId}/jobApplication/${jobId}/detach`, {
      documentId,
      jobId,
    })
  },
  async delete(documentId: string): Promise<void> {
    await httpClient.delete(`/documents/${documentId}`)
  },
}

export const api = {
  auth: authApi,
  boards: boardApi,
  jobs: jobApplicationApi,
  jobNotes: jobApplicationNoteApi,
  contacts: contactApi,
  documents: documentApi,
}
