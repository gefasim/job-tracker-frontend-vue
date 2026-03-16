<script setup lang="ts">
import { useKeydown } from '@/composables/useKeydown'
import type { JobApplication } from '@/models/job-application.dto'
import { computed, ref, watch } from 'vue'
import JobTabNotes from './JobApplication/NotesTab/JobTabNotes.vue'
import JobTabInfo from './JobApplication/JobInfoTab/JobTabInfo.vue'
import JobTabContacts from './JobApplication/ContactsTab/JobTabContacts.vue'
import JobTabDocuments from './JobApplication/DocumentsTab/JobTabDocuments.vue'
import JobTabCompany from './JobApplication/JobTabCompany.vue'
import { JobApplicationTabEnum, type JobApplicationTabType } from './JobApplication/tabs'
import { api } from '@/api/api'
import JobInfoNavTabIcon from '@/assets/JobInfoNavTabIcon.vue'
import NoteNavTabIcon from '@/assets/NoteNavTabIcon.vue'
import CompanyNavTabIcon from '@/assets/CompanyNavTabIcon.vue'
import DocumentNavTabIcon from '@/assets/DocumentNavTabIcon.vue'
import ContactNavTabIcon from '@/assets/ContactNavTabIcon.vue'

const props = defineProps<{
  jobApplicationParam: JobApplication | null
}>()
const emit = defineEmits(['update', 'close'])
const jobApplication = ref<JobApplication | null>(null) // Shallow copy of jobApplicationParam
const columns = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected']

// Tab navigation
const activeTab = ref<JobApplicationTabType>(JobApplicationTabEnum.JobInfo)
const tabComponents: Record<JobApplicationTabEnum, unknown> = {
  [JobApplicationTabEnum.JobInfo]: JobTabInfo,
  [JobApplicationTabEnum.Notes]: JobTabNotes,
  [JobApplicationTabEnum.Contacts]: JobTabContacts,
  [JobApplicationTabEnum.Documents]: JobTabDocuments,
  [JobApplicationTabEnum.Company]: JobTabCompany,
}
const tabIcon: Record<JobApplicationTabEnum, unknown> = {
  [JobApplicationTabEnum.JobInfo]: JobInfoNavTabIcon,
  [JobApplicationTabEnum.Notes]: NoteNavTabIcon,
  [JobApplicationTabEnum.Contacts]: ContactNavTabIcon,
  [JobApplicationTabEnum.Documents]: DocumentNavTabIcon,
  [JobApplicationTabEnum.Company]: CompanyNavTabIcon,
}
const currentComponent = computed(() => tabComponents[activeTab.value])

// Every time a new modal is opened, we copy the data from the props
watch(
  () => props.jobApplicationParam,
  (newJobApplication) => {
    if (newJobApplication) {
      jobApplication.value = { ...newJobApplication }
    } else {
      jobApplication.value = null
    }
  },
  { immediate: true },
)

const getTabCount = (tab: JobApplicationTabEnum): number => {
  if (!jobApplication.value) return 0

  switch (tab) {
    case JobApplicationTabEnum.Notes:
      return jobApplication.value.notes?.length || 0
    case JobApplicationTabEnum.Contacts:
      return jobApplication.value.contacts?.length || 0
    case JobApplicationTabEnum.Documents:
      return jobApplication.value.documents?.length || 0
    default:
      return 0
  }
}

const saveChanges = async () => {
  const hasChanged =
    JSON.stringify(jobApplication.value) !== JSON.stringify(props.jobApplicationParam)

  if (hasChanged && jobApplication.value) {
    try {
      await api.jobs.update(jobApplication.value)
      emit('update', jobApplication.value)
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }
}

const handleClose = async () => {
  await saveChanges()
  emit('close')
}

useKeydown('Escape', handleClose)
</script>

<template>
  <Teleport to="body">
    <div v-if="jobApplication" class="modal-overlay" @click.self="handleClose">
      <div class="modal-container" ref="modalContent">
        <header class="modal-header">
          <div class="header-left">
            <h1>{{ jobApplication.title }}</h1>
            <div class="subtitle">
              <span class="icon-office">🏢</span> {{ jobApplication.company?.name }}
            </div>
          </div>
          <div class="header-right">
            <select v-model="jobApplication.status" name="board-columns" class="status-dropdown">
              <option v-for="s in columns" :key="s" :value="s">Move: {{ s }}</option>
            </select>
            <button class="btn-close" @click="handleClose">Close</button>
          </div>
        </header>

        <nav class="modal-tabs">
          <button
            v-for="tab in Object.values(JobApplicationTabEnum)"
            :key="tab"
            :class="['tab-item', { active: activeTab === tab }]"
            @click="activeTab = tab"
          >
            <component :is="tabIcon[tab]" class="tab-icon" />

            {{ tab }}

            <span v-if="getTabCount(tab) > 0" class="tab-badge">
              {{ getTabCount(tab) }}
            </span>
          </button>
        </nav>

        <main class="modal-body">
          <KeepAlive>
            <component :is="currentComponent" v-model="jobApplication" />
          </KeepAlive>
        </main>
      </div>
    </div>
  </Teleport>
</template>

<style>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  width: 100%;
  max-width: 900px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Header */
.modal-header {
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.subtitle {
  color: #70757a;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-right {
  display: flex;
  gap: 12px;
}

.status-dropdown {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-close {
  background: white;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

/* Tabs */
.modal-tabs {
  display: flex;
  background: #f1f4f9;
  padding: 8px 32px;
  gap: 8px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #5f6368;
  gap: 8px;
  font-weight: 500;
  position: relative; /* for badge */
}

.tab-item.active {
  background: white;
  color: #1a73e8;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.tab-icon {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  fill: currentColor;
}

.tab-badge {
  background-color: #818b9c;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  height: 20px;
  min-width: 20px;
  padding: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Form Layout */
.modal-body {
  padding: 32px;
  background: white;
  overflow-y: auto;
  max-height: 70vh;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: #3c4043;
}

input,
textarea {
  border: 1px solid #dadce0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
}

.color-picker-box {
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
}

/* Description / Editor */
.description-section {
  margin-top: 24px;
  border: 1px solid #dadce0;
  border-radius: 8px;
  padding: 12px;
}

.editor-toolbar {
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
  color: #5f6368;
  display: flex;
  gap: 15px;
}

textarea {
  border: none;
  resize: vertical;
  background: #fffdf0;
}

textarea:focus {
  outline: none;
}
</style>
