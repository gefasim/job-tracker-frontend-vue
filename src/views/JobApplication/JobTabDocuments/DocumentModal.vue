<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Document } from '@/models/document.dto'
import type { JobApplication } from '@/models/job-application.dto'
import { DocumentCategoryEnum, type DocumentCategoryType } from '@/models/document-category.enum'

const props = defineProps<{
  document?: Document | null
  jobApplication?: JobApplication
}>()

const emit = defineEmits(['close', 'save'])

const isEditMode = computed(() => !!props.document)

// Form state
const formData = ref({
  title: '',
  category: '' as DocumentCategoryType | '',
  description: '',
  file: null as File | null,
  linkedJobs: [] as JobApplication[],
})

const categories = Object.values(DocumentCategoryEnum)

// Initialize form data on mount
onMounted(() => {
  if (isEditMode.value && props.document) {
    formData.value.title = props.document.title
    formData.value.category = props.document.category
    formData.value.description = props.document.description || ''
    formData.value.linkedJobs = props.document.jobApplications
      ? [...props.document.jobApplications]
      : []
  } else {
    // If creating a new document from a job tab, pre-link that job
    formData.value.linkedJobs = [props.jobApplication!]
  }
})

// Handle file selection (mock logic for UI purposes)
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

// Remove a linked job
const removeLinkedJob = (jobId: string) => {
  formData.value.linkedJobs = formData.value.linkedJobs.filter((j) => j.id !== jobId)
}

// Handle save action
const handleSave = () => {
  // Validate required fields
  if (
    !formData.value.title ||
    !formData.value.category ||
    (!formData.value.file && !isEditMode.value)
  ) {
    alert('Please fill all required fields.')
    return
  }

  // Construct updated/new document object
  const documentPayload: Partial<Document> = {
    id: props.document?.id || Date.now().toString(),
    title: formData.value.title,
    category: formData.value.category as DocumentCategoryType,
    description: formData.value.description,
    jobApplications: formData.value.linkedJobs,
    // Mock file info if a new file was uploaded
    ...(formData.value.file && {
      fileSize: formData.value.file.size,
      fileExtension: formData.value.file.name.split('.').pop()?.toUpperCase() || 'FILE',
      url: 'mock-url',
    }),
  }

  emit('save', documentPayload)
}

// Handle close/discard
const handleDiscard = () => {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="handleDiscard">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Edit Document' : 'Upload Document' }}</h2>
      </div>

      <div class="modal-body">
        <div class="form-main">
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
        </div>

        <div class="form-sidebar">
          <div class="sidebar-section">
            <label class="sidebar-label">Linked to</label>
            <div class="linked-items">
              <div
                v-for="job in formData.linkedJobs"
                :key="job.id"
                class="linked-item-card"
                :style="{ color: job.color ?? 'black', borderColor: job.color ?? 'black' }"
              >
                <div class="job-title" :style="{ color: job.color ?? 'black' }">
                  {{ job.title }} @ {{ job.company?.name }}
                </div>
                <button class="job-menu" @click="removeLinkedJob(job.id)">🗑️</button>
              </div>
            </div>

            <div class="add-link-placeholder">+ Link Job</div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-primary" @click="handleSave">
          {{ isEditMode ? 'Update' : 'Create' }}
        </button>
        <button class="btn-outline" @click="handleDiscard">Discard</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal Base */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 900px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid #f1f3f4;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #202124;
  font-weight: 600;
}

/* Layout: Two Columns */
.modal-body {
  display: flex;
  flex: 1;
  overflow: hidden; /* Let inner columns scroll if needed */
}

.form-main {
  flex: 2;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-sidebar {
  flex: 1;
  padding: 24px;
  border-left: 1px solid #f1f3f4;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

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
  background-color: #1c2b36;
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

/* Sidebar Elements */
.sidebar-label {
  font-size: 14px;
  font-weight: 500;
  color: #5f6368;
  margin-bottom: 16px;
  display: block;
}

.linked-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #1a73e8;
  border-radius: 6px;
  margin-bottom: 8px;
  background-color: white;
}

.job-title {
  font-size: 13px;
}
.job-menu {
  background: none;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 0 4px;
  color: #5f6368;
  cursor: pointer;
}

.add-link-placeholder {
  border: 1px dashed #dadce0;
  border-radius: 6px;
  padding: 10px 12px;
  color: #5f6368;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

/* Footer Actions */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f1f3f4;
  display: flex;
  justify-content: center;
  gap: 16px;
  background: white;
  border-radius: 0 0 12px 12px;
}

.btn-primary {
  background: #8ab4f8; /* Muted blue matching the screenshot */
  color: white;
  border: none;
  padding: 10px 32px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #4285f4;
}

.btn-outline {
  background: white;
  color: #202124;
  border: 1px solid #dadce0;
  padding: 10px 32px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}

.btn-outline:hover {
  background: #f8f9fa;
}
</style>
