import { ref } from 'vue'
import type { Contact } from '@/models/contact.dto'
import { api } from '@/api/api'

const STORAGE_KEY = 'contacts'
const CACHE_DURATION = 1 * 60 * 60 * 1000 // 1 hour in milliseconds

const contactsPerBoard = ref<Record<string, Contact[]>>({})
let isFetched = false

const loadFromCache = (): Record<string, Contact[]> | null => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return data as Record<string, Contact[]>
  } catch (error) {
    console.warn('Failed to load contacts from cache:', error)
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const saveToCache = () => {
  const contacts = contactsPerBoard.value
  if (contacts) {
    const cacheData = {
      data: contacts,
      timestamp: Date.now(),
    }
    localStorage.setItem(`${STORAGE_KEY}`, JSON.stringify(cacheData))
  }
}

const fetchContacts = async (boardId: string) => {
  if (isFetched) return
  try {
    const cachedContacts = loadFromCache()
    if (cachedContacts && cachedContacts[boardId]) {
      contactsPerBoard.value[boardId] = cachedContacts[boardId]
    }

    const contacts = await api.contacts.getAll(boardId)
    contactsPerBoard.value[boardId] = contacts
    isFetched = true
    saveToCache()
    return contacts
  } catch (error) {
    console.error(`Failed to fetch contacts for board ${boardId}:`, error)
    throw error
  }
}

const updateContactInStore = (contact: Contact) => {
  for (const boardId in contactsPerBoard.value) {
    const contacts = contactsPerBoard.value[boardId]
    if (!contacts) continue
    const index = contacts.findIndex((c) => c.id === contact.id)
    if (index !== -1) {
      contacts[index] = contact
      saveToCache()
      break
    }
  }
}

const removeContactFromStore = (contactId: string) => {
  for (const boardId in contactsPerBoard.value) {
    const contacts = contactsPerBoard.value[boardId]
    if (!contacts) continue
    const index = contacts.findIndex((c) => c.id === contactId)
    if (index !== -1) {
      contacts.splice(index, 1)
      saveToCache()
      break
    }
  }
}

/* API methods */
const createContact = async (boardId: string, contact: Contact) => {
  try {
    const newContact = await api.contacts.create(contact)
    if (!contactsPerBoard.value[boardId]) {
      contactsPerBoard.value[boardId] = []
    }
    contactsPerBoard.value[boardId].push(newContact)
    saveToCache()
    return newContact
  } catch (error) {
    console.error(`Failed to create contact for board ${boardId}:`, error)
    throw error
  }
}

const updateContact = async (boardId: string, contact: Contact) => {
  try {
    const updatedContact = await api.contacts.update(contact)
    updateContactInStore(updatedContact)
    return updatedContact
  } catch (error) {
    console.error(`Failed to update contact for board ${boardId}:`, error)
    throw error
  }
}

const assignJobApplication = async (contactId: string, jobApplicationId: string) => {
  try {
    const updatedContact = await api.contacts.assignJobApplication(contactId, jobApplicationId)
    updateContactInStore(updatedContact)
  } catch (error) {
    console.error(`Failed to assign job application to contact ${contactId}:`, error)
    throw error
  }
}

const unassignJobApplication = async (contactId: string, jobApplicationId: string) => {
  try {
    const updatedContact = await api.contacts.unassignJobApplication(contactId, jobApplicationId)
    updateContactInStore(updatedContact)
  } catch (error) {
    console.error(`Failed to unassign job application from contact ${contactId}:`, error)
    throw error
  }
}

const deleteContact = async (boardId: string, contactId: string) => {
  try {
    await api.contacts.delete(contactId)
    removeContactFromStore(contactId)
    return contactId
  } catch (error) {
    console.error(`Failed to delete contact for board ${boardId}:`, error)
    throw error
  }
}

export const useContacts = () => {
  // Load from cache first
  const cachedContacts = loadFromCache()
  if (cachedContacts) {
    contactsPerBoard.value = cachedContacts
  }

  return {
    contactsPerBoard,
    fetchContacts,
    createContact,
    updateContact,
    assignJobApplication,
    unassignJobApplication,
    deleteContact,
  }
}
