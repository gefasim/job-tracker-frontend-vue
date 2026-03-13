<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { JobApplication } from '@/models/job-application.dto'
import SearchIcon from '@/assets/SearchIcon.vue'

const props = defineProps<{
  items: JobApplication[]
}>()

const emit = defineEmits(['select'])

const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref<HTMLElement | null>(null)

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return props.items

  return props.items.filter(
    (item) =>
      item.title.toLowerCase().includes(query) || item.company?.name.toLowerCase().includes(query),
  )
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const selectItem = (item: JobApplication) => {
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
  <div class="job-dropdown" ref="dropdownRef">
    <button
      type="button"
      class="dropdown-trigger"
      :class="{ 'is-active': isOpen }"
      @click="toggleDropdown"
    >
      + Link Job
    </button>

    <div v-if="isOpen" class="dropdown-panel">
      <div class="search-container">
        <span class="search-icon"><SearchIcon /></span>
        <input v-model="searchQuery" type="text" placeholder="Search jobs" autoFocus @click.stop />
      </div>

      <ul class="list">
        <li
          v-for="item in filteredItems"
          class="list-item"
          :key="item.id"
          :style="{ color: item.color ?? 'black' }"
          @click="selectItem(item)"
        >
          <span class="job-text"> {{ item.title }} @ {{ item.company?.name }} </span>
        </li>
        <li v-if="filteredItems.length === 0" class="no-results">No jobs found</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.job-dropdown {
  position: relative;
  width: 100%;
}

/* Trigger style matching the "+ Link Job" button */
.dropdown-trigger {
  width: 100%;
  padding: 10px 12px;
  background: white;
  border: 1px dashed #dadce0;
  border-radius: 6px;
  color: #5f6368;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-trigger:hover {
  background-color: #f8f9fa;
  border-color: #bdc1c6;
}

.dropdown-trigger.is-active {
  border-color: #1a73e8;
  border-style: solid;
}

/* Main Panel */
.dropdown-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #dadce0;
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
  border-bottom: 1px solid #f1f3f4;
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
