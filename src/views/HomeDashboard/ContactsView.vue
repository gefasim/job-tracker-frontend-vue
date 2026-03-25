<script setup lang="ts">
import type { Contact } from '@/models/contact.dto'
import { useBoards } from '@/store/boardStore'
import ContactCard from '@/views/JobApplication/ContactsTab/ContactCard.vue'
import ContactTabIcon from '@/assets/icons/ContactTabIcon.vue'
import { ref, computed, onMounted } from 'vue'

const { boards, fetchBoards } = useBoards()
const contacts = computed<Contact[]>(() => {
  return boards.value
    .flatMap((b) => b.columns)
    .flatMap((c) => c.jobApplications)
    .flatMap((j) => j.contacts || [])
    .filter((contact, index, self) => self.findIndex((c) => c.id === contact.id) === index)
})

const isModalOpen = ref(false)
const contactToEdit = ref<Contact | null>(null)

const hasContacts = computed(() => {
  return (
    boards.value
      .flatMap((b) => b.columns)
      .flatMap((c) => c.jobApplications)
      .map((j) => j.contacts || []).length > 0
  )
})

onMounted(async () => {
  await fetchBoards()
})

const openEditModal = (contact: Contact) => {
  contactToEdit.value = JSON.parse(JSON.stringify(contact))
  isModalOpen.value = true
}
</script>
<template>
  <div v-if="!hasContacts" class="empty-state">
    <div class="empty-icon-wrapper">
      <ContactTabIcon />
    </div>
    <h2>You have not linked any contacts to this job yet.</h2>
  </div>
  <div v-else class="placeholder-page">
    <h1>Contacts</h1>
    <div class="contacts-grid">
      <ContactCard
        v-for="contact in contacts?.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )"
        :key="contact.id"
        :contact="contact"
        @edit="openEditModal"
      />
    </div>
  </div>
</template>

<style scoped>
.placeholder-page {
  padding: 2rem;
}
.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
</style>
