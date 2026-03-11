<script setup lang="ts">
import { ref, computed } from 'vue'
import type { JobApplication } from '@/models/job-application.dto'
import type { Contact } from '@/models/contact.dto'
import ContactCard from './ContactCard.vue'
import ContactModal from './ContactModal.vue'

const jobApplication = defineModel<JobApplication>({ required: true })

const isModalOpen = ref(false)
const contactToEdit = ref<Contact | null>(null)

const hasContacts = computed(() => {
  return jobApplication.value.contacts && jobApplication.value.contacts.length > 0
})

const openCreateModal = () => {
  contactToEdit.value = null
  isModalOpen.value = true
}

const openEditModal = (contact: Contact) => {
  contactToEdit.value = JSON.parse(JSON.stringify(contact))
  isModalOpen.value = true
}

const handleSaveContact = (savedContact: Contact) => {
  if (!jobApplication.value.contacts) jobApplication.value.contacts = []

  const index = jobApplication.value.contacts.findIndex((c) => c.id === savedContact.id)
  if (index !== -1) {
    jobApplication.value.contacts[index] = savedContact
  } else {
    jobApplication.value.contacts.push(savedContact)
  }
  isModalOpen.value = false
}

const handleUnlinkContact = (contactId: string) => {
  if (confirm('Are you sure you want to unlink this contact from the job?')) {
    jobApplication.value.contacts = jobApplication.value.contacts!.filter((c) => c.id !== contactId)
  }
}
</script>

<template>
  <div class="contacts-tab">
    <div v-if="hasContacts" class="tab-header">
      <button class="btn-primary" @click="openCreateModal">+ Create Contact</button>
      <button class="btn-outline">+ Link Contact</button>
    </div>

    <div v-if="!hasContacts" class="empty-state">
      <div class="empty-icon-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <h2>You have not linked any contacts to this job yet.</h2>
      <div class="empty-actions">
        <button class="btn-primary" @click="openCreateModal">+ Create Contact</button>
        <button class="btn-outline">+ Link Contact</button>
      </div>
    </div>

    <div v-else class="contacts-grid">
      <ContactCard
        v-for="contact in jobApplication.contacts"
        :key="contact.id"
        :contact="contact"
        @edit="openEditModal"
        @unlink="handleUnlinkContact"
      />
    </div>

    <Teleport to="body">
      <ContactModal
        v-if="isModalOpen"
        :contact="contactToEdit"
        :job-title="jobApplication.title"
        @close="isModalOpen = false"
        @save="handleSaveContact"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.contacts-tab {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.tab-header {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}
.empty-icon-wrapper {
  color: #202124;
  margin-bottom: 24px;
}
.empty-state h2 {
  color: #5f6368;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 32px;
}
.empty-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* Загальні стилі кнопок */
.btn-primary {
  background: #4285f4;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #3367d6;
}
.btn-outline {
  background: white;
  color: #202124;
  border: 1px dashed #dadce0;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.btn-outline:hover {
  background: #f8f9fa;
}
</style>
