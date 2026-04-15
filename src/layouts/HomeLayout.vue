<script setup lang="ts">
import { useUser } from '@/stores/userStore'
import { computed } from 'vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import GuestHome from '@/layouts/GuestHome.vue'

const { isAuthenticated } = useUser()

const homeLayout = computed(() => {
  return isAuthenticated.value ? AuthenticatedLayout : GuestHome
})
</script>

<template>
  <component :is="homeLayout">
    <slot />
  </component>
</template>
