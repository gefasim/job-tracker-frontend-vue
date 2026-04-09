<script setup lang="ts">
withDefaults(defineProps<{ size?: string }>(), {
  size: '1rem',
})
</script>

<template>
  <svg
    fill="none"
    stroke-width="2"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    :height="size"
    :width="size"
    stroke="currentColor"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
</template>
