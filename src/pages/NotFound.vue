<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="error-code">404</div>
      <h1 class="title">Page Not Found</h1>
      <p class="description">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <button class="btn-primary back-home" @click="goHome">
        Go Back Home
      </button>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  padding: 2rem;
}
.error-code {
  font-size: 6rem;
  font-weight: 800;
  color: #3b82f6; /* matching link color in auth pages */
  line-height: 1;
  margin-bottom: 1rem;
}
.title {
  font-size: 2rem;
  margin: 0 0 1rem 0;
  color: #0f172a; /* darker text */
}
.description {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.5;
}
.back-home {
  width: auto;
  padding: 0.75rem 1.5rem;
}
</style>
