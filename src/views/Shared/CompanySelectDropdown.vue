<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCompanyAutocomplete, type SuggestedCompany } from '@/composables/useCompanyAutocomplete'
import CompanyImage from './CompanyImage.vue'

const { query, results, searchCompanies } = useCompanyAutocomplete()

const emit = defineEmits(['select'])
const props = defineProps<{ companyName?: string }>()

const dropdownRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (props.companyName) {
    query.value = props.companyName
  }
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchCompanies(target.value)
}

const selectCompany = (company: SuggestedCompany) => {
  results.value = []
  query.value = company.name
  emit('select')
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    results.value = []
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
  <div class="company-dropdown">
    <div class="input-group">
      <label for="company-search">Company</label>
      <input
        id="company-search"
        type="text"
        class="form-control"
        :value="query"
        @input="handleInput"
        @click="handleInput"
        placeholder="Type a company name (e.g., Google)..."
      />
    </div>

    <ul v-if="results.length > 0" class="dropdown-panel dropdown-list" ref="dropdownRef">
      <li
        v-for="company in results"
        :key="company.url"
        @click="selectCompany(company)"
        class="dropdown-item"
      >
        <CompanyImage :src="company.logo" :alt="company.name"></CompanyImage>
        <div class="dropdown-item-text">
          <span>{{ company.name }}</span>
          <span class="dropdown-item-text-url">{{ company.url }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.company-dropdown {
  position: relative;
  width: 100%;
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

/* Dropdown */
.dropdown-list {
  margin: 0;
  padding: 4px 0;
  list-style: none;
  max-height: 250px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  flex-direction: row;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.1s;
  gap: 1rem;
}

.dropdown-item-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dropdown-item-text-url {
  font-size: 0.75rem;
}

.dropdown-item:hover {
  background-color: #f1f3f4;
}

/* Custom Scrollbar */
.dropdown-list::-webkit-scrollbar {
  width: 6px;
}
.dropdown-list::-webkit-scrollbar-thumb {
  background: #dadce0;
  border-radius: 10px;
}
</style>
