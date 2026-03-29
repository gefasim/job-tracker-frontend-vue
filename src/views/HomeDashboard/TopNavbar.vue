<script setup lang="ts">
import type { Board } from '@/models/board.dto'
import { useBoards } from '@/store/boardStore'
import { useNavbarFilter } from '@/store/navbarFilterStore'
import { computed, onMounted, watch } from 'vue'
import GenericSelector from '../Shared/GenericSelector.vue'
import { useRoute, useRouter } from 'vue-router'
import ContactNavTabIcon from '@/assets/icons/ContactNavTabIcon.vue'
import DocumentNavTabIcon from '@/assets/icons/DocumentNavTabIcon.vue'
import BoardIcon from '@/assets/icons/BoardIcon.vue'

const { textFilter, selectedBoard } = useNavbarFilter()
const { boards } = useBoards()
const route = useRoute()
const router = useRouter()
const availableBoards = computed(() => boards.value.filter((b) => !b.isArchived))

const syncSelectedBoard = () => {
  if (availableBoards.value.length == 0) return
  if (route.params.boardId) {
    const found = availableBoards.value.find((b) => b.id === route.params.boardId)
    selectedBoard.value = found || availableBoards.value[0]!
  } else {
    selectedBoard.value = availableBoards.value[0]!
  }
}

onMounted(() => {
  syncSelectedBoard()
})

watch(
  () => route.params.boardId,
  () => {
    syncSelectedBoard()
  },
)

const onBoardChange = (board: Board) => {
  selectedBoard.value = board
  // Redirects to another board page if user is currently on a board page
  if (route.params.boardId) {
    router.push({ name: 'board', params: { boardId: board.id } })
  }
}
</script>
<template>
  <nav class="top-navbar">
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
    <div class="nav-menu">
      <RouterLink
        :to="{ name: 'board', params: { boardId: selectedBoard?.id } }"
        class="sidebar-item"
        active-class="active"
      >
        <BoardIcon /> Board
      </RouterLink>
      <RouterLink to="/contacts" class="sidebar-item" active-class="active">
        <ContactNavTabIcon /> Contacts
      </RouterLink>
      <RouterLink to="/documents" class="sidebar-item" active-class="active">
        <DocumentNavTabIcon /> Documents
      </RouterLink>
    </div>
  </nav>
</template>
<style scoped>
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border-color);
}
.nav-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
