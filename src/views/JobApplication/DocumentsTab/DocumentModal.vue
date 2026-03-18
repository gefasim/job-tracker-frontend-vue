<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Document } from '@/models/document.dto'
import type { JobApplication } from '@/models/job-application.dto'
import { DocumentCategoryEnum, type DocumentCategoryType } from '@/models/document-category.enum'
import BaseModalWrapper from '@/views/Shared/BaseModalWrapper.vue'
import { CurrentBoard } from '@/current-board.service'
import { useRoute } from 'vue-router'
import { api } from '@/api/api'

const props = defineProps<{
  document?: Document | null
  jobApplication?: JobApplication
}>()

const emit = defineEmits(['close', 'save'])
const route = useRoute()

const isEditMode = computed(() => !!props.document)
const isModalOpen = ref(false)
const linkedJobs = ref<JobApplication[]>([])
let linkedJobIdsBeforeUpdate: string[] = []

const form = ref({
  title: '',
  category: '' as DocumentCategoryType | '',
  description: '',
  file: null as File | null,
})
const categories = Object.values(DocumentCategoryEnum)

onMounted(() => {
  if (isEditMode.value) {
    form.value.title = props.document!.title
    form.value.category = props.document!.category
    form.value.description = props.document!.description || ''
    linkedJobs.value = getJobsLinkedToDocument(props.document!.id)
    linkedJobIdsBeforeUpdate = linkedJobs.value.map((j) => j.id)
  } else {
    linkedJobs.value = [props.jobApplication!]
  }

  isModalOpen.value = true
})

const getJobsLinkedToDocument = (documentId: string): JobApplication[] => {
  return (
    CurrentBoard.getBoard()!
      .columns.flatMap((c) => c.jobApplications)
      .filter((j) => j.documents.some((d) => d.id == documentId)) ?? []
  )
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    form.value.file = target.files.item(0)
    // Auto-fill title if empty
    if (!form.value.title) {
      form.value.title = target.files[0]!.name
    }
  }
}

const handleSave = async (linkedJobIds: string[]) => {
  if (!form.value.title || !form.value.category || !form.value.file) {
    alert('File, Title, and Category are required.')
    return
  }

  const boardId = route.params.boardId as string
  const document = {
    title: form.value.title,
    category: form.value.category,
    description: form.value.description,
  } as Document
  const savedDocument = isEditMode.value
    ? await api.documents.update(form.value.file!, document)
    : await api.documents.create(boardId, form.value.file!, document)

  sendAssignOrUnassignJobRequests(savedDocument.id, linkedJobIds)

  emit('save', savedDocument)
}

// Filters which JobApplication where linked and which where unlinked during Save/Update
const sendAssignOrUnassignJobRequests = (boardId: string, linkedJobIds: string[]) => {
  const jobIdsToLink = linkedJobIds.filter((id) => !linkedJobIdsBeforeUpdate.includes(id))
  const jobIdsToUnLink = linkedJobIdsBeforeUpdate.filter((id) => !linkedJobIds.includes(id))

  jobIdsToLink.forEach(async (jobId) => {
    await api.documents.assignJobApplication(boardId, jobId)
  })

  jobIdsToUnLink.forEach(async (jobId) => {
    await api.documents.unassignJobApplication(boardId, jobId)
  })
}
</script>

<template>
  <BaseModalWrapper
    v-if="isModalOpen"
    :title="isEditMode ? 'Edit Document' : 'Upload Document'"
    :isEditMode="isEditMode"
    :linkedJobsParam="linkedJobs"
    @close="emit('close')"
    @save="handleSave"
  >
    <template #form>
      <div class="form-group">
        <div class="label-row">
          <label>Select file</label>
          <span class="required-badge">Required</span>
        </div>
        <div class="file-drop-zone">
          <input type="file" id="file-upload" class="file-input" @change="handleFileChange" />
          <label for="file-upload" class="upload-btn">Upload file</label>
          <span class="drop-text">or drag and drop a file here</span>
          <div v-if="form.file" class="selected-file-name">Selected: {{ form.file.name }}</div>
        </div>
      </div>

      <div class="form-group">
        <div class="label-row">
          <label>Title</label>
          <span class="required-badge">Required</span>
        </div>
        <input
          v-model="form.title"
          type="text"
          class="form-control"
          placeholder="Enter document title"
        />
      </div>

      <div class="form-group">
        <div class="label-row">
          <label>Document Category</label>
          <span class="required-badge">Required</span>
        </div>
        <select v-model="form.category" class="form-control">
          <option value="" disabled>Select category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea
          v-model="form.description"
          class="form-control textarea"
          placeholder="Add a description for this document"
        ></textarea>
      </div>
    </template>
  </BaseModalWrapper>
</template>
<style scoped>
/* Form Controls */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #202124;
}

.required-badge {
  font-size: 12px;
  color: #9aa0a6;
}

.form-control {
  padding: 10px 12px;
  border: 1px solid #dadce0;
  border-radius: 6px;
  font-size: 14px;
  color: #202124;
  outline: none;
  transition: border-color 0.2s;
  background: white;
}

.form-control:focus {
  border-color: #1a73e8;
}

.textarea {
  resize: vertical;
  min-height: 120px;
}

/* File Drop Zone */
.file-drop-zone {
  border: 1px dashed #dadce0;
  border-radius: 8px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: #f8f9fa;
  position: relative;
}

.file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.upload-btn {
  background-color: #b2bac0;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.upload-btn:hover {
  background-color: #2c3e50;
}

.drop-text {
  font-size: 13px;
  color: #9aa0a6;
}

.selected-file-name {
  font-size: 13px;
  color: #1a73e8;
  margin-top: 8px;
  font-weight: 500;
}
</style>
