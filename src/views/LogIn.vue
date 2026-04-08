<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/store/userStore'

const email = ref('')
const password = ref('')
const errorMessage = ref()
const router = useRouter()
const { login: loginUser } = useUser()

const login = async () => {
  errorMessage.value = ''
  try {
    await loginUser(email.value, password.value)
    router.push('/')
  } catch {
    errorMessage.value = 'Invalid credentials or user not found.'
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="header">
        <h1>Login</h1>
        <p>Log into your account</p>
      </div>
      <div class="form">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            v-model="email"
            id="email"
            name="email"
            type="text"
            placeholder="john.doe@domain.com"
            required
          />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            name="password"
            placeholder="********"
            required
          />
        </div>
        <button class="btn-primary" :disabled="email === '' || password === ''" @click="login">
          Log In
        </button>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      </div>
      <p>Don't have an account? <router-link to="/register" class="link">Sign up</router-link></p>
      <p>
        Forgot your password?
        <router-link to="/reset-password" class="link">Reset password</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.login-container {
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  flex-direction: column;
}
.header h1 {
  margin: 0;
}
.header p {
  color: #64748b;
  margin: 0;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 30vw;
}
button {
  width: stretch;
  margin-top: 0.5rem;
}
.link {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: inherit;
}
p {
  color: #64748b;
  margin-bottom: 0;
}
p:last-child {
  margin-top: 0.2rem;
}
</style>
