<script setup lang="ts">
import { api } from '@/api/api'
import type { Board } from '@/models/board.dto'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const boards = ref<Board[]>()

const fetchData = async () => {
  const response = await api.boards.getAll()
  boards.value = response.filter((b) => !b.isArchived)
}

onMounted(() => {
  fetchData()
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
        v-for="board in boards"
        :key="board.name"
        class="board-card"
        @click="openBoard(board.id)"
      >
        <span class="board-card-title">
          {{ board.name }}
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
}
.board-card-title {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
