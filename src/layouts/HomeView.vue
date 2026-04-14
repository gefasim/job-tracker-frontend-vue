<script setup lang="ts">
import { useUser } from '@/stores/userStore'
import { computed } from 'vue'
import AuthenticatedHome from '@/pages/AuthenticatedHome.vue'
import GuestHome from '@/pages/GuestHome.vue'

const { isAuthenticated } = useUser()

const homeLayout = computed(() => {
  return isAuthenticated.value ? AuthenticatedHome : GuestHome
})
</script>

<template>
  <component :is="homeLayout">
    <slot />
  </component>
</template>
