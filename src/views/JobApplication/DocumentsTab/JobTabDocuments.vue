<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { JobApplication } from '@/models/job-application.dto'
import type { Document } from '@/models/document.dto'
import DocumentsCard from './DocumentsCard.vue'
import DocumentModal from './DocumentModal.vue'
import LinkDocumentDropdown from '@/views/Shared/LinkDocumentDropdown.vue'
import { api } from '@/api/api'
import { useCurrentBoard } from '@/store/currentBoardStore'

const jobApplication = defineModel<JobApplication>({ required: true })
const { board } = useCurrentBoard()

const isModalOpen = ref(false)
const documentToEdit = ref<Document | null>(null)

const hasDocuments = computed(() => {
  return jobApplication.value.documents && jobApplication.value.documents.length > 0
})
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

const openEditModal = (document: Document) => {
  documentToEdit.value = JSON.parse(JSON.stringify(document))
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

    <div v-if="!hasDocuments" class="empty-state">
      <div class="empty-icon-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>
      <h2>You have not linked any documents to this job yet.</h2>
    </div>

    <div v-else class="documents-grid">
      <DocumentsCard
        v-for="doc in jobApplication.documents"
        :key="doc.id"
        :document="doc"
        @edit="openEditModal"
        @unlink="handleUnlinkDocument"
      />
    </div>

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
