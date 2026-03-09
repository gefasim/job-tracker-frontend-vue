<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CurrentUserService } from '@/current-user.service.ts'
import { api } from '@/api/api'

const credentials = ref({
  email: '',
  password: '',
})
const errorMessage = ref()
const router = useRouter()

const login = async () => {
  errorMessage.value = '' // Clear previous errors
  try {
    //const response = await api.post('/auth/login', JSON.stringify(credentials.value))
    const response = await api.auth.login(credentials.value.email, credentials.value.password)
    CurrentUserService.setUser(response)
    router.push('/boards')
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
