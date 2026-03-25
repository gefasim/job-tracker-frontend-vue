<script setup lang="ts">
import type { Contact } from '@/models/contact.dto'
import { useBoards } from '@/store/boardStore'
import { computed, onMounted } from 'vue'
import ContactGrid from '../JobApplication/ContactsTab/ContactGrid.vue'

const { boards, fetchBoards } = useBoards()
const contacts = computed<Contact[]>(() => {
  return boards.value
    .flatMap((b) => b.columns)
    .flatMap((c) => c.jobApplications)
    .flatMap((j) => j.contacts || [])
    .filter((contact, index, self) => self.findIndex((c) => c.id === contact.id) === index)
})

onMounted(async () => {
  await fetchBoards()
})
</script>
<template>
  <div class="placeholder-page">
    <h1>Contacts</h1>
    <ContactGrid
      :contacts="contacts"
      :boardId="boards[0]!.id"
      :jobApplication="null"
      noContactsMessage="You don't have any contacts"
      @save="(_) => {}"
    />
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
