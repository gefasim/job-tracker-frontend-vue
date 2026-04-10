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
    <path d="M3 21h18"></path>
    <path d="M5 21V7l8-4v18"></path>
    <path d="M19 21V11l-6-4"></path>
    <path d="M9 9v.01"></path>
    <path d="M9 12v.01"></path>
    <path d="M9 15v.01"></path>
    <path d="M9 18v.01"></path>
  </svg>
</template>
