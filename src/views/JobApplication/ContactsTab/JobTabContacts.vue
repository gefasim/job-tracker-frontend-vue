<script setup lang="ts">
import { ref, computed } from 'vue'
import type { JobApplication } from '@/models/job-application.dto'
import type { Contact } from '@/models/contact.dto'
import ContactModal from './ContactModal.vue'
import LinkContactDropdown from '@/views/Shared/LinkContactDropdown.vue'
import { useRoute } from 'vue-router'
import ContactGrid from './ContactGrid.vue'
import { useContacts } from '@/store/contactStore'

const jobApplication = defineModel<JobApplication>({ required: true })
const { contactsPerBoard, assignJobApplication, unassignJobApplication } = useContacts()
const route = useRoute()

const isModalOpen = ref(false)
const contactToEdit = ref<Contact | null>(null)

const boardId = route.params.boardId as string
const availableContactsToLink = computed(() => {
  if (!contactsPerBoard.value[boardId]) return []
  const assignedContactIds = jobApplication.value.contacts?.map((c) => c.id)
  return contactsPerBoard.value[boardId].filter(
    (c) => !assignedContactIds!.some((id) => c!.id == id),
  )
})

const openCreateModal = () => {
  contactToEdit.value = null
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
  await assignJobApplication(contact.id, jobApplication.value.id)
  jobApplication.value.contacts?.push(contact)
}

const handleUnlinkContact = async (contactId: string) => {
  if (confirm('Are you sure you want to unlink this contact from the job?')) {
    await unassignJobApplication(contactId, jobApplication.value.id)
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

    <ContactGrid
      :contacts="jobApplication.contacts || []"
      :boardId="boardId"
      :jobApplication="jobApplication"
      :showUnlinkButton="true"
      :showDeleteButton="false"
      noContactsMessage="You have not linked any contacts to this job yet."
      @save="handleSaveContact"
      @unlink="handleUnlinkContact"
    ></ContactGrid>
    <Teleport to="body">
      <ContactModal
        v-if="isModalOpen"
        :contact="contactToEdit"
        :jobApplication="jobApplication"
        :boardId="boardId"
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
