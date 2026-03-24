<script setup lang="ts">
// TODO: resolve duplication between DropdownList.vue and JobSelectDropdown.vue and BaseLinkDropdown.vue
import { computed, onMounted, onUnmounted, ref } from 'vue'
import SearchIcon from '@/assets/icons/SearchIcon.vue'

const props = defineProps<{
  list: string[]
  defaultValue?: string
  showListAbove?: boolean
}>()
const emit = defineEmits(['select'])

const isOpen = ref(false)
const selectedValue = ref(props.defaultValue ?? '')
const searchQuery = ref('')
const dropdownRef = ref<HTMLElement | null>(null)

const dropdownClasses = computed(() => ({
  'dropdown-panel': true,
  'list-above': props.showListAbove,
}))

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return props.list

  return props.list.filter((item) => item.toLowerCase().includes(query))
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const selectItem = (value: string) => {
  selectedValue.value = value
  emit('select', value)
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
  <div class="dropdown" ref="dropdownRef">
    <button
      type="button"
      class="dropdown-trigger"
      :class="{ 'is-active': isOpen }"
      @click="toggleDropdown"
    >
      <span>{{ selectedValue }}</span>

      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="ml-2 h-4 w-4 shrink-0 opacity-50"
      >
        <path
          d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>

    <div v-if="isOpen" :class="dropdownClasses">
      <div class="search-container">
        <span class="search-icon"><SearchIcon /></span>
        <input v-model="searchQuery" type="text" placeholder="Search" autoFocus @click.stop />
      </div>

      <ul class="list">
        <li
          v-for="value in filteredItems"
          class="list-item"
          :key="value"
          @click="selectItem(value)"
        >
          <span class="job-text"> {{ value }} </span>
        </li>
        <li v-if="filteredItems.length === 0" class="no-results">No results</li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.dropdown {
  position: relative;
  width: 100%;
}

.dropdown-trigger {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-main);
  border: 1px dashed var(--border-color);
  border-radius: 6px;
  color: #5f6368;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-trigger:hover {
  background-color: color-mix(in srgb, var(--bg-main), black 10%);
  border-color: color-mix(in srgb, var(--border-color), black 10%);
}

html.dark .dropdown-trigger:hover {
  background-color: color-mix(in srgb, var(--bg-main), white 10%);
  border-color: color-mix(in srgb, var(--border-color), white 10%);
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
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.list-above {
  top: unset;
  bottom: calc(100% + 4px);
  flex-direction: column-reverse;
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
  background: var(--input-border);
  border-radius: 10px;
}
</style>
