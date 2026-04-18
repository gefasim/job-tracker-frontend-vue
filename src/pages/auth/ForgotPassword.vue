<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import { checkPasswordStrength } from '@/utils/validators'

const email = ref('')
const code = ref('')
const newPassword = ref('')
const repeatPassword = ref('')
const errorMessage = ref('')
const step = ref(1)

const router = useRouter()

const isPasswordStrong = computed<boolean>(() => checkPasswordStrength(newPassword.value))

const sendResetCode = async () => {
  errorMessage.value = ''
  try {
    await api.users.sendPasswordResetCode(email.value)

    step.value = 2
  } catch {
    errorMessage.value = 'Failed to send reset code. Please try again.'
  }
}

const resetPassword = async () => {
  errorMessage.value = ''
  try {
    await api.users.resetPassword(email.value, code.value, newPassword.value)

    router.push('/login')
  } catch {
    errorMessage.value = 'Failed to reset password. Please check your code or try again.'
  }
}
</script>

<template>
  <div class="reset-page">
    <div class="reset-container">
      <div class="header">
        <h1>Forgot Password</h1>
        <p v-if="step === 1">Enter your email</p>
      </div>
      <div class="form">
        <template v-if="step === 1">
          <div class="input-group">
            <label for="email">Email</label>
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@domain.com"
              required
            />
          </div>
          <button class="btn-primary" :disabled="!email" @click="sendResetCode">
            Send Password Reset Code
          </button>
        </template>

        <template v-else>
          <div class="input-group">
            <label for="code">Reset Password Code</label>
            <input
              v-model="code"
              id="verificationCode"
              name="verificationCode"
              type="text"
              placeholder="Enter 6-digit code"
              required
            />
          </div>
          <div class="input-group">
            <label for="newPassword">New Password</label>
            <input
              v-model="newPassword"
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div class="input-group" style="margin-bottom: 0">
            <label for="repeatPassword">Repeat New Password</label>
            <input
              v-model="repeatPassword"
              id="repeatPassword"
              name="repeatPassword"
              type="password"
              placeholder="Re-enter your new password"
              required
            />
          </div>

          <p class="password-hint" v-if="!isPasswordStrong && newPassword.length > 0">
            <b>*At least:</b> 8 characters, 1 number, 1 upper, 1 lower.
          </p>

          <button
            class="btn-primary"
            :disabled="!code || !newPassword || newPassword !== repeatPassword || !isPasswordStrong"
            @click="resetPassword"
          >
            Reset Password
          </button>
        </template>

        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      </div>
      <p>Go back to <router-link to="/login" class="link">Log in</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.reset-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.reset-container {
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  flex-direction: column;
}
.header h1 {
  margin: 0;
  margin-bottom: 0.5rem;
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
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.password-hint {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
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
</style>
