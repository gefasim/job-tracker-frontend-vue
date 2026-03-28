<script setup lang="ts">
import type { Board } from '@/models/board.dto'
import { useBoards } from '@/store/boardStore'
import { useNavbarFilter } from '@/store/navbarFilterStore'
import { computed, onMounted } from 'vue'
import GenericSelector from '../Shared/GenericSelector.vue'

const { textFilter, selectedBoard } = useNavbarFilter()
const { boards } = useBoards()
const availableBoards = computed(() => boards.value.filter((b) => !b.isArchived))

onMounted(() => {
  if (availableBoards.value.length > 0) {
    selectedBoard.value = availableBoards.value[0]!
  }
})

const onBoardChange = (board: Board) => {
  selectedBoard.value = board
}
</script>
<template>
  <nav class="top-navbar">
    <div class="nav-brand">
      <h2>Job Tracker</h2>
    </div>
    <div class="nav-menu">
      <GenericSelector
        :items="availableBoards"
        :selected-item="selectedBoard"
        label="Select Board:"
        display-property="name"
        value-property="id"
        id="board-select"
        :hideLabel="true"
        @update:selected-item="onBoardChange"
      />
      <input v-model="textFilter" type="text" placeholder="Search..." />
    </div>
  </nav>
</template>
<style scoped>
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}
.nav-brand h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
}
.nav-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
