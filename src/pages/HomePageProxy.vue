<script setup lang="ts">
import { useUser } from '@/stores/userStore'
import { computed } from 'vue'
import BoardDashboard from './BoardDashboard.vue'
import LandingPage from './LandingPage.vue'

const { isAuthenticated } = useUser()

const page = computed(() => {
  return isAuthenticated.value ? BoardDashboard : LandingPage
})
</script>

<!-- 
As well as HomeLayoutProxy determines which component to render at `/` path.
Instead of HomeLayoutProxy (which is a layout with navbar, footer and/or sidebar),
this selects a landing page or boards.
-->
<template>
  <component :is="page">
    <slot />
  </component>
</template>
