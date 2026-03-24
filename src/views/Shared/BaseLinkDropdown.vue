<script setup lang="ts" generic="T extends BaseDto">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SearchIcon from '@/assets/SearchIcon.vue'
import type { BaseDto } from '@/models/base.dto'

const props = defineProps<{
  items: T[]
  searchFilter: (item: T, query: string) => boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'select', item: T): void
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref<HTMLElement | null>(null)

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return props.items
  return props.items.filter((item) => props.searchFilter(item, query))
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const selectItem = (item: T) => {
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
      <slot name="trigger">Select an option</slot>
    </button>

    <div v-if="isOpen" class="dropdown-panel">
      <div class="search-container">
        <span class="search-icon"><SearchIcon /></span>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="placeholder || 'Search ...'"
          autoFocus
          @click.stop
        />
      </div>

      <ul class="list">
        <li
          v-for="item in filteredItems"
          class="list-item"
          :key="item.id"
          @click="selectItem(item)"
        >
          <slot name="item" :item="item"></slot>
        </li>
        <li v-if="filteredItems.length === 0" class="no-results">No matches found</li>
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

/* Search Area */
.search-container {
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-color);
  gap: 8px;
}

.search-icon {
  display: flex;
  font-size: 14px;
  color: #9aa0a6;
}

.search-container input {
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
  color: #202124;
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

.no-results {
  padding: 16px;
  text-align: center;
  color: #9aa0a6;
  font-size: 13px;
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
