<script setup lang="ts">
import { ref, computed } from 'vue'
import type { JobApplication } from '@/models/job-application.dto'
import type { Contact } from '@/models/contact.dto'
import ContactCard from './ContactCard.vue'
import ContactModal from './ContactModal.vue'
import ContactTabIcon from '@/assets/ContactTabIcon.vue'

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
      <button class="btn-primary" @click="openCreateModal">Create Contact</button>
      <button class="btn-outline">Link Contact</button>
    </div>

    <div v-if="!hasContacts" class="empty-state">
      <div class="empty-icon-wrapper">
        <ContactTabIcon />
      </div>
      <h2>You have not linked any contacts to this job yet.</h2>
      <div class="empty-actions">
        <button class="btn-primary" @click="openCreateModal">Create Contact</button>
        <button class="btn-outline">Link Contact</button>
      </div>
    </div>

    <div v-else class="contacts-grid">
      <ContactCard
        v-for="contact in jobApplication.contacts?.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )"
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
        :jobApplication="jobApplication"
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
</style>
