<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '@/store/themeStore'

const { applyTheme } = useTheme()
onMounted(() => {
  applyTheme()

  // Listen for system theme changes (e.g. user changes OS settings)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
