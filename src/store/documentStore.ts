import { ref } from 'vue'
import type { Document } from '@/models/document.dto'
import { api } from '@/api/api'
import {
  loadFromCache,
  saveToCache,
  updateItemInStore,
  removeItemFromStore,
} from '@/utils/storeUtils'

const STORAGE_KEY = 'documents'
const CACHE_DURATION = 1 * 60 * 60 * 1000 // 1 hour in milliseconds
const documentsByBoard = ref<Record<string, Document[]>>({})
const loadedBoardsInThisSession = ref(new Set<string>())

const save = () => saveToCache(STORAGE_KEY, documentsByBoard.value)

const updateDocumentInStore = (document: Document) => {
  updateItemInStore(documentsByBoard.value, document, save)
}

const removeDocumentFromStore = (documentId: string) => {
  removeItemFromStore(documentsByBoard.value, documentId, save)
}

const fetchDocuments = async (boardId: string) => {
  try {
    const cachedDocs = loadFromCache<Record<string, Document[]>>(STORAGE_KEY, CACHE_DURATION)
    if (cachedDocs && cachedDocs[boardId]) {
      documentsByBoard.value[boardId] = cachedDocs[boardId]
    }

    if (documentsByBoard.value[boardId] && loadedBoardsInThisSession.value.has(boardId)) return

    const docs = await api.documents.getAll(boardId)
    documentsByBoard.value[boardId] = docs
    loadedBoardsInThisSession.value.add(boardId)
    save()
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
    save()
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

const clearDocuments = () => {
  documentsByBoard.value = {}
  loadedBoardsInThisSession.value.clear()
  localStorage.removeItem(STORAGE_KEY)
}

export const useDocumentStore = () => {
  const cachedDocuments = loadFromCache<Record<string, Document[]>>(STORAGE_KEY, CACHE_DURATION)
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
    clearDocuments,
  }
}
