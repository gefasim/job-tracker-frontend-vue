<script setup lang="ts">
import type { Board } from '@/types/dtos/board.dto'
import { useBoards } from '@/stores/boardStore'
import BaseModalWrapper from '@/components/common/BaseModalWrapper.vue'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', board: Board): void
}>()

const boardName = ref('')
const { createBoard } = useBoards()

const handleSave = async () => {
  const board = await createBoard(boardName.value)
  emit('save', board)
}
</script>

<template>
  <BaseModalWrapper title="Create Board" width="28rem" @save="handleSave" @close="emit('close')">
    <template #body>
      <div class="create-board-modal">
        <div class="warning-message">
          <span><b>Are you sure you want to create a new board?</b></span>
          <span>We suggest having only one board per job search throughout your career.</span>
        </div>
        <input
          id="board-name"
          v-model="boardName"
          type="text"
          placeholder="Board name (e.g., Job Search 2024)"
        />
      </div>
    </template>
  </BaseModalWrapper>
</template>

<style scoped>
.create-board-modal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.warning-message {
  display: flex;
  flex-direction: column;

  background-color: #fef08a;
  border-radius: 8px;
  padding: 1rem;
  color: black;
}
</style>
