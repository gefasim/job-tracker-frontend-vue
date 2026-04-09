<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '@/api/api'

const route = useRoute()
const router = useRouter()
const email = computed(() => (route.query.email as string) || '')
const code = ref('')
const errorMessage = ref('')

const verifyEmail = async () => {
  errorMessage.value = ''
  try {
    await api.users.verifyEmail(email.value, code.value)
    router.push('/login')
  } catch {
    errorMessage.value = 'Invalid code. Please try again.'
  }
}

const resendCode = async () => {
  await api.users.createEmailVerificationCode(email.value)
}

const restartSignup = () => {
  router.push('/signup')
}
</script>

<template>
  <div class="verify-page">
    <div class="verify-container">
      <div class="left-section">
        <div class="header">
          <h1>Verify Email</h1>
          <p>
            Enter the code sent to <span>{{ email }}</span>
          </p>
        </div>
        <div class="form">
          <div class="input-group">
            <label for="verificationCode">Verification code</label>
            <input
              v-model="code"
              id="verificationCode"
              name="verificationCode"
              type="text"
              placeholder="Enter 6-digit code"
              required
            />
          </div>
          <button class="btn-primary" :disabled="!code" @click="verifyEmail">Verify Email</button>
          <div class="resend-link">
            <a href="#" class="link" @click.prevent="resendCode">or create new and resend code</a>
          </div>
          <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
        </div>
      </div>

      <div class="right-section">
        <div class="info-card">
          <h3>Didn't receive the email?</h3>
          <p>
            Is <strong>{{ email }}</strong> the correct email address? If not,
            <a href="#" class="link" @click.prevent="restartSignup">restart your signup</a>.
          </p>
          <p>It may take up to 10 minutes to receive the email</p>
          <p>Check your spam</p>
          <p>
            Create new and resend code by clicking
            <a href="#" class="link" @click.prevent="resendCode">here</a>
          </p>
          <hr />
          <p class="mt-4">
            If you haven't received the verification email after multiple tries,
            <router-link to="/contact-us" class="link">contact us</router-link>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verify-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
}

.verify-container {
  display: flex;
  flex-direction: row;
  gap: 4rem;
  max-width: 1000px;
  width: 100%;
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0 0 0.5rem 0;
}

.header p {
  color: #64748b;
  margin: 0;
  font-size: 1.1rem;
}

.header span {
  color: #94a3b8;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
}

.input-group input {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background-color: #0f172a;
  color: white;
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

button {
  width: stretch;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
}

.resend-link {
  text-align: center;
}

.resend-link .link {
  font-weight: normal;
  text-decoration: underline;
}

.right-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.info-card {
  background-color: transparent;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-left: 1rem;
}

.info-card h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.info-card p {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.5;
}

.info-card a {
  text-decoration: none;
}

hr {
  border: 0;
  border-top: 1px solid #334155;
  margin: 0.5rem 0;
}

.link {
  color: #3b82f6;
  text-decoration: none;
}

.mt-4 {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .verify-container {
    flex-direction: column;
    gap: 2rem;
  }
  .info-card {
    margin-left: 0;
  }
}
</style>
