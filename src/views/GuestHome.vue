<script setup lang="ts">
import GuestNavbar from './Guest/GuestNavbar.vue'
import GuestFooter from './Guest/GuestFooter.vue'
</script>

<template>
  <div class="guest-layout">
    <GuestNavbar />
    <RouterView />
    <GuestFooter />
  </div>
</template>

<style scoped>
/* Reset and base variables for layout */
.guest-layout {
  /* Light Theme variables by default */
  --text-secondary: #374151;
  --text-muted: #6b7280;

  --nav-bg: rgba(255, 255, 255, 0.8);
  --nav-border: rgba(0, 0, 0, 0.1);

  --hero-bg: radial-gradient(
    circle at 30% 50%,
    rgba(220, 230, 255, 1) 0%,
    rgba(249, 250, 251, 1) 100%
  );
  --sec-blue-bg: radial-gradient(
    circle at 20% 50%,
    rgba(210, 235, 255, 1) 0%,
    rgba(249, 250, 251, 1) 100%
  );
  --sec-purple-bg: radial-gradient(
    circle at 20% 50%,
    rgba(240, 220, 255, 1) 0%,
    rgba(249, 250, 251, 1) 100%
  );
  --sec-green-bg: radial-gradient(
    circle at 20% 50%,
    rgba(220, 250, 230, 1) 0%,
    rgba(249, 250, 251, 1) 100%
  );
  --sec-orange-bg: radial-gradient(
    circle at 20% 50%,
    rgba(255, 235, 210, 1) 0%,
    rgba(249, 250, 251, 1) 100%
  );
  --sec-companies-bg: radial-gradient(
    circle at 20% 50%,
    rgba(230, 230, 230, 1) 0%,
    rgba(249, 250, 251, 1) 100%
  );

  --footer-bg: #f3f4f6;
  --footer-border: rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  scroll-behavior: smooth;
}

html.dark .guest-layout {
  --text-secondary: #d1d5db;
  --text-muted: #9ca3af;

  --nav-bg: rgba(3, 7, 18, 0.8);
  --nav-border: rgba(255, 255, 255, 0.1);

  --hero-bg: radial-gradient(circle at 30% 50%, rgba(20, 30, 60, 1) 0%, rgba(3, 7, 18, 1) 100%);
  --sec-blue-bg: radial-gradient(circle at 20% 50%, rgba(20, 50, 70, 1) 0%, rgba(3, 7, 18, 1) 100%);
  --sec-purple-bg: radial-gradient(
    circle at 20% 50%,
    rgba(50, 10, 70, 1) 0%,
    rgba(3, 7, 18, 1) 100%
  );
  --sec-green-bg: radial-gradient(
    circle at 20% 50%,
    rgba(10, 60, 30, 1) 0%,
    rgba(3, 7, 18, 1) 100%
  );
  --sec-orange-bg: radial-gradient(
    circle at 20% 50%,
    rgba(80, 40, 10, 1) 0%,
    rgba(3, 7, 18, 1) 100%
  );
  --sec-companies-bg: radial-gradient(
    circle at 20% 50%,
    rgba(80, 10, 10, 1) 0%,
    rgba(3, 7, 18, 1) 100%
  );

  --footer-bg: #000;
  --footer-border: rgba(255, 255, 255, 0.1);
}
</style>
