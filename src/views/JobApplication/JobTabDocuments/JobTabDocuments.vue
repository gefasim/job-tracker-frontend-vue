<script setup lang="ts">
import { ref, computed } from 'vue'
import type { JobApplication } from '@/models/job-application.dto'
import type { Document } from '@/models/document.dto'
import DocumentsCard from './DocumentsCard.vue'
import DocumentModal from './DocumentModal.vue'

const jobApplication = defineModel<JobApplication>({ required: true })

const isModalOpen = ref(false)
const documentToEdit = ref<Document | null>(null)

const hasDocuments = computed(() => {
  return jobApplication.value.documents && jobApplication.value.documents.length > 0
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

const handleUnlinkDocument = (documentId: string) => {
  if (confirm('Are you sure you want to unlink this document from the job?')) {
    jobApplication.value.documents = jobApplication.value.documents!.filter(
      (d) => d.id !== documentId,
    )
  }
}
</script>

<template>
  <div class="documents-tab">
    <div class="tab-header" v-if="hasDocuments">
      <div class="tab-actions">
        <button class="btn-primary" @click="openUploadModal">Upload</button>
        <button class="btn-outline dropdown-btn">Link Document</button>
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
      <div class="empty-actions">
        <button class="btn-primary" @click="openUploadModal">Upload Document</button>
        <button class="btn-outline">Link Document</button>
      </div>
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
        :job-title="jobApplication.title"
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

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}
.empty-icon-wrapper {
  color: #5f6368;
  margin-bottom: 24px;
}
.empty-state h2 {
  color: #5f6368;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 32px;
}
.empty-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
}

/* Buttons */
.btn-primary {
  background: #4285f4;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #3367d6;
}
.btn-outline {
  background: white;
  color: #202124;
  border: 1px dashed #dadce0;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.btn-outline:hover {
  background: #f8f9fa;
}
.chevron {
  font-size: 12px;
  color: #5f6368;
}
</style>
