<script setup lang="ts">
import { useBoards } from '@/store/boardStore'
import { onMounted, ref } from 'vue'
import { api } from '@/api/api'
import type { Document } from '@/models/document.dto'
import DocumentGrid from '../JobApplication/DocumentsTab/DocumentGrid.vue'

const { boards, fetchBoards } = useBoards()
const documents = ref<Document[]>([])

onMounted(async () => {
  await fetchBoards()
  documents.value = boards.value
    .flatMap((b) => b.columns)
    .flatMap((c) => c.jobApplications)
    .flatMap((j) => j.documents || [])
    .filter((document, index, self) => self.findIndex((c) => c.id === document.id) === index)
})

const onDeleteDocument = async (documentId: string) => {
  if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
    await api.documents.delete(documentId)
    // TODO: Remove the deleted document from all job applications in the store to avoid showing stale data until the next fetch
    documents.value = documents.value.filter((c) => c.id !== documentId)
  }
}
</script>
<template>
  <div class="placeholder-page">
    <h1>Documents</h1>
    <DocumentGrid
      :documents="documents"
      :boardId="boards[0]!.id"
      :jobApplication="null"
      :showUnlinkButton="false"
      :showDeleteButton="true"
      noDocumentsMessage="You don't have any documents"
      @save="(_) => {}"
      @delete="onDeleteDocument"
    />
  </div>
</template>

<style scoped>
.placeholder-page {
  padding: 2rem;
}
</style>
