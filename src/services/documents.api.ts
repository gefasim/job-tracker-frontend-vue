import { httpClient } from './http-client'
import type { Document } from '@/types/dtos/document.dto'

export const documentApi = {
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

    const response = await httpClient.post<Document>(`/documents/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async update(documentId: string, document: Document, file: File | null): Promise<Document> {
    const formData = new FormData()
    formData.append('title', document.title)
    formData.append('category', document.category)
    if (file) formData.append('file', file)
    if (document.description) formData.append('description', document.description)
    const response = await httpClient.patch<Document>(`/documents/${documentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async assignJobApplication(documentId: string, jobId: string): Promise<void> {
    await httpClient.post(`/documents/${documentId}/job-application/${jobId}/attach`, {
      documentId,
      jobId,
    })
  },

  async unassignJobApplication(documentId: string, jobId: string): Promise<void> {
    await httpClient.post(`/documents/${documentId}/job-application/${jobId}/detach`, {
      documentId,
      jobId,
    })
  },

  async delete(documentId: string): Promise<void> {
    await httpClient.delete(`/documents/${documentId}`)
  },
}
