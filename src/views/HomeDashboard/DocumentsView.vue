<script setup lang="ts">
import { useBoards } from '@/store/boardStore'
import { onMounted, ref } from 'vue'
import { api } from '@/api/api'
import type { Document } from '@/models/document.dto'
import DocumentGrid from '../JobApplication/DocumentsTab/DocumentGrid.vue'
import type { Board } from '@/models/board.dto'

const { boards, fetchBoards } = useBoards()
const boardsWithDocuments = ref<{ board: Board; documents: Document[] }[]>([])

onMounted(async () => {
  await fetchBoards()
  boardsWithDocuments.value = boards.value
    .filter((b) => !b.isArchived)
    .map((board) => ({
      board,
      documents: getDocuments(board.id),
    }))
})

const getDocuments = (boardId: string): Document[] => {
  return boards.value
    .find((b) => b.id === boardId)!
    .columns.flatMap((c) => c.jobApplications)
    .flatMap((j) => j.documents || [])
    .filter((document, index, self) => self.findIndex((c) => c.id === document.id) === index)
}

const onDeleteDocument = async (documentId: string) => {
  if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
    await api.documents.delete(documentId)
    // TODO: Remove the deleted document from all job applications in the store to avoid showing stale data until the next fetch
    boardsWithDocuments.value = boardsWithDocuments.value.map((board) => ({
      ...board,
      documents: board.documents.filter((doc) => doc.id !== documentId),
    }))
  }
}
</script>
<template>
  <div class="placeholder-page">
    <h1>Documents</h1>
    <div v-for="boards in boardsWithDocuments" :key="boards.board.id">
      <div class="board-header">
        <h2>{{ boards.board.name }}</h2>
        <p v-if="boards.documents.length == 0">You don't have any documents for this board yet.</p>
      </div>
      <DocumentGrid
        v-if="boards.documents.length > 0"
        :documents="boards.documents"
        :boardId="boards.board.id"
        :jobApplication="null"
        :showUnlinkButton="false"
        :showDeleteButton="true"
        noDocumentsMessage="You don't have any documents for this board yet."
        @save="(_) => {}"
        @delete="onDeleteDocument"
      />
      <hr />
    </div>
  </div>
</template>

<style scoped>
.placeholder-page {
  padding: 2rem;
}
.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.board-header p {
  color: #5f6368;
}
</style>
