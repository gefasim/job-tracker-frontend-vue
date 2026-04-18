<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import { checkPasswordStrength } from '@/utils/validators'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const isPasswordStrong = computed<boolean>(() => checkPasswordStrength(password.value))

const register = async () => {
  errorMessage.value = ''
  try {
    await api.users.create({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    })
    router.push({ path: '/verify-email', query: { email: email.value } })
  } catch {
    errorMessage.value = 'Failed to create account. Please check your details.'
  }
}
</script>

<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="header">
        <h1>Sign Up for Free</h1>
        <p>Track your job applications online!</p>
      </div>
      <div class="form">
        <div class="name-row">
          <div class="input-group">
            <label for="firstName">First Name</label>
            <input
              v-model="firstName"
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              required
            />
          </div>
          <div class="input-group">
            <label for="lastName">Last Name</label>
            <input
              v-model="lastName"
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              required
            />
          </div>
        </div>
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
        <div class="input-group" style="margin-bottom: 0">
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
        <p class="password-hint" v-if="!isPasswordStrong && password.length > 0">
          <b>*At least:</b> 8 characters, 1 number, 1 upper, 1 lower.
        </p>
        <button
          class="btn-primary"
          :disabled="!firstName || !lastName || !email || !isPasswordStrong"
          @click="register"
        >
          Create Account
        </button>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      </div>
      <p>Already have an account? <router-link to="/login" class="link">Log in</router-link></p>
      <div class="footer-terms">
        <p>
          By continuing, you agree to JobTracker's<br />
          <a href="#" class="link">Terms of Service</a> and
          <a href="#" class="link">Privacy Policy</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.signup-container {
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
.name-row {
  display: flex;
  gap: 1rem;
}
.name-row .input-group {
  flex: 1;
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
.footer-terms {
  margin-top: 1rem;
}
.footer-terms p {
  line-height: 1.5;
}
</style>
