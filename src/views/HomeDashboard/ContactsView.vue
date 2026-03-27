<script setup lang="ts">
import type { Contact } from '@/models/contact.dto'
import { useBoards } from '@/store/boardStore'
import { onMounted, ref } from 'vue'
import ContactGrid from '../JobApplication/ContactsTab/ContactGrid.vue'
import { api } from '@/api/api'

const { boards, fetchBoards } = useBoards()
const contacts = ref<Contact[]>([])

onMounted(async () => {
  await fetchBoards()
  contacts.value = boards.value
    .flatMap((b) => b.columns)
    .flatMap((c) => c.jobApplications)
    .flatMap((j) => j.contacts || [])
    .filter((contact, index, self) => self.findIndex((c) => c.id === contact.id) === index)
})

const onDeleteContact = async (contactId: string) => {
  if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
    await api.contacts.delete(contactId)
    // TODO: Remove the deleted contact from all job applications in the store to avoid showing stale data until the next fetch
    contacts.value = contacts.value.filter((c) => c.id !== contactId)
  }
}
</script>
<template>
  <div class="placeholder-page">
    <h1>Contacts</h1>
    <ContactGrid
      :contacts="contacts"
      :boardId="boards[0]!.id"
      :jobApplication="null"
      :showUnlinkButton="false"
      :showDeleteButton="true"
      noContactsMessage="You don't have any contacts"
      @save="(_) => {}"
      @delete="onDeleteContact"
    />
  </div>
</template>

<style scoped>
.placeholder-page {
  padding: 2rem;
}
</style>
