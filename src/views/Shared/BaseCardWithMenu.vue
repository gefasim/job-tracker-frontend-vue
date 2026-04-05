<script setup lang="ts">
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
      <button class="menu-btn" @click.stop="isMenuOpen = !isMenuOpen">•••</button>
      <div v-if="isMenuOpen" class="dropdown-menu">
        <div v-for="item in menuItems" :key="item" @click="handleMenuItemClick(item)">
          {{ item }}
        </div>
      </div>
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
.menu-btn {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 4px 8px;
  cursor: pointer;
  color: var(--input-text);
  letter-spacing: 1px;
}
.menu-btn:hover {
  background-color: color-mix(in srgb, var(--bg-card), black 10%);
  border-color: color-mix(in srgb, var(--border-color), black 10%);
}

html.dark .menu-btn:hover {
  background-color: color-mix(in srgb, var(--bg-card), white 10%);
  border-color: color-mix(in srgb, var(--border-color), white 10%);
}
.dropdown-menu {
  position: absolute;
  right: 0;
  bottom: 100%;
  margin-bottom: 4px;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 120px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.dropdown-menu > div {
  background: none;
  border: none;
  padding: 10px 16px;
  text-align: left;
  font-size: 13px;
  cursor: pointer;
}
.dropdown-menu > div:hover {
  background: #f1f3f4;
}
</style>
