<script setup lang="ts">
import api from '@/api'
import type { Board } from '@/models/board.dto'
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
</script>

<template>
  <h1>Board name: {{ board?.name }}</h1>
  <p>BoardId: {{ boardId }}</p>
</template>

<style scoped></style>
