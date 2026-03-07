<script setup lang="ts">
import api from '@/api'
import type { Board } from '@/models/board.dto'
import type { JobApplication } from '@/models/job-application.dto'
import { ref, watch } from 'vue'

const { boardId } = defineProps<{ boardId?: string }>()

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

const handleDragStart = (event: DragEvent, jobId: string, fromColumnId: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('jobId', jobId)
    event.dataTransfer.setData('fromColumnId', fromColumnId)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent, toColumnId: string) => {
  const jobId = event.dataTransfer?.getData('jobId')
  const fromColumnId = event.dataTransfer?.getData('fromColumnId')

  if (fromColumnId === toColumnId) return

  const fromColumn = board.value?.columns.find((c) => c.id === fromColumnId)
  const toColumn = board.value?.columns.find((c) => c.id === toColumnId)

  if (fromColumn && toColumn) {
    const jobIndex = fromColumn.jobApplications.findIndex((j) => j.id === jobId)
    const [job] = fromColumn.jobApplications.splice(jobIndex, 1)
    toColumn.jobApplications.push(job as JobApplication)
    // TODO: update jobApplication
  }
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
      @dragover="handleDragOver"
      @drop="handleDrop($event, column.id)"
    >
      <h3 class="column-title">{{ column.name }} ({{ column.jobApplications.length }})</h3>

      <div class="column-content">
        <div
          v-for="job in column.jobApplications"
          :key="job.id"
          class="card"
          draggable="true"
          @dragstart="handleDragStart($event, job.id, column.id)"
        >
          <strong>{{ job.title }}</strong>
          <p>{{ job.company?.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  align-items: flex-start;
  background: #f0f2f5;
  min-height: 100vh;
}

.column {
  background: #ebedf0;
  width: 300px;
  border-radius: 8px;
  padding: 1rem;
  min-height: 200px; /* Щоб була зона для drop, якщо колонка порожня */
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 150px;
}

.card {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: grab;
  user-select: none;
}

.card:active {
  cursor: grabbing;
}

/* Візуальний фідбек при перетягуванні */
.card-dragging {
  opacity: 0.5;
}
</style>
