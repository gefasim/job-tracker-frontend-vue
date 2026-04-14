<script setup lang="ts">
import AvatarIcon from '@/assets/icons/AvatarIcon.vue'
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string | null
    alt?: string
    size?: string
  }>(),
  {
    alt: 'Profile',
    size: '32px',
  },
)

const imageSizeStyle = computed(() => {
  return {
    width: props.size,
    height: props.size,
  }
})

const fallbackIconSizeStyle = computed(() => {
  return {
    width: `calc(${props.size} / 2)`,
    height: `calc(${props.size} / 2)`,
  }
})

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
  <div class="image-container" :style="imageSizeStyle">
    <img
      v-if="src && !hasError"
      :src="src"
      :alt="alt"
      @error="hasError = true"
      class="profile-logo"
    />
    <AvatarIcon v-else :style="fallbackIconSizeStyle" />
  </div>
</template>

<style scoped>
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  overflow: hidden;
}
.profile-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
