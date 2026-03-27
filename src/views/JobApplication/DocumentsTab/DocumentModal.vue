<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Document } from '@/models/document.dto'
import type { JobApplication } from '@/models/job-application.dto'
import { DocumentCategoryEnum, type DocumentCategoryType } from '@/models/document-category.enum'
import BaseModalWithJobLinkWrapper from '@/views/Shared/BaseModalWithJobLinkWrapper.vue'
import { api } from '@/api/api'
import { useBoards } from '@/store/boardStore'

/**
  This modal is used for both creating a new document and editing an existing document.
  Document prop is required for edit mode, and null for create mode. In create mode
  if the modal is opened from a specific job application, that job application will be pre-linked to the new document.
  BoardId is required to get the list of jobs that might be linked to the document. The list of jobs will be taken from shared state (board store)
*/
const props = defineProps<{
  document?: Document | null
  jobApplication?: JobApplication
  boardId: string
}>()

const emit = defineEmits(['close', 'save'])
const { boards } = useBoards()

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
    boards.value
      .find((b) => b.id === props.boardId)
      ?.columns.flatMap((c) => c.jobApplications)
      .filter((j) => j.documents.some((d) => d.id == documentId)) ?? []
  )
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    // Automatically update name only if previous name matches file name
    if (!form.value.title || form.value.title === form.value.file?.name) {
      form.value.title = target.files[0]!.name
    }
    form.value.file = target.files.item(0)
  }
}

const handleSave = async (linkedJobIds: string[]) => {
  if (!form.value.title || !form.value.category || !form.value.file) {
    alert('File, Title, and Category are required.')
    return
  }

  const document = {
    title: form.value.title,
    category: form.value.category,
    description: form.value.description,
  } as Document
  const savedDocument = isEditMode.value
    ? await api.documents.update(form.value.file!, document)
    : await api.documents.create(props.boardId, form.value.file!, document)

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
  <BaseModalWithJobLinkWrapper
    v-if="isModalOpen"
    :title="isEditMode ? 'Edit Document' : 'Upload Document'"
    :linkedJobsParam="linkedJobs"
    :board-id="boardId"
    @close="emit('close')"
    @save="handleSave"
  >
    <!-- TODO: fix drag and drop a file here-->
    <template #form>
      <div class="input-group input-group-required">
        <label>Select file <span>*</span></label>
        <div class="file-drop-zone">
          <input type="file" id="file-upload" class="file-input" @change="handleFileChange" />
          <label for="file-upload" class="upload-btn">Upload file</label>
          <span class="drop-text">or drag and drop a file here</span>
          <div v-if="form.file" class="selected-file-name">Selected: {{ form.file.name }}</div>
        </div>
      </div>

      <div class="input-group input-group-required">
        <label>Title <span>*</span></label>
        <input v-model="form.title" type="text" placeholder="Enter document title" />
      </div>

      <div class="input-group input-group-required">
        <label>Document Category <span>*</span></label>
        <select v-model="form.category">
          <option value="" disabled>Select category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="input-group">
        <label>Description</label>
        <textarea
          v-model="form.description"
          placeholder="Add a description for this document"
        ></textarea>
      </div>
    </template>
  </BaseModalWithJobLinkWrapper>
</template>
<style scoped>
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
