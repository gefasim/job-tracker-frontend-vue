import type { Document } from '@/models/document.dto'

export interface DocumentsService {
  get(documentId: string): Promise<Document>
  getAll(boardId: string): Promise<Document[]>
  create(boardId: string, file: File, document: Document): Promise<Document>
  update(file: File, contact: Document): Promise<Document>
  assignJobApplication(documentId: string, jobId: string): Promise<void>
  unassignJobApplication(documentId: string, jobId: string): Promise<void>
  delete(documentId: string): Promise<void>
}
