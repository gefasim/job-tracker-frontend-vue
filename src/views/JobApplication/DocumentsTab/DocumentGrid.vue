<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { JobApplication } from '@/models/job-application.dto'
import type { Document } from '@/models/document.dto'
import DocumentsCard from './DocumentsCard.vue'
import DocumentModal from './DocumentModal.vue'
import { api } from '@/api/api'
import { useCurrentBoard } from '@/store/currentBoardStore'

const props = defineProps<{
  documents: Document[]
  boardId: string
  jobApplication: JobApplication | null
  noDocumentsMessage: string
  showUnlinkButton: boolean
  showDeleteButton: boolean
}>()
const documents = computed(() => props.documents || [])
const emit = defineEmits(['unlink', 'delete', 'save'])
const { board } = useCurrentBoard()

const isModalOpen = ref(false)
const documentToEdit = ref<Document | null>(null)

const hasDocuments = computed(() => {
  return props.documents && props.documents.length > 0
})
const boardDocuments = ref<Document[]>([])

onMounted(async () => {
  const boardId = board.value!.id
  boardDocuments.value = await api.documents.getAll(boardId)
})

const openEditModal = (document: Document) => {
  documentToEdit.value = JSON.parse(JSON.stringify(document))
  isModalOpen.value = true
}

const handleSaveDocument = (savedDocument: Document) => {
  emit('save', savedDocument)
  isModalOpen.value = false
}
</script>

<template>
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
      v-for="doc in documents.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )"
      :key="doc.id"
      :document="doc"
      @edit="openEditModal"
      @unlink="emit('unlink', $event)"
    />
  </div>

  <Teleport to="body">
    <DocumentModal
      v-if="isModalOpen"
      :document="documentToEdit"
      :job-application="jobApplication ?? undefined"
      @close="isModalOpen = false"
      @save="handleSaveDocument"
    />
  </Teleport>
</template>

<style scoped>
.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
</style>
