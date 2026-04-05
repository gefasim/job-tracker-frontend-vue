<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBoards } from '@/store/boardStore'
import { useNavbarFilter } from '@/store/navbarFilterStore'
import { computed } from 'vue'

const router = useRouter()
const { boards } = useBoards()
const { textFilter: boardNameFilter } = useNavbarFilter()

const filteredBoards = computed(() => {
  if (!boardNameFilter.value) return boards.value
  return boards.value.filter((board) =>
    board.name.toLowerCase().includes(boardNameFilter.value.toLowerCase()),
  )
})

const openBoard = (boardId: string) => {
  router.push({ name: 'board', params: { boardId } })
}
</script>

<template>
  <div class="boards-view">
    <div class="boards-view-header">
      <h3>My Job Tracking Boards</h3>
      <p class="boards-view-archived">view archived</p>
      <hr />
    </div>

    <div class="board-card-grid">
      <div
        v-for="board in filteredBoards"
        :key="board.name"
        class="board-card"
        @click="openBoard(board.id)"
      >
        <span class="board-card-title">
          {{ board.name }}
        </span>
        <span class="board-card-created">
          Created: {{ new Date(board.createdAt).toLocaleDateString() }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.boards-view {
  padding: 10%;
}
.boards-view-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.boards-view-archived {
  font-weight: 400;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
}
.board-card-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.board-card {
  background: var(--bg-card);
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  gap: 1rem;
}

.board-card:hover {
  background-color: color-mix(in srgb, var(--bg-card), black 10%);
  border-color: color-mix(in srgb, var(--border-color), black 10%);
}

html.dark .board-card:hover {
  background-color: color-mix(in srgb, var(--bg-card), white 10%);
  border-color: color-mix(in srgb, var(--border-color), white 10%);
}

.board-card-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.board-card-created {
  font-size: 0.8rem;
  font-weight: 200;
  color: var(--text-secondary);
}
</style>
