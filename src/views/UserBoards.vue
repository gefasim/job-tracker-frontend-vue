<script setup lang="ts">
import { api } from '@/api/api'
import { CurrentUserService } from '@/current-user.service'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const boards = ref()
const user = CurrentUserService.getUser()

const fetchData = async () => {
  const response = await api.boards.getAll()
  boards.value = response
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <h1>User's boards:</h1>
  <p>User firstName: {{ user?.firstName ?? 'null' }}</p>
  <div v-for="board in boards" :key="board.name">
    board name: {{ board.name }},
    <RouterLink :to="{ name: 'board', params: { boardId: board.id } }">{{ board.id }}</RouterLink>
  </div>
</template>

<style scoped></style>
