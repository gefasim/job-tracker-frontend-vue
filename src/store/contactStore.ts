import { ref } from 'vue'
import type { Contact } from '@/models/contact.dto'
import { api } from '@/api/api'
import { loadFromCache, saveToCache, updateItemInStore, removeItemFromStore } from '@/utils/storeUtils'

const STORAGE_KEY = 'contacts'
const CACHE_DURATION = 1 * 60 * 60 * 1000 // 1 hour in milliseconds

const contactsPerBoard = ref<Record<string, Contact[]>>({})
let isFetched = false

const save = () => saveToCache(STORAGE_KEY, contactsPerBoard.value)

const fetchContacts = async (boardId: string) => {
  if (isFetched) return
  try {
    const cachedContacts = loadFromCache<Record<string, Contact[]>>(STORAGE_KEY, CACHE_DURATION)
    if (cachedContacts && cachedContacts[boardId]) {
      contactsPerBoard.value[boardId] = cachedContacts[boardId]
    }

    const contacts = await api.contacts.getAll(boardId)
    contactsPerBoard.value[boardId] = contacts
    isFetched = true
    save()
    return contacts
  } catch (error) {
    console.error(`Failed to fetch contacts for board ${boardId}:`, error)
    throw error
  }
}

const updateContactInStore = (contact: Contact) => {
  updateItemInStore(contactsPerBoard.value, contact, save)
}

const removeContactFromStore = (contactId: string) => {
  removeItemFromStore(contactsPerBoard.value, contactId, save)
}

/* API methods */
const createContact = async (boardId: string, contact: Contact) => {
  try {
    const newContact = await api.contacts.create(contact)
    if (!contactsPerBoard.value[boardId]) {
      contactsPerBoard.value[boardId] = []
    }
    contactsPerBoard.value[boardId].push(newContact)
    save()
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
  const cachedContacts = loadFromCache<Record<string, Contact[]>>(STORAGE_KEY, CACHE_DURATION)
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
