<script setup lang="ts">
import type { JobApplication } from '@/models/job-application.dto'
import JobSelectDropdown from '../JobApplication/JobSelectDropdown.vue'
import { onMounted, ref } from 'vue'
import BaseModalWrapper from './BaseModalWrapper.vue'
import { useBoards } from '@/store/boardStore'

const props = defineProps<{
  title: string
  linkedJobsParam: JobApplication[]
  boardId: string
}>()

const emit = defineEmits(['close', 'save'])
const { boards } = useBoards()
const linkedJobs = ref<JobApplication[]>([])
const availableJobs = ref<JobApplication[]>([])

onMounted(() => {
  linkedJobs.value = props.linkedJobsParam
  availableJobs.value = boards.value
    .find((b) => b.id === props.boardId)!
    .columns.flatMap((c) => c.jobApplications)
    .filter((j) => !props.linkedJobsParam.includes(j))
})

const assignJob = (job: JobApplication) => {
  linkedJobs.value.push(job)
  availableJobs.value = availableJobs.value.filter((j) => j.id !== job.id)
}

const unassignJob = (job: JobApplication) => {
  linkedJobs.value = linkedJobs.value.filter((j) => j.id !== job.id)
  availableJobs.value.push(job)
}

const handleSave = async () => {
  emit(
    'save',
    linkedJobs.value.map((j) => j.id),
  )
}
</script>

<template>
  <BaseModalWrapper :title="title" @save="handleSave" @close="emit('close')">
    <template #body>
      <div class="form-main">
        <slot name="form"></slot>
      </div>

      <div class="form-sidebar">
        <div class="sidebar-section">
          <label class="sidebar-label">Linked to</label>
          <div>
            <div
              class="linked-item-card"
              v-for="job in linkedJobs"
              :key="job.id"
              :style="{ color: job.color ?? 'black', borderColor: job.color ?? 'black' }"
            >
              <div class="job-title">{{ job.title }} @ {{ job.company?.name }}</div>
              <button class="job-delete" @click="unassignJob(job)">🗑️</button>
            </div>
          </div>

          <JobSelectDropdown :items="availableJobs" @select="assignJob" />
        </div>
      </div>
    </template>
  </BaseModalWrapper>
</template>
<style scoped>
/* Layout: Two Columns */
.form-main {
  flex: 2;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 24px;
}

.form-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-color);
  padding-left: 32px;
  gap: 32px;
}

/* Sidebar Elements */
.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sidebar-section h4 {
  margin: 0;
  font-size: 14px;
  color: #202124;
}
.sidebar-label {
  font-size: 16px;
  color: #5f6368;
  font-weight: 500;
}
.sidebar-label2 {
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
  background-color: var(--bg-main);
}

.job-title {
  font-size: 13px;
}
.job-delete {
  background: none;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 0 4px;
  color: #5f6368;
  cursor: pointer;
}
.job-delete:hover {
  background: #f8f9fa;
}
</style>
