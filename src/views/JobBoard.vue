<script setup lang="ts">
import api from '@/api'
import type { Board } from '@/models/board.dto'
import type { JobApplication } from '@/models/job-application.dto'
import { ref, watch } from 'vue'
import JobApplicationModal from './JobApplicationModal.vue'

const { boardId } = defineProps<{ boardId?: string }>()
const dragInfo = ref<{ fromColId: string; fromIndex: number } | null>(null)
const selectedJobApplication = ref<JobApplication | null>(null)
const board = ref<Board>()

watch(
  () => boardId,
  (boardId) => fetchData(boardId as string),
  { immediate: true },
)

async function fetchData(boardId: string) {
  const response = await api.get<Board>('/boards/' + boardId)
  board.value = response.data
}

// On Job click
const openSelectedJobApplication = (job: JobApplication) => {
  selectedJobApplication.value = job
}

const closeSelectedJobApplication = () => {
  selectedJobApplication.value = null
}

// On Job drag
const OnDragStart = (event: DragEvent, fromColId: string, fromIndex: number) => {
  dragInfo.value = { fromColId, fromIndex }

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    // Firefox requires any data in setData
    event.dataTransfer.setData('text/plain', fromIndex.toString())
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const OnDrop = (event: DragEvent, toColumnId: string, toIndex?: number) => {
  event.preventDefault()
  if (!dragInfo.value) return

  const { fromColId: fromColumnId, fromIndex } = dragInfo.value

  const fromColumn = board.value?.columns.find((c) => c.id === fromColumnId)
  const toColumn = board.value?.columns.find((c) => c.id === toColumnId)

  if (!fromColumn || !toColumn) return

  const [movedJob] = fromColumn.jobApplications.splice(fromIndex, 1)

  // If toIndex is not passed (dropped into an empty column area), add to the end
  const finalIndex = toIndex !== undefined ? toIndex : toColumn.jobApplications.length
  toColumn.jobApplications.splice(finalIndex, 0, movedJob as JobApplication)
  dragInfo.value = null
  // TODO: update API
}
</script>

<template>
  <h1>Board name: {{ board?.name }}</h1>
  <p>BoardId: {{ boardId }}</p>

  <div class="board">
    <div
      v-for="column in board?.columns"
      :key="column.id"
      class="column"
      @dragover="onDragOver"
      @drop.self="OnDrop($event, column.id)"
    >
      <h3 class="column-header">{{ column.name }}</h3>

      <div class="column-content">
        <div
          v-for="(job, index) in column.jobApplications"
          :key="job.id"
          class="card"
          v-on:click="openSelectedJobApplication(job)"
          draggable="true"
          @dragstart="OnDragStart($event, column.id, index)"
          @dragover="onDragOver"
          @drop.stop="OnDrop($event, column.id, index)"
        >
          {{ job.title }}
          <p>
            <small>{{ job.company?.name }}</small>
          </p>
        </div>

        <div
          class="drop-placeholder"
          @dragover="onDragOver"
          @drop="OnDrop($event, column.id)"
        ></div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <JobApplicationModal
      :job-application="selectedJobApplication"
      @close="closeSelectedJobApplication"
    >
      <template #header>
        <h3>Custom Header</h3>
      </template>
    </JobApplicationModal>
  </Teleport>
</template>

<style scoped>
.board {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f4f5f7;
  align-items: flex-start;
}

.column {
  background: #ebedf0;
  border-radius: 8px;
  width: 280px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
}

.column-content {
  padding: 10px;
  flex-grow: 1;
}

.card {
  background: white;
  margin-bottom: 8px;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.1s;
}

.card:active {
  cursor: grabbing;
}

.card:hover {
  border: 1px dashed #4a90e2;
}

.drop-placeholder {
  flex-grow: 1;
  min-height: 50px;
}
</style>
