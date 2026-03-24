<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { JobApplication } from '@/models/job-application.dto'
import type { Contact } from '@/models/contact.dto'
import ContactCard from './ContactCard.vue'
import ContactModal from './ContactModal.vue'
import ContactTabIcon from '@/assets/icons/ContactTabIcon.vue'
import LinkContactDropdown from '@/views/Shared/LinkContactDropdown.vue'
import { CurrentBoard } from '@/current-board.service'
import { api } from '@/api/api'

const jobApplication = defineModel<JobApplication>({ required: true })

const isModalOpen = ref(false)
const contactToEdit = ref<Contact | null>(null)

const hasContacts = computed(() => {
  return jobApplication.value.contacts && jobApplication.value.contacts.length > 0
})

const boardContacts = ref<Contact[]>([])
const availableContactsToLink = computed(() => {
  const assignedContactIds = jobApplication.value.contacts?.map((c) => c.id)
  return boardContacts.value.filter((c) => !assignedContactIds!.some((id) => c!.id == id))
})

onMounted(async () => {
  const boardId = CurrentBoard.getBoard()!.id
  boardContacts.value = await api.contacts.getAll(boardId)
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

const handleLinkContact = async (contact: Contact) => {
  await api.contacts.assignJobApplication(contact.id, jobApplication.value.id)
  jobApplication.value.contacts?.push(contact)
}

const handleUnlinkContact = async (contactId: string) => {
  if (confirm('Are you sure you want to unlink this contact from the job?')) {
    await api.contacts.unassignJobApplication(contactId, jobApplication.value.id)
    jobApplication.value.contacts = jobApplication.value.contacts!.filter((c) => c.id !== contactId)
  }
}
</script>

<template>
  <div class="contacts-tab tab-border">
    <div class="tab-header">
      <button class="btn-primary" @click="openCreateModal">Create Contact</button>
      <LinkContactDropdown
        :items="availableContactsToLink"
        @select="handleLinkContact"
      ></LinkContactDropdown>
    </div>

    <div v-if="!hasContacts" class="empty-state">
      <div class="empty-icon-wrapper">
        <ContactTabIcon />
      </div>
      <h2>You have not linked any contacts to this job yet.</h2>
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

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
</style>
