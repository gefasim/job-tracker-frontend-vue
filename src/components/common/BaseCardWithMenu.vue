<script setup lang="ts">
import BaseButtonDropdown from './BaseButtonDropdown.vue'
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{
  menuItems: string[]
}>()
const emit = defineEmits(['open', 'menu-item-click'])
const isMenuOpen = ref(false)

const handleMenuItemClick = (item: string) => {
  emit('menu-item-click', item)
  isMenuOpen.value = false
}

const closeMenu = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.menu-container')) {
    isMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeMenu))
onUnmounted(() => document.removeEventListener('click', closeMenu))
</script>

<template>
  <div class="base-card-with-menu">
    <div class="card-content" @click="emit('open')">
      <slot></slot>
    </div>
    <div class="menu-container">
      <BaseButtonDropdown
        :items="menuItems"
        button-style="card-menu-btn"
        @select="handleMenuItemClick"
      >
        <template #buttonValue>•••</template>
        <template #item="{ item }">{{ item }}</template>
      </BaseButtonDropdown>
    </div>
  </div>
</template>

<style scoped>
.base-card-with-menu {
  position: relative;
}
.card-content {
  flex-grow: 1;
}
/* Menu */
.menu-container {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
