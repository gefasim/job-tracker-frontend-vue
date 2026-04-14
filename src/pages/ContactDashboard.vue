<script setup lang="ts">
import type { Contact } from '@/types/dtos/contact.dto'
import { computed, watch } from 'vue'
import ContactGrid from '@/components/contacts/ContactGrid.vue'
import { useNavbarFilter } from '@/stores/navbarFilterStore'
import { useContacts } from '@/stores/contactStore'

const { selectedBoard, textFilter: contactNameFilter } = useNavbarFilter()
const { contactsPerBoard, fetchContacts, deleteContact } = useContacts()

watch(
  selectedBoard,
  async () => {
    if (!selectedBoard.value) return
    await fetchContacts(selectedBoard.value.id)
  },
  { immediate: true },
)

const filteredContacts = computed(() => {
  if (!selectedBoard.value) return []
  const boardData = contactsPerBoard.value[selectedBoard.value.id]
  if (!boardData) return []
  return boardData.filter((c) => searchFilter(c, contactNameFilter.value))
})

const searchFilter = (contact: Contact, query: string) => {
  const fullName = `${contact.firstName} ${contact.lastName}`
  return (
    contact.firstName.toLowerCase().includes(query) ||
    contact.lastName.toLowerCase().includes(query) ||
    fullName.toLocaleLowerCase().includes(query)
  )
}

const onDeleteContact = async (contactId: string) => {
  if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
    await deleteContact(selectedBoard.value!.id, contactId)
  }
}
</script>
<template>
  <div class="placeholder-page">
    <div v-if="selectedBoard">
      <div class="board-header">
        <h2>{{ selectedBoard.name }}</h2>
      </div>
      <ContactGrid
        :contacts="filteredContacts"
        :boardId="selectedBoard.id"
        :jobApplication="null"
        :showUnlinkButton="false"
        :showDeleteButton="true"
        noContactsMessage="You don't have any contacts"
        @save="(_: any) => {}"
        @delete="onDeleteContact"
      />
    </div>
  </div>
</template>

<style scoped>
.placeholder-page {
  padding: 2rem;
}
.select-and-filter {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}
.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
}

.board-header p {
  color: #5f6368;
}
</style>
