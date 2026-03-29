<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  items: string[]
}>()

const emit = defineEmits<{
  (e: 'select', item: string): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectItem = (item: string) => {
  emit('select', item)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div class="base-dropdown" ref="dropdownRef">
    <button
      type="button"
      class="btn-outline"
      :class="{ 'is-active': isOpen }"
      @click="toggleDropdown"
    >
      <slot name="buttonValue">Select an option</slot>
    </button>

    <div v-if="isOpen" class="dropdown-panel">
      <ul class="list">
        <li v-for="item in items" class="list-item" :key="item" @click="selectItem(item)">
          <slot name="item" :item="item"></slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.base-dropdown {
  position: relative;
  width: fit-content;
}

/* Main Panel */
.dropdown-panel {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: max-content;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* List Area */
.list {
  margin: 0;
  padding: 4px 0;
  list-style: none;
  max-height: 250px;
  overflow-y: auto;
}

.list-item {
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.1s;
}

.list-item:hover {
  background-color: #f1f3f4;
}

.list-item:hover {
  background-color: color-mix(in srgb, var(--bg-main), black 10%);
}

html.dark .list-item:hover {
  background-color: color-mix(in srgb, var(--bg-main), white 10%);
}

/* Custom Scrollbar */
.list::-webkit-scrollbar {
  width: 6px;
}
.list::-webkit-scrollbar-thumb {
  background: #dadce0;
  border-radius: 10px;
}
</style>
