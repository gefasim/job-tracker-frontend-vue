<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBoards } from '@/store/boardStore'
import { useNavbarFilter } from '@/store/navbarFilterStore'
import { computed, ref } from 'vue'
import BaseCardWithMenu from '../Shared/BaseCardWithMenu.vue'

const router = useRouter()
const { boards, updateBoard } = useBoards()
const { textFilter: boardNameFilter } = useNavbarFilter()
const showArchived = ref(false)
const editModeForBoardId = ref<string | null>(null)
const boardMenuOptions = ['Edit', 'Archive']
const archivedBoardMenuOptions = ['Unarchive']

const vFocus = {
  mounted: (el: HTMLElement) => el.focus(),
}

const filteredBoards = computed(() => {
  if (!boardNameFilter.value)
    return boards.value.filter((board) => board.isArchived === showArchived.value)
  return boards.value.filter(
    (board) =>
      board.isArchived === showArchived.value &&
      board.name.toLowerCase().includes(boardNameFilter.value.toLowerCase()),
  )
})

const handleOnBoardClick = (boardId: string) => {
  if (editModeForBoardId.value) return
  router.push({ name: 'board', params: { boardId } })
}

const handleMenuItemClick = async (boardId: string, item: string) => {
  if (item === 'Edit') {
    editModeForBoardId.value = boardId
  } else if (item === 'Archive') {
    if (confirm('Are you sure you want to archive this board?')) {
      await updateBoard(boardId, { isArchived: true })
    }
  } else if (item === 'Unarchive') {
    if (confirm('Are you sure you want to unarchive this board?')) {
      await updateBoard(boardId, { isArchived: false })
    }
  }
}

const handleClose = () => {
  editModeForBoardId.value = null
}

const handleSave = async (boardId: string, boardName: string | undefined) => {
  if (!boardName) return
  await updateBoard(boardId, { name: boardName })
  editModeForBoardId.value = null
}
</script>

<template>
  <div class="boards-view">
    <div class="boards-view-header">
      <h3>My Job Tracking Boards</h3>
      <p class="boards-view-archived" @click="showArchived = !showArchived">
        {{ showArchived ? 'Hide archived' : 'View archived' }}
      </p>
      <hr />
    </div>

    <div class="board-card-grid">
      <BaseCardWithMenu
        v-for="board in filteredBoards"
        :key="board.name"
        :menuItems="showArchived ? archivedBoardMenuOptions : boardMenuOptions"
        @menu-item-click="handleMenuItemClick(board.id, $event)"
        @open="handleOnBoardClick(board.id)"
      >
        <div class="board-card">
          <span v-if="editModeForBoardId !== board.id" class="board-card-title">
            {{ board.name }}
          </span>
          <input
            v-else
            v-focus
            type="text"
            :value="board.name"
            @keyup.enter="handleSave(board.id, ($event.target as HTMLInputElement).value)"
            @keyup.escape="handleClose"
            @blur="handleClose"
          />
          <span class="board-card-created">
            Created: {{ new Date(board.createdAt).toLocaleDateString() }}
          </span>
        </div>
      </BaseCardWithMenu>
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
}
</style>
