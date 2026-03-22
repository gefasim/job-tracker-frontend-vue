<script setup lang="ts">
import DefaultCompanyLogo from '@/assets/DefaultCompanyLogo.vue'
import { ref, watch } from 'vue'

const props = defineProps<{
  src: string | null
  alt: string
}>()

const hasError = ref(false)

// Reset error state if the source changes (e.g., during a new search)
watch(
  () => props.src,
  () => {
    hasError.value = false
  },
)
</script>

<template>
  <div class="image-container">
    <img
      v-if="src && !hasError"
      :src="src"
      :alt="alt"
      @error="hasError = true"
      class="company-img"
    />
    <DefaultCompanyLogo v-else class="fallback-icon" />
  </div>
</template>

<style scoped>
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
.company-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
