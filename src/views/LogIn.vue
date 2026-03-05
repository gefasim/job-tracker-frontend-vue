<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api.ts'

const credentials = ref({
  email: '',
  password: '',
})
const errorMessage = ref()
const router = useRouter()

const login = async () => {
  errorMessage.value = '' // Clear previous errors
  try {
    await api.post('/auth/login', JSON.stringify(credentials.value))
    router.push('/')
  } catch (error) {
    errorMessage.value = error
    throw error
  }
}
</script>

<template>
  <form @submit.prevent="login">
    <h1>Login</h1>
    <div>
      <label for="email">Email:</label>
      <input type="text" id="email" v-model="credentials.email" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="credentials.password" required />
    </div>
    <button type="submit">Log In</button>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </form>
</template>
