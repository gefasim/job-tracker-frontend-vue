<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const credentials = ref({
  email: '',
  password: '',
})
const errorMessage = ref()
const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL + 'auth/login/'

const login = async () => {
  errorMessage.value = '' // Clear previous errors
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials.value),
    })
    if (!response.ok) {
      errorMessage.value = response.statusText
      throw new Error('Login error')
    }
    const data = await response.json()
    console.log(data)
    router.push('/')
  } catch (error) {
    console.error(error)
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
