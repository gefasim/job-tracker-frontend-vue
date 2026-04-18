<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { JobApplication } from '@/types/dtos/job-application.dto'
import type { Document } from '@/types/dtos/document.dto'
import DocumentModal from './DocumentModal.vue'
import LinkDocumentDropdown from '@/components/common/LinkDocumentDropdown.vue'
import DocumentGrid from './DocumentGrid.vue'
import { useRoute } from 'vue-router'
import { useDocumentStore } from '@/stores/documentStore'

const jobApplication = defineModel<JobApplication>({ required: true })

const { documentsByBoard, fetchDocuments, assignJobApplication, unassignJobApplication } =
  useDocumentStore()
const route = useRoute()
const boardId = route.params.boardId as string

const isModalOpen = ref(false)
const documentToEdit = ref<Document | null>(null)

watch(
  () => route.params.boardId,
  async () => {
    await fetchDocuments(route.params.boardId as string)
  },
  { immediate: true },
)

const availableDocumentsToLink = computed(() => {
  if (!documentsByBoard.value[boardId]) return []
  const assignedDocumentIds = jobApplication.value.documents?.map((c) => c.id)
  return documentsByBoard.value[boardId].filter(
    (d) => !assignedDocumentIds!.some((id) => d!.id == id),
  )
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
  await assignJobApplication(document.id, jobApplication.value.id)
  jobApplication.value.documents.unshift(document)
}

const handleUnlinkDocument = async (documentId: string) => {
  if (confirm('Are you sure you want to unlink this document from the job?')) {
    await unassignJobApplication(documentId, jobApplication.value.id)
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
        :board-id="boardId"
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
