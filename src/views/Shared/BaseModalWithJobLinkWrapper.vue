<script setup lang="ts">
import type { JobApplication } from '@/models/job-application.dto'
import JobSelectDropdown from '../JobApplication/JobSelectDropdown.vue'
import { onMounted, ref } from 'vue'
import { CurrentBoard } from '@/current-board.service'

const props = defineProps<{
  title: string
  linkedJobsParam: JobApplication[]
}>()

const emit = defineEmits(['close', 'save'])
const linkedJobs = ref<JobApplication[]>([])
const availableJobs = ref<JobApplication[]>([])

onMounted(() => {
  linkedJobs.value = props.linkedJobsParam
  availableJobs.value = CurrentBoard.getBoard()!
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
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ title }}</h2>
      </div>

      <div class="modal-body">
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
      </div>

      <div class="modal-footer">
        <button class="btn-primary" @click="handleSave">Save</button>
        <button class="btn-outline" @click="emit('close')">Discard</button>
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
  padding: 20px;
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
  padding: 24px;
  gap: 32px;
  overflow: hidden;
}

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
  border-left: 1px solid #f1f3f4;
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
  background-color: white;
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
</style>
