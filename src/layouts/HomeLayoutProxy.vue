<script setup lang="ts">
import { useUser } from '@/stores/userStore'
import { computed } from 'vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'

const { isAuthenticated } = useUser()

const homeLayout = computed(() => {
  return isAuthenticated.value ? AuthenticatedLayout : GuestLayout
})
</script>

<template>
  <component :is="homeLayout">
    <slot />
  </component>
</template>
