import { ref } from 'vue'
import type { Document } from '@/models/document.dto'
import { api } from '@/api/api'

const STORAGE_KEY = 'documents-per-board'
const CACHE_DURATION = 1 * 60 * 60 * 1000 // 1 hour in milliseconds
const documentsByBoard = ref<Record<string, Document[]>>({})
let isFetched = false

const loadFromCache = (): Record<string, Document[]> | null => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return data as Record<string, Document[]>
  } catch (error) {
    console.error('Failed to load documents from cache:', error)
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const saveToCache = () => {
  const docs = documentsByBoard.value
  if (docs) {
    localStorage.setItem(`${STORAGE_KEY}`, JSON.stringify(docs))
  }
}

const updateDocumentInStore = (document: Document) => {
  let found = false
  for (const boardId in documentsByBoard.value) {
    const docs = documentsByBoard.value[boardId]
    if (!docs) continue
    const index = docs.findIndex((d) => d.id === document.id)
    if (index !== -1) {
      docs[index] = document
      found = true
      saveToCache()
      break
    }
  }

  // If not found in any existing lists, but the document has a board ID, add it
  // Assuming the Document has a board property from dto
  if (!found && document.board?.id) {
    const boardId = document.board.id
    if (documentsByBoard.value[boardId]) {
      documentsByBoard.value[boardId].push(document)
      saveToCache()
    }
  }
}

const removeDocumentFromStore = (documentId: string) => {
  for (const boardId in documentsByBoard.value) {
    const docs = documentsByBoard.value[boardId]
    if (!docs) continue
    const index = docs.findIndex((d) => d.id === documentId)
    if (index !== -1) {
      docs.splice(index, 1)
      saveToCache()
      break
    }
  }
}

const fetchDocuments = async (boardId: string) => {
  if (isFetched) return
  try {
    const cachedDocs = localStorage.getItem(`${STORAGE_KEY}${boardId}`)
    if (cachedDocs) {
      documentsByBoard.value[boardId] = JSON.parse(cachedDocs)
    }

    const docs = await api.documents.getAll(boardId)
    documentsByBoard.value[boardId] = docs
    isFetched = true
    saveToCache()
    return docs
  } catch (error) {
    console.error(`Failed to fetch documents for board ${boardId}:`, error)
    throw error
  }
}

const getDocument = async (documentId: string) => {
  try {
    const doc = await api.documents.get(documentId)
    updateDocumentInStore(doc)
    return doc
  } catch (error) {
    console.error(`Failed to get document ${documentId}:`, error)
    throw error
  }
}

const createDocument = async (boardId: string, file: File, document: Document) => {
  try {
    const newDoc = await api.documents.create(boardId, file, document)
    if (!documentsByBoard.value[boardId]) {
      documentsByBoard.value[boardId] = []
    }
    documentsByBoard.value[boardId].push(newDoc)
    saveToCache()
    return newDoc
  } catch (error) {
    console.error('Failed to create document:', error)
    throw error
  }
}

const updateDocument = async (documentId: string, document: Document, file: File | null) => {
  try {
    const updatedDoc = await api.documents.update(documentId, document, file)
    updateDocumentInStore(updatedDoc)
    return updatedDoc
  } catch (error) {
    console.error(`Failed to update document ${documentId}:`, error)
    throw error
  }
}

const deleteDocument = async (documentId: string) => {
  try {
    await api.documents.delete(documentId)
    removeDocumentFromStore(documentId)
  } catch (error) {
    console.error(`Failed to delete document ${documentId}:`, error)
    throw error
  }
}

const assignJobApplication = async (documentId: string, jobId: string) => {
  try {
    await api.documents.assignJobApplication(documentId, jobId)
    const updatedDoc = await api.documents.get(documentId)
    updateDocumentInStore(updatedDoc)
  } catch (error) {
    console.error(`Failed to assign job application to document ${documentId}:`, error)
    throw error
  }
}

const unassignJobApplication = async (documentId: string, jobId: string) => {
  try {
    await api.documents.unassignJobApplication(documentId, jobId)
    const updatedDoc = await api.documents.get(documentId)
    updateDocumentInStore(updatedDoc)
  } catch (error) {
    console.error(`Failed to unassign job application from document ${documentId}:`, error)
    throw error
  }
}

export const useDocumentStore = () => {
  const cachedDocuments = loadFromCache()
  if (cachedDocuments) {
    documentsByBoard.value = cachedDocuments
  }

  return {
    documentsByBoard,
    fetchDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    assignJobApplication,
    unassignJobApplication,
  }
}
