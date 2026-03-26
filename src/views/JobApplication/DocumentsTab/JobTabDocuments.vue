<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { JobApplication } from '@/models/job-application.dto'
import type { Document } from '@/models/document.dto'
import DocumentModal from './DocumentModal.vue'
import LinkDocumentDropdown from '@/views/Shared/LinkDocumentDropdown.vue'
import { api } from '@/api/api'
import { useCurrentBoard } from '@/store/currentBoardStore'
import DocumentGrid from './DocumentGrid.vue'
import { useRoute } from 'vue-router'

const jobApplication = defineModel<JobApplication>({ required: true })
const { board } = useCurrentBoard()
const route = useRoute()
const boardId = route.params.boardId as string

const isModalOpen = ref(false)
const documentToEdit = ref<Document | null>(null)

const boardDocuments = ref<Document[]>([])
const availableDocumentsToLink = computed(() => {
  const assignedDocumentIds = jobApplication.value.documents?.map((c) => c.id)
  return boardDocuments.value.filter((d) => !assignedDocumentIds!.some((id) => d!.id == id))
})

onMounted(async () => {
  const boardId = board.value!.id
  boardDocuments.value = await api.documents.getAll(boardId)
})

const openUploadModal = () => {
  documentToEdit.value = null
  isModalOpen.value = true
}

const handleSaveDocument = (savedDocument: Document) => {
  if (!jobApplication.value.documents) jobApplication.value.documents = []

  const index = jobApplication.value.documents.findIndex((d) => d.id === savedDocument.id)
  if (index !== -1) {
    jobApplication.value.documents[index] = savedDocument
  } else {
    jobApplication.value.documents.unshift(savedDocument)
  }
  isModalOpen.value = false
}

const handleLinkDocument = async (document: Document) => {
  await api.documents.assignJobApplication(document.id, jobApplication.value.id)
  jobApplication.value.documents.unshift(document)
}

const handleUnlinkDocument = async (documentId: string) => {
  if (confirm('Are you sure you want to unlink this document from the job?')) {
    await api.documents.unassignJobApplication(documentId, jobApplication.value.id)
    jobApplication.value.documents = jobApplication.value.documents!.filter(
      (d) => d.id !== documentId,
    )
  }
}
</script>

<template>
  <div class="documents-tab tab-border">
    <div class="tab-header">
      <div class="tab-actions">
        <button class="btn-primary" @click="openUploadModal">Upload</button>
        <LinkDocumentDropdown
          :items="availableDocumentsToLink"
          @select="handleLinkDocument"
        ></LinkDocumentDropdown>
      </div>
    </div>

    <DocumentGrid
      :documents="jobApplication.documents"
      :board-id="boardId"
      :job-application="jobApplication"
      no-documents-message="You have not linked any documents to this job yet."
      :show-unlink-button="true"
      :show-delete-button="false"
      @unlink="handleUnlinkDocument"
      @save="handleSaveDocument"
    />

    <Teleport to="body">
      <DocumentModal
        v-if="isModalOpen"
        :document="documentToEdit"
        :job-application="jobApplication"
        @close="isModalOpen = false"
        @save="handleSaveDocument"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.documents-tab {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header & Filters */
.tab-header {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.filter-pill {
  padding: 6px 12px;
  background-color: #e8f0fe;
  color: #1a73e8;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.tab-actions {
  display: flex;
  gap: 12px;
}

/* Grid */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
</style>
