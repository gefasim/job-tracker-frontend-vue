<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Document } from '@/models/document.dto'
import type { JobApplication } from '@/models/job-application.dto'
import { DocumentCategoryEnum, type DocumentCategoryType } from '@/models/document-category.enum'
import BaseModalWrapper from '@/views/Shared/BaseModalWrapper.vue'
import { CurrentBoard } from '@/current-board.service'

const props = defineProps<{
  document?: Document | null
  jobApplication?: JobApplication
}>()

const emit = defineEmits(['close', 'save'])

const isEditMode = computed(() => !!props.document)
const isModalOpen = ref(false)
const linkedJobs = ref<JobApplication[]>([])
let linkedJobIdsBeforeSave: string[] = []

const formData = ref({
  title: '',
  category: '' as DocumentCategoryType | '',
  description: '',
  file: null as File | null,
})
const categories = Object.values(DocumentCategoryEnum)

onMounted(() => {
  if (isEditMode.value) {
    formData.value.title = props.document!.title
    formData.value.category = props.document!.category
    formData.value.description = props.document!.description || ''
    linkedJobs.value = getJobsLinkedToDocument(props.document!.id)
  } else {
    linkedJobs.value = [props.jobApplication!]
  }

  linkedJobIdsBeforeSave = linkedJobs.value.map((j) => j.id)
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
    formData.value.file = target.files.item(0)
    // Auto-fill title if empty
    if (!formData.value.title) {
      formData.value.title = target.files[0]!.name
    }
  }
}

const handleSave = (linkedJobsParam: JobApplication[]) => {
  console.log('Linked jobs after Save', linkedJobsParam)
  console.log('Linked jobs before Save', linkedJobIdsBeforeSave)

  isModalOpen.value = false // TODO: replace with emit('save')
  emit('close') // TODO: replace with emit('save')
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
          <div v-if="formData.file" class="selected-file-name">
            Selected: {{ formData.file.name }}
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="label-row">
          <label>Title</label>
          <span class="required-badge">Required</span>
        </div>
        <input
          v-model="formData.title"
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
        <select v-model="formData.category" class="form-control">
          <option value="" disabled>Select category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea
          v-model="formData.description"
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
