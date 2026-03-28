<script setup lang="ts">
import type { Contact } from '@/models/contact.dto'
import { useBoards } from '@/store/boardStore'
import { computed, onMounted, ref } from 'vue'
import ContactGrid from '../JobApplication/ContactsTab/ContactGrid.vue'
import { api } from '@/api/api'
import type { Board } from '@/models/board.dto'
import GenericSelector from '../Shared/GenericSelector.vue'

const { boards, fetchBoards } = useBoards()
const boardsWithContacts = ref<{ board: Board; contacts: Contact[] }[]>([])
const availableBoards = computed(() => boardsWithContacts.value.map((b) => b.board))
const selectedBoard = ref<Board | null>(null)

onMounted(async () => {
  await fetchBoards()
  boardsWithContacts.value = boards.value
    .filter((b) => !b.isArchived)
    .map((board) => ({
      board,
      contacts: getContacts(board.id),
    }))
  // Set first board as default if available
  if (boardsWithContacts.value.length > 0 && boardsWithContacts.value[0]) {
    selectedBoard.value = boardsWithContacts.value[0].board
  }
})

const getContacts = (boardId: string): Contact[] => {
  return boards.value
    .find((b) => b.id === boardId)!
    .columns.flatMap((c) => c.jobApplications)
    .flatMap((j) => j.contacts || [])
    .filter((contact, index, self) => self.findIndex((c) => c.id === contact.id) === index)
}

const onBoardChange = (board: Board) => {
  selectedBoard.value = board
}

const filteredContacts = computed(() => {
  if (!selectedBoard.value) return []
  const boardData = boardsWithContacts.value.find((b) => b.board.id === selectedBoard.value!.id)
  return boardData ? boardData.contacts : []
})

const onDeleteContact = async (contactId: string) => {
  if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
    await api.contacts.delete(contactId)
    // TODO: Remove the deleted contact from all job applications in the store to avoid showing stale data until the next fetch
    boardsWithContacts.value = boardsWithContacts.value.map((board) => ({
      ...board,
      contacts: board.contacts.filter((doc) => doc.id !== contactId),
    }))
  }
}
</script>
<template>
  <div class="placeholder-page">
    <h1>Contacts</h1>
    <div class="select-and-filter">
      <!-- Board Selector -->
      <GenericSelector
        :items="availableBoards"
        :selected-item="selectedBoard"
        label="Select Board:"
        display-property="name"
        value-property="id"
        id="board-select"
        :hideLabel="true"
        @update:selected-item="onBoardChange"
      />
    </div>

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
        @save="(_) => {}"
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
