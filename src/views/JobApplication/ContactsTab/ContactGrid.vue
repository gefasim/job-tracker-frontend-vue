<script setup lang="ts">
import { ref, computed } from 'vue'
import type { JobApplication } from '@/models/job-application.dto'
import type { Contact } from '@/models/contact.dto'
import ContactCard from './ContactCard.vue'
import ContactModal from './ContactModal.vue'
import ContactTabIcon from '@/assets/icons/ContactTabIcon.vue'

const props = defineProps<{
  contacts: Contact[]
  boardId: string
  jobApplication: JobApplication | null
  noContactsMessage: string
  showUnlinkButton: boolean
  showDeleteButton: boolean
}>()
const emit = defineEmits(['unlink', 'delete', 'save'])

const isModalOpen = ref(false)
const contactToEdit = ref<Contact | null>(null)
const contacts = computed(() => props.contacts || [])

const hasContacts = computed(() => {
  return props.contacts && props.contacts.length > 0
})

const openEditModal = (contact: Contact) => {
  contactToEdit.value = { ...contact }
  isModalOpen.value = true
}

const handleSaveContact = (savedContact: Contact) => {
  emit('save', savedContact)
  isModalOpen.value = false
}
</script>
<template>
  <div v-if="!hasContacts" class="empty-state">
    <div class="empty-icon-wrapper">
      <ContactTabIcon />
    </div>
    <h2>{{ props.noContactsMessage }}</h2>
  </div>

  <div v-else class="contacts-grid">
    <ContactCard
      v-for="contact in contacts.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )"
      :key="contact.id"
      :contact="contact"
      :showUnlinkButton="props.showUnlinkButton"
      :showDeleteButton="props.showDeleteButton"
      @edit="openEditModal"
      @unlink="emit('unlink', $event)"
      @delete="emit('delete', $event)"
    />
  </div>

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
</template>
<style scoped>
.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
</style>
