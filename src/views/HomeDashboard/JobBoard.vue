<script setup lang="ts">
import type { JobApplication } from '@/models/job-application.dto'
import { ref, watch } from 'vue'
import { api } from '@/api/api'
import CompanyImage from '@/views/Shared/CompanyImage.vue'
import CreateJobApplicationModal from '@/views/JobApplication/CreateJobApplicationModal.vue'
import { useRoute, useRouter } from 'vue-router'
import { getContrastColor } from '@/utils/colorContrast'
import { useCurrentBoard } from '@/store/currentBoardStore'
import { useBoards } from '@/store/boardStore'
import { useNavbarFilter } from '@/store/navbarFilterStore'
import DeleteIcon from '@/assets/icons/DeleteIcon.vue'

const { boardId } = defineProps<{
  boardId?: string
  jobId?: string // fix the warning Extraneous non-props attributes (jobId) were passed ...
}>()
const route = useRoute()
const router = useRouter()
const { textFilter } = useNavbarFilter()
const dragInfo = ref<{ fromColId: string; fromIndex: number } | null>(null)
const selectedColumnId = ref<string | null>()

const { boards } = useBoards()
const { board, loadBoard } = useCurrentBoard()
const isCreateJobModalOpen = ref<boolean>(false)

watch(
  () => route.params.boardId,
  async () => {
    if (!route.params.boardId) return
    await loadBoard(route.params.boardId as string)
  },
  { immediate: true },
)

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

const OnDrop = async (event: DragEvent, toColumnId: string, toIndex?: number) => {
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
  await api.jobs.updatePartial(movedJob!.id, { columnId: toColumn.id })
}

// TODO: replace with RouterLink + stretched-link to be able click on any part of card. Fix Drag&Drop is required in this scenario
const openJobApplication = (jobId: string) => {
  router.push({ name: 'job-application', params: { boardId: boardId, jobId: jobId } })
}

// On CreateJobApplicationModal
const onCreateJobApplicationModalOpened = (columnId: string) => {
  selectedColumnId.value = columnId
  isCreateJobModalOpen.value = true
}

const onCreateJobApplicationModalClosed = () => {
  selectedColumnId.value = null
  isCreateJobModalOpen.value = false
}

const onCreateJobApplicationModalSaved = (job: JobApplication) => {
  if (board.value?.columns.some((c) => c.id === job.columnId)) {
    board.value?.columns.find((c) => c.id === job.columnId)!.jobApplications.push(job)
  }

  selectedColumnId.value = null
  isCreateJobModalOpen.value = false
}

const deleteJob = async (jobId: string, columnId: string, index: number) => {
  if (confirm('Are you sure you want to delete this job?')) {
    await api.jobs.delete(jobId)
    board.value?.columns.find((c) => c.id === columnId)!.jobApplications.splice(index, 1)
  }
}
</script>

<template>
  <div class="board">
    <div
      v-for="column in board?.columns"
      :key="column.id"
      class="column"
      @dragover="onDragOver"
      @drop.self="OnDrop($event, column.id)"
    >
      <div class="column-header">
        <h3>{{ column.name }}</h3>
        <span>{{ column.jobApplications.length }} JOBS</span>
        <button v-on:click="onCreateJobApplicationModalOpened(column.id)" class="btn-outline">
          +
        </button>
      </div>

      <div class="column-content" @dragover="onDragOver" @drop="OnDrop($event, column.id)">
        <div
          v-for="(job, index) in textFilter
            ? column.jobApplications.filter((j) =>
                j.title.toLowerCase().includes(textFilter.toLowerCase()),
              )
            : column.jobApplications"
          :key="job.id"
          class="card card-default-color"
          :style="{
            backgroundColor: job.color,
            color: getContrastColor(job.color),
          }"
          v-on:click="openJobApplication(job.id)"
          draggable="true"
          @dragstart="OnDragStart($event, column.id, index)"
          @dragover="onDragOver"
          @drop.stop="OnDrop($event, column.id, index)"
        >
          <span class="card-title">{{ job.title }}</span>
          <p class="card-company">
            <CompanyImage :src="job.company!.logo" :alt="job.company!.name"></CompanyImage>
            <small>{{ job.company?.name }}</small>
          </p>
          <button class="delete-job-btn" @click.stop="deleteJob(job.id, column.id, index)">
            <DeleteIcon size="1.1rem" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <RouterView v-slot="{ Component }">
    <component :is="Component" v-if="Component" />
  </RouterView>
  <Teleport to="body">
    <CreateJobApplicationModal
      v-if="isCreateJobModalOpen"
      :boardId="board!.id"
      :columnId="selectedColumnId!"
      :boards="boards!"
      @save="onCreateJobApplicationModalSaved"
      @close="onCreateJobApplicationModalClosed"
    />
  </Teleport>
</template>

<style scoped>
.board {
  display: flex;
  align-items: flex-start;
}

.column {
  width: 20%;
  height: stretch;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-right: 1px solid var(--border-color);
}
.column:last-child {
  border-right: 0;
}

.column-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.column-header h3 {
  margin: 0;
}
.column-header button {
  margin-top: 10px;
  width: stretch;
}
.column-header button:hover {
  border-color: var(--btn-primary-bg);
}

.column-content {
  padding-top: 20px;
  flex-grow: 1;
}

/* Card */
.card {
  position: relative;
  margin-bottom: 8px;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.1s;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: auto;
}

.card-default-color {
  background-color: white;
}

.card:active {
  cursor: grabbing;
}

.card:hover {
  border: 1px dashed #4a90e2;
}

.card-title {
  font-weight: 600;
}

.card-company {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.delete-job-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--btn-outline-bg);
  border: none;
  color: var(--input-text);
  cursor: pointer;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
}
.delete-job-btn:hover {
  background-color: var(--border-color);
  color: #dc2626;
}
.card:hover .delete-job-btn {
  opacity: 1;
}
</style>
